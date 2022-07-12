import mongoose, { Schema, model, Document, Types } from "mongoose";

interface IComment {
  userId: Types.ObjectId;
  pinId: Types.ObjectId;
  comment: string;
}

export interface ICommentModel extends IComment, Document {}

const commentSchmea = new Schema<ICommentModel>(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
      maxLength: [200, "Comments must be 200 characters or less"],
    },
    pinId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Pin",
      required: true,
    },
  },
  { timestamps: true }
);

export default model<ICommentModel>("Comment", commentSchmea);
