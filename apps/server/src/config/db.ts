import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set");
}

// Extend global type
declare global {
  var mongooseConn: {
    conn: null | typeof mongoose;
    promise: null | Promise<typeof mongoose>;
  };
}

// Initialize cache
const globalCache = global.mongooseConn || {
  conn: null,
  promise: null,
};

global.mongooseConn = globalCache;

export const connectDb = async (): Promise<typeof mongoose> => {
  // If already connected → reuse
  if (globalCache.conn) {
    return globalCache.conn;
  }

  // If connection is in progress → reuse promise
  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    globalCache.conn = await globalCache.promise;
    console.log("✅ MongoDB connected");
  } catch (error) {
    globalCache.promise = null;
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }

  return globalCache.conn;
};
