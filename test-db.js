import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";

async function testConnection() {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("Connecting to:", uri.replace(/:([^:@]{3})[^:@]*@/, ":***@")); 
    await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 5000 });
    console.log("SUCCESS: Mongoose successfully connected to MongoDB Atlas!");
    process.exit(0);
  } catch (err) {
    console.error("ERROR: Connection failed.", err.message);
    process.exit(1);
  }
}

testConnection();
