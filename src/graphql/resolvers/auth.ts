import { GraphQLError } from "graphql";
import { User } from "../../db/models/user";
import {
  TokenType,
  generateAccessToken,
  generateRefreshToken,
  getTokenPayload,
  verifyToken,
} from "../../utils/auth";
import { ApolloContext } from "../../types/apollo";
import { BadRequest, UserNotAuthenticated } from "../../utils/apollo";
import { RedisKeys } from "../../redis/keys";

export default {
  Mutation: {
    createUser: async (parent, args, context, info) => {
      const {
        input: { name, email, password },
      } = args;

      const existingUser = await User.findOne({
        email,
      });

      if (existingUser) {
        throw new GraphQLError(`User already existing with provided email.`);
      }

      const response = await User.create({
        name,
        email,
        password,
      });
      const payload = { id: response._id, name, email };

      return {
        refreshToken: generateRefreshToken({
          ...payload,
          tokenType: TokenType.REFRESH,
        }),

        accessToken: generateAccessToken({
          ...payload,
          tokenType: TokenType.ACCESS,
        }),
      };
    },
    login: async (parent, args, context: ApolloContext, info) => {
      const {
        input: { email, password },
      } = args;

      const user = await User.findOne({ email });

      if (!user) {
        throw new GraphQLError(`Didn't find the user with the provided email.`);
      }

      const isPasswordMatched = await user.comparePassword(password);

      if (!isPasswordMatched) {
        throw new UserNotAuthenticated();
      }

      const payload = { userId: user._id, name: user.name, email: user.email };

      return {
        refreshToken: generateRefreshToken({
          ...payload,
          tokenType: TokenType.REFRESH,
        }),
        accessToken: generateAccessToken({
          ...payload,
          tokenType: TokenType.ACCESS,
        }),
      };
    },
    updatePassword: async (parent, args, context: ApolloContext, info) => {
      const { oldPassword, newPassword, accessToken, refreshToken } =
        args || {};

      if (!oldPassword) {
        throw new BadRequest("please provide old password");
      }

      if (!newPassword) {
        throw new BadRequest(`please provide new password`);
      }

      if (!accessToken) {
        throw new BadRequest(`please provide access token`);
      }

      if (!refreshToken) {
        throw new BadRequest(`please provide refresh token`);
      }

      const { user } = context;

      if (!user) {
        throw new UserNotAuthenticated();
      }

      const isOldPasswordCorrect = await user.comparePassword(oldPassword);

      if (!isOldPasswordCorrect) {
        throw new BadRequest("old password is not correct");
      }

      user.password = newPassword;

      const accessTokenId: string = (getTokenPayload(accessToken) as any).id;
      const refreshTokenId: string = (getTokenPayload(refreshToken) as any).id;

      const { redisClient } = context.dataSources;

      await redisClient.SADD(RedisKeys.BLACKLISTED_TOKENS, [
        accessTokenId,
        refreshTokenId,
      ]);

      await user.save();

      const payload = { userId: user._id, name: user.name, email: user.email };

      return {
        refreshToken: generateRefreshToken({
          ...payload,
          tokenType: TokenType.REFRESH,
        }),
        accessToken: generateAccessToken({
          ...payload,
          tokenType: TokenType.ACCESS,
        }),
      };
    },
    getNewTokens: async (parent, args, context: ApolloContext, info) => {
      const { refreshToken } = args;
      const { redisClient } = context.dataSources;

      try {
        verifyToken(refreshToken);
        const refreshTokenId = (getTokenPayload(refreshToken) as any).id;

        const isTokenBlackListed = await redisClient.SISMEMBER(
          RedisKeys.BLACKLISTED_TOKENS,
          refreshTokenId
        );

        if (isTokenBlackListed) {
          throw new Error();
        }
      } catch (error) {
        throw new BadRequest("you have been logged out, please login again :(");
      }

      let payload = getTokenPayload(refreshToken) as any;

      const user = await User.findById(payload.userId || payload.id);

      if (!user) {
        throw new GraphQLError("user not found");
      }

      payload = { userId: user._id, name: user.name, email: user.email };

      return {
        refreshToken: generateRefreshToken({
          ...payload,
          tokenType: TokenType.REFRESH,
        }),
        accessToken: generateAccessToken({
          ...payload,
          tokenType: TokenType.ACCESS,
        }),
      };
    },
  },
};
