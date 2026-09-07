import { sendError } from "../utils/response.js";
import { AppError } from "../utils/AppError.js";

/**
 * 404 Handler for undefined routes
 */
export const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

/**
 * Global Error Handling Middleware
 * Intercepts Mongoose errors, AppError, Firebase/JWT, and uncaught exceptions.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError") {
    message = `Resource not found with invalid id: ${err.value}`;
    statusCode = 404;
  }

  // 2. Mongoose Duplicate Key error (MongoDB error code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "Field";
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    statusCode = 409;
  }

  // 3. Mongoose Validation error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // 4. Firebase Auth / JWT errors
  if (err.code?.startsWith?.("auth/") || err.name === "JsonWebTokenError") {
    message = "Invalid or expired authentication token";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Token has expired, please log in again";
    statusCode = 401;
  }

  // Log unexpected errors (500) to console for debugging
  if (!err.isOperational && statusCode === 500) {
    console.error("💥 [SERVER ERROR]:", err);
  }

  return sendError(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === "development" ? err.stack : null
  );
};
