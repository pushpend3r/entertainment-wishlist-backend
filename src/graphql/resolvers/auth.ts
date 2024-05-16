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

      const payload = { id: user._id, name: user.name, email: user.email };

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
      const { newPassword } = args || {};

      if (!newPassword) {
        throw new GraphQLError(`Please provide the new password.`);
      }

      const { user } = context;

      if (!user) {
        throw new UserNotAuthenticated();
      }

      user.password = newPassword;

      await user.save();

      return user;
    },
    getNewTokens: async (parent, args, context: ApolloContext, info) => {
      const { refreshToken } = args;

      try {
        verifyToken(refreshToken);
      } catch (error) {
        throw new BadRequest("you have been logged out, please login again :(");
      }

      let payload = getTokenPayload(refreshToken) as any;

      const user = await User.findById(payload.id);

      if (!user) {
        throw new GraphQLError("user not found");
      }

      payload = { id: payload.id, name: payload.name, email: payload.email };

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
