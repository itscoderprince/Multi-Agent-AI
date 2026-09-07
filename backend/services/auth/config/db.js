import mongoose from "mongoose";
import dns from "node:dns";

// Fix Windows ISP DNS failing on MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `🍃 [MONGODB] Connected successfully to host: ${conn.connection.host} ✅`
    );
  } catch (error) {
    console.error("❌ [MONGODB] Connection failed:", error.message);
  }
};

