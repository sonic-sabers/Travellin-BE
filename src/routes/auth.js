import express from "express";
import { signup, signin, logout, refreshAccessToken } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);

export default router;
