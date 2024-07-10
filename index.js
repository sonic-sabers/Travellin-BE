import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/user.js';
import itineraryRoutes from './src/routes/itinerary.js';
import errorMiddleware from './src/middlewares/error.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 6000;
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/itinerary', itineraryRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
