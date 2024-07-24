import {
  createItinerary,
  updateItinerary,
  deleteItinerary,
  getUserItineraries,
  getItineraryById,
  searchItineraries,
  uploadItineraryDocumentService,
  uploadDocumentToDestinationService,
  uploadDocumentToAccommodationService,
  uploadDocumentToTransportationService,
  uploadDocumentToActivityService,
} from '../services/itineraryService.js';
import upload from '../middlewares/upload.js';
import multer from "multer";

const addDocumentUrls = (entity) => ({
  ...entity.toObject(),
  documentUrl: entity.document,
});

const transformItinerary = (itinerary) => ({
  ...itinerary.toObject(),
  destinations: itinerary.destinations.map(destination => ({
    ...addDocumentUrls(destination),
    accommodations: destination.accommodations.map(accommodation => addDocumentUrls(accommodation)),
    transportations: destination.transportations.map(transportation => addDocumentUrls(transportation)),
    activities: destination.activities.map(activity => addDocumentUrls(activity)),
  })),
  destinationsId: itinerary.destinations.map(destination => destination._id),
  accommodationsId: itinerary.destinations.flatMap(destination => destination.accommodations.map(accommodation => accommodation._id)),
  transportationsId: itinerary.destinations.flatMap(destination => destination.transportations.map(transportation => transportation._id)),
  activitiesId: itinerary.destinations.flatMap(destination => destination.activities.map(activity => activity._id)),
  documentUrl: itinerary.document,
});

export const addItinerary = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, destinations } = req.body;
    const itinerary = await createItinerary(title, description, req.user.id, startDate, endDate, destinations);
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Itinerary created successfully.",
      data: transformItinerary(itinerary),
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
      message: "Itinerary updated successfully.",
      data: transformItinerary(itinerary),
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
      message: "Itinerary removed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserItineraryList = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const { itineraries, total } = await getUserItineraries(req.user.id, page, pageSize);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User itineraries retrieved successfully.",
      data: itineraries.map(transformItinerary),
      page: parseInt(page, 10),
      total: total,
      limit: parseInt(pageSize, 10),
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
      message: "Itinerary details retrieved successfully.",
      data: transformItinerary(itinerary),
    });
  } catch (error) {
    next(error);
  }
};

export const findItineraries = async (req, res, next) => {
  try {
    const { search, page = 1, pageSize = 10 } = req.query;
    const { itineraries, total } = await searchItineraries(req.user.id, search, page, pageSize);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Itineraries search executed successfully.",
      data: itineraries.map(transformItinerary),
      page: parseInt(page, 10),
      total: total,
      limit: parseInt(pageSize, 10),
    });
  } catch (error) {
    next(error);
  }
};

// Function to upload document to itinerary
export const uploadItineraryDocument = async (req, res, next) => {
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
      const { itinerary, publicUrl } = await uploadItineraryDocumentService(req.params.itineraryId, req.file.location);
      res.status(201).json({
        success: true,
        statusCode: 201,
        message: "File uploaded successfully",
        data: {
          ...transformItinerary(itinerary),
          documentUrl: req.file.location, // Include the file URL in the response
          publicUrl: publicUrl // Include the public URL in the response
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

// Functions to handle document upload for Destination, Accommodation, Transportation, Activity

export const uploadDocumentToDestination = async (req, res, next) => {
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

    try {
      const { destination, publicUrl } = await uploadDocumentToDestinationService(req.params.itineraryId, req.params.destinationId, req.file.location);
      res.status(201).json({
        success: true,
        statusCode: 201,
        message: "File uploaded successfully",
        data: {
          ...addDocumentUrls(destination),
          documentUrl: req.file.location,
          publicUrl: publicUrl
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

export const uploadDocumentToAccommodation = async (req, res, next) => {
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

    try {
      const { accommodation, publicUrl } = await uploadDocumentToAccommodationService(req.params.itineraryId, req.params.destinationId, req.params.accommodationId, req.file.location);
      res.status(201).json({
        success: true,
        statusCode: 201,
        message: "File uploaded successfully",
        data: {
          ...addDocumentUrls(accommodation),
          documentUrl: req.file.location,
          publicUrl: publicUrl
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

export const uploadDocumentToTransportation = async (req, res, next) => {
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

    try {
      const { transportation, publicUrl } = await uploadDocumentToTransportationService(req.params.itineraryId, req.params.destinationId, req.params.transportationId, req.file.location);
      res.status(201).json({
        success: true,
        statusCode: 201,
        message: "File uploaded successfully",
        data: {
          ...addDocumentUrls(transportation),
          documentUrl: req.file.location,
          publicUrl: publicUrl
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

export const uploadDocumentToActivity = async (req, res, next) => {
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

    try {
      const { activity, publicUrl } = await uploadDocumentToActivityService(req.params.itineraryId, req.params.destinationId, req.params.activityId, req.file.location);
      res.status(201).json({
        success: true,
        statusCode: 201,
        message: "File uploaded successfully",
        data: {
          ...addDocumentUrls(activity),
          documentUrl: req.file.location,
          publicUrl: publicUrl
        },
      });
    } catch (error) {
      next(error);
    }
  });
};
