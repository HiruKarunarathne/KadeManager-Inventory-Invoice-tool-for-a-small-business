// middleware/asyncWrapper.js
// Wraps async route handlers to eliminate try/catch boilerplate in controllers.
// Usage: router.get('/', asyncWrapper(myController))
// If the async function throws, it forwards the error to Express's error handler.

/**
 * asyncWrapper — wraps async route handlers so you don't need try/catch
 * in every controller. Passes errors to Express's next() for centralized handling.
 *
 * @param {Function} fn - async controller function
 * @returns {Function} Express middleware
 */
const asyncWrapper = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncWrapper;
