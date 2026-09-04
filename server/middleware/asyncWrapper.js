/**
 * asyncWrapper — wraps async route handlers so you don't need try/catch
 * in every controller. Passes errors to Express's next() for centralized handling.
 *
 * Usage:
 *   router.get('/items', asyncWrapper(inventoryController.getAll));
 *
 * @param {Function} fn - async controller function
 * @returns {Function} Express middleware
 */
const asyncWrapper = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = { asyncWrapper };
