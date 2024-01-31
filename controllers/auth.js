import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
dotenv.config();



export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const user = new User({ ...req.body, password: hash });

    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "10d",
    });
    const { password, createdAt, updatedAt, __v, ...others } = user._doc;
    res.status(200).json({
      userData: others,
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("ayo");
      return res.status(401).json("Wrong Email!");
    }

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) {
      return res.status(401).json("Wrong Password!");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "24h",
    });
    const { password, createdAt, updatedAt, __v, ...others } = user._doc;
    res.status(200).json({
      userData: others,
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  res.cookie("access_token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
};