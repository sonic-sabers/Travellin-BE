import User from "../models/User.js";
import { createError } from "../middlewares/error.js";

export const getUserService = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw createError(404, "User not found");
  return user;
};

export const updateUserService = async (id, data) => {
  const user = await User.findByIdAndUpdate(id, { $set: data }, { new: true }).select("-password");
  if (!user) throw createError(404, "User not found");
  return user;
};

export const deleteUserService = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw createError(404, "User not found");
  return;
};
