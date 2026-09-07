import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import proxy from "express-http-proxy";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 1000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(morgan("dev"));

// Proxy to Auth Service (parseReqBody: false pipes the raw stream and prevents Node 20+ header errors)
app.use(
  "/auth",
  proxy(process.env.AUTH_SERVICE, {
    parseReqBody: false,
  })
);

app.use(express.json());

// Gateway health check
app.get(["/", "/health"], (req, res) => {
  res.status(200).json({
    success: true,
    service: "api-gateway",
    message: "API Gateway is operational 🌐🚀",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(
    `\n🚪 [API GATEWAY] 🌐 Gateway server is running on port: ${PORT} 🚀`,
  );
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🛡️  Health: http://localhost:${PORT}/health\n`);
});
