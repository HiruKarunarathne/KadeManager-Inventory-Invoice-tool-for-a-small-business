// middleware/errorHandler.js
// Centralized error handling middleware — must be registered LAST in server.js.
// Ensures a single failed request never crashes the whole server.
// All errors passed via next(err) land here with a consistent response shape.

/**
 * Centralized error-handling middleware.
 * Must be registered LAST in Express (after all routes).
 *
 * Formats all errors into a consistent API response:
 *   { success: false, message: string, errors?: array, stack?: string }
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let validationErrors = null;

  // Mongoose duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `A record with this ${field} already exists`;
    statusCode = 409;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    validationErrors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    message = 'Validation failed';
    statusCode = 422;
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token. Please log in again.';
    statusCode = 401;
  }
  if (err.name === 'TokenExpiredError') {
    message = 'Token has expired — please log in again.';
    statusCode = 401;
  }

  // Log in dev, suppress details in production
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  const response = {
    success: false,
    message,
  };

  if (validationErrors) response.errors = validationErrors;
  if (process.env.NODE_ENV === 'development') response.stack = err.stack;

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
