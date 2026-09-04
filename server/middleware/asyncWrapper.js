// middleware/asyncWrapper.js
// Wraps async route handlers to eliminate try/catch boilerplate in controllers.
// Usage: router.get('/', asyncWrapper(myController))
// If the async function throws, it forwards the error to Express's error handler.

const asyncWrapper = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncWrapper;
