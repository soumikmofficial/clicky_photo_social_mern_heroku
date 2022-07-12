import { StatusCodes } from "http-status-codes";
import User from "../models/User";
import { Request, Response } from "express";
import CustomAPIError from "../errors/errors";
import { verifyToken } from "../utils/verifyGoogleToken";
import mongoose from "mongoose";
import * as crypto from "crypto";

export const addOrGetUser = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token)
    throw new CustomAPIError(
      StatusCodes.BAD_REQUEST,
      "one or more informations are missing"
    );
  const userDetails = await verifyToken(token);

  if (!userDetails)
    throw new CustomAPIError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `login unsuccessful...try again`
    );

  res.cookie("googleToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });

  const user = await User.findOne({ email: userDetails.email });
  if (!user) {
    const newUser = new User({
      name: userDetails.name,
      avatar: userDetails.picture,
      email: userDetails.email,
      googleId: userDetails.sub,
    });
    await newUser.save();
    return res.status(StatusCodes.CREATED).json({ user: newUser });
  }
  res.status(StatusCodes.OK).json({ user });
};

// todo: get user by ID
export const fetchUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId);
  if (!user) throw new CustomAPIError(StatusCodes.BAD_REQUEST, `user not find`);
  res.status(StatusCodes.OK).json(user);
};

// todo: logout
export const logout = async (req: Request, res: Response) => {
  res.cookie("googleToken", "logout", {
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ status: "success" });
};
