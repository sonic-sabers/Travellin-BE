import express from "express";
import { addLocation, deleteLocation, getLocations, searchLocations, getLocationDetails, updateLocation } from "../controllers/itinerary.js";
import itinerary from "../models/Itinerary.js";

const router = express.Router();


router.post("/addLocation", addLocation);
router.get("/getLocations/:id", getLocations);
router.get("/getLocationDetails/:id", getLocationDetails);
router.get("/searchLocations", searchLocations);
router.put("/updateLocation/:id", updateLocation);
router.delete("/deleteLocation/:id", deleteLocation);

export default router;
