// middleware/roleCheck.js
// Role-based access control middleware for Perera Stores.
// Two roles exist: 'owner' and 'staff'.
//
// Usage (must be used AFTER protect middleware):
//   router.delete('/:id', protect, roleCheck(['owner']), asyncWrapper(deleteProduct))
//
// roleCheck(['owner'])         → only the shop owner can access
// roleCheck(['owner','staff']) → both owner and staff can access (same as just using protect)

/**
 * Middleware: Role-based access control
 * @param {string[]} allowedRoles - Array of roles permitted to access the route
 */
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Use protect middleware before roleCheck.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied — this action requires one of: [${allowedRoles.join(', ')}]. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};

module.exports = roleCheck;
