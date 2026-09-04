// middleware/roleCheck.js
// Role-based access control middleware for Perera Stores.
// Two roles exist: 'owner' and 'staff'.
//
// Usage (must be used AFTER protect middleware):
//   router.delete('/:id', protect, roleCheck(['owner']), asyncWrapper(deleteProduct))
//
// roleCheck(['owner'])        → only the shop owner can access
// roleCheck(['owner','staff'])→ both owner and staff can access (same as just using protect)

const roleCheck = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    const err = new Error('Not authenticated. Use protect middleware before roleCheck.');
    err.statusCode = 401;
    return next(err);
  }

  if (!allowedRoles.includes(req.user.role)) {
    const err = new Error(
      `Access denied. This action requires one of the following roles: ${allowedRoles.join(', ')}.`
    );
    err.statusCode = 403;
    return next(err);
  }

  next();
};

module.exports = roleCheck;
