import express from "express";
import {
  createComment,
  deleteComment,
  getAllCommentsByPostId,
} from "../controllers/commentController";

const router = express.Router();

router.get("/:pinId", getAllCommentsByPostId);
router.delete("/:commentId", deleteComment);
router.post("/", createComment);

export default router;
