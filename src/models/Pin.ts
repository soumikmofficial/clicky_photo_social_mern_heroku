import mongoose, { Schema, model, Document, Types } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { IUser } from "../types/express/index.d.";

interface IPin {
  userId: IUser;
  image: string;
  saves: Types.ObjectId[] | string[] | undefined;
  about: string;
  category: string;
  cloudinaryId: string;
  downloadUrl: string;
  title: string;
}

interface IPinModel extends IPin, Document {}

const pinSchema = new Schema<IPinModel>(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    downloadUrl: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      required: true,
    },

    about: {
      type: String,
      required: true,
      maxLength: [150, "Description is too long"],
    },
    category: {
      type: String,
      required: true,
      maxLength: [30, "Category is too long"],
      trim: true,
      lowercase: true,
    },
    saves: {
      type: Array,
    },
  },
  { timestamps: true }
);

// ? removes the image from cloudinary before removing the pin from db
pinSchema.pre("remove", async function () {
  await cloudinary.uploader.destroy(this.cloudinaryId);
});

export default model<IPinModel>("Pin", pinSchema);
