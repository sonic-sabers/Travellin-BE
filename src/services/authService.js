import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { createError } from '../middlewares/error.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

export const signupService = async (name, email, password, phoneNo) => {
  const existingUser = await User.findOne({ $or: [{ email }, { phoneNo }] });
  if (existingUser) throw createError(409, 'User already exists');

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = new User({ name, email, password: hash, phoneNo });
  await user.save();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const { password: _, ...userData } = user._doc;

  return { accessToken, refreshToken, userData };
};

export const signinService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, 'Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createError(401, 'Invalid email or password');

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const { password: _, ...userData } = user._doc;

  return { accessToken, refreshToken, userData };
};
