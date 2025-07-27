import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("✅ MongoDB already connected.");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "pinnacle",
    });
    isConnected = true;
    console.log("✅ MongoDB connected.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};
