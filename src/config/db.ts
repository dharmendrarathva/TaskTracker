// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI!;

// if (!MONGODB_URI) {
//   throw new Error("MONGODB_URI missing");
// }

// let cached = (global as any).mongoose;

// if (!cached) {
//   cached = (global as any).mongoose = { conn: null, promise: null };
// }

// export async function connectDB() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI, {
//       bufferCommands: false,
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }



// src/config/db.ts

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in environment variables");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}