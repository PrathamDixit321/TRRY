import mongoose from "mongoose";
import dns from "dns";

// Force global Node.js DNS resolution to use Google DNS explicitly.
// This perfectly bypasses Wi-Fi/ISP level SRV blockages throwing ECONNREFUSED.
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // Ignore
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local",
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      family: 4, // Force IPv4 to prevent querySrv ETIMEOUT / ECONNREFUSED on Node 18+
      serverSelectionTimeoutMS: 5000,
    };
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
