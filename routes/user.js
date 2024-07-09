import express from "express";
import { getUser, updateUser, deleteUser } from "../controllers/user.js";

const router = express.Router();


router.get("/user-details/:id", getUser);
router.put("/update-details/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);

/*router.get("/all/users", getAllUsers); */

export default router;
