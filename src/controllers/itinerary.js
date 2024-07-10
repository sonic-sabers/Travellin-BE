import {
  createItinerary,
  updateItinerary,
  deleteItinerary,
  getUserItineraries,
  getItineraryById,
  searchItineraries,
} from "../services/itineraryService.js";
import upload from "../middlewares/upload.js";
import Itinerary from "../models/Itinerary.js"; // Import the Itinerary model
import multer from "multer";

export const addItinerary = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, destinations } = req.body;
    const itinerary = await createItinerary(title, description, req.user.id, startDate, endDate, destinations);
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Execution Successful.",
      data: itinerary,
    });
  } catch (error) {
    next(error);
  }
};

export const editItinerary = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, destinations } = req.body;
    const itinerary = await updateItinerary(req.params.itineraryId, title, description, startDate, endDate, destinations);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Execution Successful.",
      data: itinerary,
    });
  } catch (error) {
    next(error);
  }
};

export const removeItinerary = async (req, res, next) => {
  try {
    await deleteItinerary(req.params.itineraryId);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Execution Successful.",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserItineraryList = async (req, res, next) => {
  try {
    const itineraries = await getUserItineraries(req.user.id);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Execution Successful.",
      data: itineraries.map(itinerary => ({
        ...itinerary.toObject(),
        documentUrl: itinerary.document // Include the document URL
      })),
      page: 0,
      total: itineraries.length,
      limit: itineraries.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getItineraryDetails = async (req, res, next) => {
  try {
    const itinerary = await getItineraryById(req.params.itineraryId);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Execution Successful.",
      data: {
        ...itinerary.toObject(),
        documentUrl: itinerary.document // Include the document URL
      }
    });
  } catch (error) {
    next(error);
  }
};


export const findItineraries = async (req, res, next) => {
  try {
    const { search } = req.query;
    const itineraries = await searchItineraries(req.user.id, search);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Execution Successful.",
      data: itineraries,
      page: 0,
      total: itineraries.length,
      limit: itineraries.length,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadDocument = async (req, res, next) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: err.message
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "No file uploaded"
      });
    }

    // Save file URL to MongoDB
    try {
      const itinerary = await Itinerary.findById(req.params.itineraryId);
      if (!itinerary) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Itinerary not found"
        });
      }
      itinerary.document = req.file.location; // Save the S3 file URL
      await itinerary.save();

      res.status(201).json({
        success: true,
        statusCode: 201,
        message: "File uploaded successfully",
        data: {
          ...itinerary.toObject(),
          documentUrl: req.file.location // Include the file URL in the response
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: error.message
      });
    }
  });
};

