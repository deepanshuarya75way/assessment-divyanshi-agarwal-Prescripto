import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Database Connected");
    console.log("Connected DB:", mongoose.connection.name);
  });

  await mongoose.connect(process.env.MONGODB_URI);
};

export default connectDB;