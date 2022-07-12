import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/verifyGoogleToken";
import { StatusCodes } from "http-status-codes";
import CustomAPIError from "../errors/errors";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { googleToken } = req.signedCookies;
  const userDetails = await verifyToken(googleToken);
  if (!userDetails) {
    throw new CustomAPIError(StatusCodes.UNAUTHORIZED, `authentication failed`);
  }

  const tokenUser = {
    googleId: userDetails.sub,
    email: userDetails.email,
  };
  req.user = tokenUser;
  next();
};
