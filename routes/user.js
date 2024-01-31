import express from "express";
import { getUser, updateUser, deleteUser } from "../controllers/user.js";

const router = express.Router();


router.get("/:id", getUser);
router.put("/update/:id", updateUser);
router.post("/delete/:id", deleteUser);

/*router.get("/all/users", getAllUsers); */

export default router;
