/**
 * Sends a standardized success response
 * @param {import('express').Response} res
 * @param {any} [data=null]
 * @param {string} [message="Success"]
 * @param {number} [statusCode=200]
 */
export const sendSuccess = (res, data = null, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== null && { data }),
  });
};

/**
 * Sends a standardized error response
 * @param {import('express').Response} res
 * @param {string} [message="Something went wrong"]
 * @param {number} [statusCode=500]
 * @param {any} [error=null]
 */
export const sendError = (res, message = "Something went wrong", statusCode = 500, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(error && { error: error.message || error }),
  });
};

/**
 * Wraps async controllers to automatically forward errors (removes repetitive try/catch)
 * @param {Function} fn
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export { AppError } from "./AppError.js";

