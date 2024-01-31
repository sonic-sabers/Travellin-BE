import express from 'express';
import { db } from './config/db.js';
// import connectDB from './config/db';
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import itineraryRoutes from './routes/itinerary.js';
import cors from "cors";
import bodyParser from 'body-parser';
import errorMiddleware from './error.js';


dotenv.config();
const PORT = process.env.PORT || 8080;
const app = express();
// const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message: message,
  });
});


app.use(express.json());
app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});
// app.use([users]);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/itinerary", itineraryRoutes);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});