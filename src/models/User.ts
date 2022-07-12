import { Schema, model, Document } from "mongoose";
import { IUser } from "../types/express/index.d.";

interface IUserModel extends IUser, Document {}

const userSchema = new Schema<IUserModel>(
  {
    name: {
      type: String,
      maxLength: [50, `Username too long`],
      minLength: [5, `Username too short`],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IUserModel>("User", userSchema);
