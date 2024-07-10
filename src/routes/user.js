import express from "express";
import { getUser, updateUser, deleteUser } from "../controllers/user.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/user-details", verifyToken, getUser);
router.put("/update-details", verifyToken, updateUser);
router.delete("/delete-user", verifyToken, deleteUser);

export default router;
