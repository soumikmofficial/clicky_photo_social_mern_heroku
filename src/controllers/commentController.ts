import { StatusCodes } from "http-status-codes";
import Comment from "../models/Comment";
import { Request, Response } from "express";
import CustomAPIError from "../errors/errors";

export const getAllCommentsByPostId = async (req: Request, res: Response) => {
  const comments = await Comment.find({ pinId: req.params.pinId })
    .populate("userId")
    .sort("-createdAt");
  res.status(StatusCodes.OK).json(comments);
};

export const createComment = async (req: Request, res: Response) => {
  const { pinId, userId, comment } = req.body;
  if (!pinId || !userId || !comment) {
    throw new CustomAPIError(
      StatusCodes.BAD_REQUEST,
      `missing one or more fields`
    );
  }
  const newComment = new Comment({ pinId, userId, comment });
  await newComment.save();
  res.status(StatusCodes.CREATED).json({ comment: newComment });
};

export const deleteComment = async (req: Request, res: Response) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment)
    throw new CustomAPIError(StatusCodes.BAD_REQUEST, `comment does not exist`);
  await comment.remove();
  res.status(StatusCodes.OK).json({ comment });
};
