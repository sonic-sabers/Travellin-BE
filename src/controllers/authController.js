import { signupService, signinService } from '../services/authService.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
import jwt from 'jsonwebtoken';
import { createError } from '../middlewares/error.js';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, phoneNo } = req.body;
    const result = await signupService(name, email, password, phoneNo);
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Execution Successful.',
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await signinService(email, password);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Execution Successful.',
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

export const refreshAccessToken = (req, res, next) => {
  const { token } = req.body;
  if (!token) return next(createError(401, 'Refresh token is required'));

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return next(createError(403, 'Invalid or expired refresh token'));

    const newAccessToken = generateAccessToken(user);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Execution Successful.',
      accessToken: newAccessToken,
    });
  });
};

export const logout = (req, res) => {
  res.cookie('access_token', 'none', { expires: new Date(Date.now() + 5 * 1000), httpOnly: true });
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Execution Successful.',
  });
};
