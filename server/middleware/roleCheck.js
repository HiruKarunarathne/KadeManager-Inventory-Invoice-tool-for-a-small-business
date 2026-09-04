/**
 * Middleware: Role-based access control
 * Usage: router.delete('/products/:id', protect, roleCheck(['owner']), handler)
 *
 * @param {string[]} allowedRoles - Array of roles permitted to access the route
 */
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
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

module.exports = { roleCheck };
