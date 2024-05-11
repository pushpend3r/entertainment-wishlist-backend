import mongoose from "mongoose";

console.log("Connecting to MongoDB...");

await mongoose.connect(process.env.MONGO_URI);

console.log("Connected with MongoDB");
