import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    img: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
    },
    email: {
      type: String,
      unique: true,
    },
    address: {
      type: Object,
    },
    phoneNo: {
      type: Number,
    },
    password: {
      type: String,
    },
    itinerary: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
