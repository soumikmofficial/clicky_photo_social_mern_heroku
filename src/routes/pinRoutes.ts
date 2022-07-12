import {
  getAllPins,
  createPin,
  saveUnsavePin,
  getSinglePin,
  getAllCategories,
  getPinsSavedByUser,
  getPinsCreatedByUser,
  deletePin,
} from "./../controllers/pinController";
import express from "express";
import multer from "multer";
import { authenticateUser } from "../middlewares/authentication";

const router = express.Router();

// todo: multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./tmp");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Math.round(Math.random() * 1e4);
    cb(null, file.originalname.split(".")[0] + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.post("/", authenticateUser, upload.single("image"), createPin);
router.post("/save", saveUnsavePin);
router.get("/categories", getAllCategories);
router.get("/", authenticateUser, getAllPins);
router.get("/:pinId", getSinglePin);
router.delete("/:pinId", authenticateUser, deletePin);
router.get("/saved-by/:userId", getPinsSavedByUser);
router.get("/created-by/:userId", getPinsCreatedByUser);

export default router;
