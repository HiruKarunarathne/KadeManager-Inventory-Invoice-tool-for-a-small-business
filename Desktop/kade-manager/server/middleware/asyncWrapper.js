/**
 * Wraps async route handlers to automatically forward errors to next().
 * Eliminates the need for try/catch blocks in every controller.
 *
 * Usage: router.get('/path', asyncWrapper(myController))
 */
const asyncWrapper = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncWrapper;
