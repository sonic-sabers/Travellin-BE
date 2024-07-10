import jwt from 'jsonwebtoken';
import { createError } from './error.js';

export const verifyToken = (req, res, next) => {
  const token = req.headers['access-token'];
  if (!token) return next(createError(401, 'Access token is required'));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, 'Invalid or expired access token'));
    req.user = user;
    next();
  });
};
