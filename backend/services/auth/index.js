import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 2000;

app.use(morgan("dev"));
app.use(express.json());

// Auth service health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "auth-service",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(
    `\n🔐 [AUTH SERVICE] 🛡️  Auth server is running on port: ${PORT} 🚀`,
  );
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔑 Health: http://localhost:${PORT}/health\n`);
});

