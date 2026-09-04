/**
 * Role-based access control middleware.
 * Usage: roleCheck(['owner']) or roleCheck(['owner', 'staff'])
 * Must be used AFTER protect middleware so req.user is populated.
 */
const roleCheck = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`,
    });
  }

  next();
};

module.exports = roleCheck;
