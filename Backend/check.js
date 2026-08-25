import mongoose from "mongoose";
import "dotenv/config";

await mongoose.connect(process.env.MONGODB_URI);

console.log("Connected DB:", mongoose.connection.name);

process.exit();