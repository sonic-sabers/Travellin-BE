import Itinerary from "../models/Itinerary.js";
import User from "../models/User.js";
import { createError } from "../middlewares/error.js";

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
  const itinerary = await Itinerary.findByIdAndUpdate(
    id,
    { title, description, startDate, endDate, destinations },
    { new: true }
  );
  if (!itinerary) throw createError(404, "Itinerary not found");

  return itinerary;
};

export const deleteItinerary = async (id) => {
  const itinerary = await Itinerary.findByIdAndDelete(id);
  if (!itinerary) throw createError(404, "Itinerary not found");

  await User.updateMany({}, { $pull: { itineraries: id } });
  return;
};

export const getUserItineraries = async (userId) => {
  const itineraries = await Itinerary.find({ userId }).sort({ createdAt: -1 });
  return itineraries;
};

export const getItineraryById = async (id) => {
  const itinerary = await Itinerary.findById(id);
  if (!itinerary) throw createError(404, "Itinerary not found");

  return itinerary;
};

export const searchItineraries = async (userId, searchTerm) => {
  const query = {};

  if (userId) query.userId = userId;
  if (searchTerm) query.$or = [
    { title: { $regex: searchTerm, $options: 'i' } },
    { description: { $regex: searchTerm, $options: 'i' } },
    { "destinations.location": { $regex: searchTerm, $options: 'i' } },
  ];

  const itineraries = await Itinerary.find(query).sort({ createdAt: -1 });
  return itineraries;
};
