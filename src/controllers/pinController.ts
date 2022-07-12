import { StatusCodes } from "http-status-codes";
import fs from "fs";
import Pin from "../models/Pin";
import { Request, Response } from "express";
import CustomAPIError from "../errors/errors";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import User from "../models/User";

// todo: create a pin
export const createPin = async (req: Request, res: Response) => {
  const { about, category, title } = req.body;
  const user = await User.findOne({ googleId: req.user.googleId });
  if (!user)
    throw new CustomAPIError(
      StatusCodes.BAD_REQUEST,
      `couldn't create pin... please try loggin back in`
    );

  if (!about || !category || !title) {
    throw new CustomAPIError(
      StatusCodes.BAD_REQUEST,
      `one or more fields are missing`
    );
  }
  if (!req.file) {
    throw new CustomAPIError(StatusCodes.BAD_REQUEST, `image is missing`);
  }

  // ? upload image
  const uploadFile: UploadApiResponse = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "photo-app-pins",
      resource_type: "image",
      eager: "fl_attachment",
    }
  );

  fs.unlinkSync(req.file.path);

  const pin = new Pin({
    userId: user._id,
    category,
    about,
    image: uploadFile.secure_url,
    cloudinaryId: uploadFile.public_id,
    downloadUrl: uploadFile.eager[0].secure_url,
    title,
  });

  await pin.save();

  res.status(StatusCodes.CREATED).json({ status: "success", pin });
};

// todo: get all pins
export const getAllPins = async (req: Request, res: Response) => {
  const { category, search } = req.query;
  let queryObj: any = {};
  if (category) {
    queryObj.category = category;
  }
  if (search) {
    queryObj.$or = [
      { title: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }
  const pins = await Pin.find(queryObj).populate("userId").sort("-createdAt");
  res.status(StatusCodes.OK).json(pins);
};

// todo: get single pin
export const getSinglePin = async (req: Request, res: Response) => {
  const pin = await Pin.findById(req.params.pinId).populate("userId");
  if (!pin) {
    throw new CustomAPIError(StatusCodes.BAD_REQUEST, `pin does not exist`);
  }
  res.status(StatusCodes.OK).json(pin);
};

// todo: save or unsave a pin
export const saveUnsavePin = async (req: Request, res: Response) => {
  const { userId, pinId } = req.body;
  if (!pinId)
    throw new CustomAPIError(
      StatusCodes.BAD_REQUEST,
      `pin id missing in the url`
    );
  if (!userId)
    throw new CustomAPIError(
      StatusCodes.BAD_REQUEST,
      `missing user information... try logging in`
    );
  const pin = await Pin.findById(pinId);
  if (!pin)
    throw new CustomAPIError(StatusCodes.BAD_REQUEST, `pin does not exist`);
  if (pin.saves?.includes(userId)) {
    const updatedPin = await Pin.findOneAndUpdate(
      { _id: pinId },
      { $pull: { saves: userId } }
    );
    return res.status(StatusCodes.OK).json(updatedPin);
  }
  const updatedPin = await Pin.findOneAndUpdate(
    { _id: pinId },
    { $push: { saves: userId } }
  );
  res.status(StatusCodes.OK).json(updatedPin);
};

// todo: get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  const categories = await Pin.aggregate([
    { $match: {} },
    { $sortByCount: "$category" },
  ]);
  res.status(StatusCodes.OK).json(categories);
};

// todo: get all pins saved by a user
export const getPinsSavedByUser = async (req: Request, res: Response) => {
  const pins = await Pin.find({ saves: req.params.userId }).populate("userId");
  res.status(StatusCodes.OK).json(pins);
};

// todo: get all pins created by a user
export const getPinsCreatedByUser = async (req: Request, res: Response) => {
  const pins = await Pin.find({ userId: req.params.userId }).populate("userId");
  res.status(StatusCodes.OK).json(pins);
};

// todo: delete pin
export const deletePin = async (req: Request, res: Response) => {
  const { pinId } = req.params;
  const pin = await Pin.findById(pinId).populate("userId");
  if (!pin) throw new CustomAPIError(StatusCodes.BAD_REQUEST, `pin not found`);
  if (pin.userId.googleId !== req.user.googleId) {
    throw new CustomAPIError(
      StatusCodes.UNAUTHORIZED,
      `not authorized to delete pins of other users`
    );
  }
  await pin.remove();

  res.status(StatusCodes.OK).json(pin);
};
