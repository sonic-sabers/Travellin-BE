// const User = require("../models/User");
import User from "../models/User.js";
import Itinerary from "../models/Itinerary.js";
import multer from "multer";
import path from 'path';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });



export const addLocation = async (req, res, next) => {
  console.log('234', 234)
  const { title, body, id } = req.body;
  try {

    const existingUser = await User.findById(id);
    const toSaveData = {
      title, body, user: existingUser
    }
    console.log('existingUser', existingUser)
    if (existingUser) {
      const itinerary = new Itinerary(toSaveData);
      await itinerary.save().then(() => res.status(200).json({ itinerary }));
      existingUser.itinerary.push(itinerary);
      existingUser.save();
      res.status(200).json({
        success: true,
        data: itinerary,
      });
    }

    res.status(404);
    return next(new Error("Location not found"));


  } catch (error) {
    console.log(error);
    return next(error);
  }
};
export const updateLocation = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const itinerary = await Itinerary.findByIdAndUpdate(req.params.id, { title, body });
    itinerary.save().then(() => res.status(200).json({ message: "Task Updated" }));

    res.status(200).json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
export const deleteLocation = async (req, res, next) => {
  const { id } = req.body;
  console.log('req.body', req.body, req.params.id)
  try {

    const existingUser = await User.findByIdAndUpdate(id, {
      $pull: { itinerary: req.params.id },
    });
    if (!existingUser) {
      res.status(404);
      return next(new Error("Location not found"));
    }
    await Itinerary.findByIdAndDelete(req.params.id).then(() =>
      res.status(200).json({
        success: true,
        message: "Location Deleted"
      })
    );


  } catch (error) {
    console.log(error);
    return next(error);
  }
};
export const getLocations = async (req, res, next) => {
  try {

    const itinerary = await Itinerary.find({ user: req.params.id }).sort({
      createdAt: -1,
    });
    if (!!itinerary.length !== 0) {
      return res.status(200).json({
        success: true,
        data: itinerary
      });
    }

    res.status(200).json({
      success: true,
      itinerary: [],
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
export const getLocationDetails = async (req, res, next) => {
  try {


    const locationDetails = await Itinerary.findById(req.params.id);
    if (locationDetails) {
      res.status(200).json({ locationDetails });
      return res.status(200).json({
        success: true,
        data: locationDetails
      });
    }

    res.status(200).json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export const searchLocations = async (req, res, next) => {

  try {
    const userId = req.query.userId; // Assuming you also want to filter by user ID
    const searchTerm = req.query.search;
    let query = {};
    if (userId) {
      query.user = userId;
    }

    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive title search
        { body: { $regex: searchTerm, $options: 'i' } }  // Case-insensitive body search
      ];
    }

    const list = await Itinerary.find(query).sort({
      createdAt: -1,
    });

    if (list.length !== 0) {
    
      return res.status(200).json({
        success: true,
        data: list
      });
    } else {
      res.status(404).json({success: false, error: 'No matching locations found' });
    }

    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

