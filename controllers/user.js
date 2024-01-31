// const User = require("../models/User");
import User from "../models/User.js";

const convertToIST = (utcDate) => {
  const istOffset = 330 * 60 * 1000;
  const istDate = new Date(utcDate.getTime() + istOffset);
  return istDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      res.status(400);
      return next(new Error("name & email fields are required"));
    }

    // check if user already exists
    // const isUserExists = await User.findOne({ email });
    const isUserExists = await User.findOne({
      $or: [
        { email: email },
        { phoneNo: phoneNo }
      ],
    });
    if (isUserExists) {
      res.status(404);
      return next(new Error("User already exists"));
    }

    const user = await User.create({
      name, email
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

// export const getUsers = async (req, res, next) => {
//   try {
//     console.log('234', 234)
//     const users = User.find({}, (err, allUsers) => {
//       if (!allUsers) {
//         return err
//       }
//       return allUsers
//     }
//     // const users = await User.find();
//     res.status(200).json({
//       success: true,
//       users,
//     });
//   } catch (error) {
//     console.log(error);
//     return next(error);
//   }
// };

export const getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }
    const { password, ...others } = user._doc;

    res.status(200).json({
      success: true,
      data: others,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User has been deleted.",
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// export  {
//   getUser,
//   getUsers,
//   createUser,
//   updateUser,
//   deleteUser,
// };