import Itinerary from "../models/Itinerary.js";
import User from "../models/User.js";
import { createError } from "../middlewares/error.js";

const generatePublicUrl = (documentUrl) => {
  // Assuming your documents are hosted in a public bucket or accessible URL.
  // Adjust the base URL as needed.
  const baseUrl = "https://your-public-bucket.s3.amazonaws.com/";
  return `${baseUrl}${documentUrl}`;
};

export const createItinerary = async (title, description, userId, startDate, endDate, destinations) => {
  const user = await User.findById(userId);
  if (!user) throw createError(404, "User not found");

  const itinerary = new Itinerary({ title, description, userId: user._id, startDate, endDate, destinations });
  await itinerary.save();

  user.itineraries.push(itinerary._id);
  await user.save();

  return itinerary;
};

export const updateItinerary = async (id, title, description, startDate, endDate, destinations) => {
  const itinerary = await Itinerary.findById(id);
  if (!itinerary) throw createError(404, "Itinerary not found");

  itinerary.title = title;
  itinerary.description = description;
  itinerary.startDate = startDate;
  itinerary.endDate = endDate;
  itinerary.destinations = destinations;

  await itinerary.save();

  return itinerary;
};

export const deleteItinerary = async (id) => {
  const itinerary = await Itinerary.findById(id);
  if (!itinerary) throw createError(404, "Itinerary not found");

  await Itinerary.findByIdAndDelete(id);
  await User.updateMany({}, { $pull: { itineraries: id } });

  return;
};

export const getUserItineraries = async (userId, page = 1, pageSize = 10) => {
  const skip = (page - 1) * pageSize;
  const total = await Itinerary.countDocuments({ userId });
  const itineraries = await Itinerary.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize);
  
  return { itineraries, total };
};

export const getItineraryById = async (id) => {
  const itinerary = await Itinerary.findById(id);
  if (!itinerary) throw createError(404, "Itinerary not found");

  return itinerary;
};

export const searchItineraries = async (userId, searchTerm, page = 1, pageSize = 10) => {
  const query = {};

  if (userId) query.userId = userId;
  if (searchTerm) query.$or = [
    { title: { $regex: searchTerm, $options: 'i' } },
    { description: { $regex: searchTerm, $options: 'i' } },
    { "destinations.location": { $regex: searchTerm, $options: 'i' } },
  ];

  const skip = (page - 1) * pageSize;
  const total = await Itinerary.countDocuments(query);
  const itineraries = await Itinerary.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize);
  
  return { itineraries, total };
};

export const uploadItineraryDocumentService = async (itineraryId, documentUrl) => {
  if (!documentUrl) throw createError(400, "Document URL is required");

  const itinerary = await Itinerary.findById(itineraryId);
  if (!itinerary) throw createError(404, "Itinerary not found");

  const publicUrl = generatePublicUrl(documentUrl);
  itinerary.document = documentUrl;
  await itinerary.save();

  return { itinerary, publicUrl };
};

export const uploadDocumentToDestinationService = async (itineraryId, destinationId, documentUrl) => {
  if (!documentUrl) throw createError(400, "Document URL is required");

  const itinerary = await Itinerary.findById(itineraryId);
  if (!itinerary) throw createError(404, "Itinerary not found");

  const destination = itinerary.destinations.id(destinationId);
  if (!destination) throw createError(404, "Destination not found");

  const publicUrl = generatePublicUrl(documentUrl);
  destination.document = documentUrl;
  await itinerary.save();

  return { destination, publicUrl };
};

export const uploadDocumentToAccommodationService = async (itineraryId, destinationId, accommodationId, documentUrl) => {
  if (!documentUrl) throw createError(400, "Document URL is required");

  const itinerary = await Itinerary.findById(itineraryId);
  if (!itinerary) throw createError(404, "Itinerary not found");

  const destination = itinerary.destinations.id(destinationId);
  if (!destination) throw createError(404, "Destination not found");

  const accommodation = destination.accommodations.id(accommodationId);
  if (!accommodation) throw createError(404, "Accommodation not found");

  const publicUrl = generatePublicUrl(documentUrl);
  accommodation.document = documentUrl;
  await itinerary.save();

  return { accommodation, publicUrl };
};

export const uploadDocumentToTransportationService = async (itineraryId, destinationId, transportationId, documentUrl) => {
  if (!documentUrl) throw createError(400, "Document URL is required");

  const itinerary = await Itinerary.findById(itineraryId);
  if (!itinerary) throw createError(404, "Itinerary not found");

  const destination = itinerary.destinations.id(destinationId);
  if (!destination) throw createError(404, "Destination not found");

  const transportation = destination.transportations.id(transportationId);
  if (!transportation) throw createError(404, "Transportation not found");

  const publicUrl = generatePublicUrl(documentUrl);
  transportation.document = documentUrl;
  await itinerary.save();

  return { transportation, publicUrl };
};

export const uploadDocumentToActivityService = async (itineraryId, destinationId, activityId, documentUrl) => {
  if (!documentUrl) throw createError(400, "Document URL is required");

  const itinerary = await Itinerary.findById(itineraryId);
  if (!itinerary) throw createError(404, "Itinerary not found");

  const destination = itinerary.destinations.id(destinationId);
  if (!destination) throw createError(404, "Destination not found");

  const activity = destination.activities.id(activityId);
  if (!activity) throw createError(404, "Activity not found");

  const publicUrl = generatePublicUrl(documentUrl);
  activity.document = documentUrl;
  await itinerary.save();

  return { activity, publicUrl };
};
