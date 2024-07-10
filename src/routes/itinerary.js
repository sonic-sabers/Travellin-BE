import express from "express";
import {
  addItinerary,
  editItinerary,
  removeItinerary,
  getUserItineraryList,
  getItineraryDetails,
  findItineraries,
  uploadItineraryDocument,
  uploadDocumentToDestination,
  uploadDocumentToAccommodation,
  uploadDocumentToTransportation,
  uploadDocumentToActivity,
} from "../controllers/itineraryController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", verifyToken, addItinerary);
router.put("/edit/:itineraryId", verifyToken, editItinerary);
router.delete("/remove/:itineraryId", verifyToken, removeItinerary);
router.get("/user", verifyToken, getUserItineraryList);
router.get("/details/:itineraryId", verifyToken, getItineraryDetails);
router.get("/search", verifyToken, findItineraries);
router.post("/upload/:itineraryId", verifyToken, uploadItineraryDocument);

// New routes for uploading documents
router.post("/upload/destination/:itineraryId/:destinationId", verifyToken, uploadDocumentToDestination);
router.post("/upload/accommodation/:itineraryId/:destinationId/:accommodationId", verifyToken, uploadDocumentToAccommodation);
router.post("/upload/transportation/:itineraryId/:destinationId/:transportationId", verifyToken, uploadDocumentToTransportation);
router.post("/upload/activity/:itineraryId/:destinationId/:activityId", verifyToken, uploadDocumentToActivity);

export default router;
