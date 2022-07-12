import express from "express";
import { addOrGetUser, fetchUser, logout } from "../controllers/userController";
const router = express.Router();

router.post("/", addOrGetUser);
router.get("/:userId", fetchUser);
router.delete("/logout", logout);

export default router;
