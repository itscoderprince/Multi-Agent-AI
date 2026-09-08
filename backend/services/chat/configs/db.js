import mongoose from "mongoose";
import dns from "node:dns";

// Fix Windows ISP DNS failing on MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || "multi_agent_ai",
    });
    console.log(
      `🍃 [MONGODB] Connected to database "${conn.connection.name}" on host: ${conn.connection.host} ✅`
    );
  } catch (error) {
    console.error("❌ [MONGODB] Connection failed:", error.message);
  }
};

