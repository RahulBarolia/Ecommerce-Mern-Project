import mongoose from "mongoose";

// database connected config.
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected", conn.connection.host);
  } catch (error) {
    console.log("Error connection to mongoDD", error.message);
    process.exit(1);
  }
};
