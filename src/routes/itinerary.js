import express from "express";
import {
  addItinerary,
  editItinerary,
  removeItinerary,
  getUserItineraryList,
  getItineraryDetails,
  findItineraries,
  uploadDocument,
} from "../controllers/itinerary.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", verifyToken, addItinerary);
router.put("/edit/:itineraryId", verifyToken, editItinerary);
router.delete("/remove/:itineraryId", verifyToken, removeItinerary);
router.get("/user", verifyToken, getUserItineraryList);
router.get("/details/:itineraryId", verifyToken, getItineraryDetails);
router.get("/search", verifyToken, findItineraries);
router.post("/upload/:itineraryId", verifyToken, uploadDocument); // Ensure this route is correctly defined

export default router;
