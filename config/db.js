// const mongoose = require("mongoose");

// import dotenv from "dotenv";
// dotenv.config();
// let DB_URL = process.env.MONGO_URI || "";
// mongoose.set("strictQuery", false);

// export const connectDB = async () => {
//   try {
//     console.log('234', DB_URL)
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
let DB_URL = process.env.DB_URL || "";
console.log('DB_URL',DB_URL)
mongoose.connect(DB_URL, {});
mongoose.connect(DB_URL, {});
export const db = mongoose.connection;
db.on("error", () => {
    console.log("Error Connecting to DB");
});
db.once("open", function () {
    console.log("DB Connected successfully!!");
});
//# sourceMappingURL=connect.js.map