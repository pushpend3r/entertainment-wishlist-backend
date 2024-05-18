import jwt from "jsonwebtoken";

const jwtSecretKey = process.env.JWT_SECRET_KEY!;

export enum TokenType {
  ACCESS = "access",
  REFRESH = "refresh",
}

export const generateJwt = (
  payload: any,
  expiresIn: jwt.SignOptions["expiresIn"]
) => {
  return jwt.sign(payload, jwtSecretKey, { expiresIn });
};

export const generateAccessToken = (payload: any) => {
  payload.id = `${TokenType.ACCESS}_${new Date().getTime()}_${payload.userId}`;
  return generateJwt(payload, "10h");
};

export const generateRefreshToken = (payload: any) => {
  payload.id = `${TokenType.REFRESH}_${new Date().getTime()}_${payload.userId}`;
  return generateJwt(payload, "2d");
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, jwtSecretKey);
};

export const getTokenPayload = (token: string) => {
  return jwt.decode(token);
};
