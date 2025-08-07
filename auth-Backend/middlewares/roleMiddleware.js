// middlewares/roleMiddleware.js
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('=== AUTHORIZE ROLES DEBUG ===');
    console.log('User from req:', req.user);
    console.log('Allowed roles:', allowedRoles);
    console.log('User role:', req.user?.role);
    if (!req.user) {
      console.log('❌ No user found in request');
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. Please login first." 
      });
    }
    if (!allowedRoles.includes(req.user.role)) {
      console.log('❌ User role not authorized:', req.user.role);
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}` 
      });
    }

    console.log('✅ User authorized with role:', req.user.role);
    next();
  };
};

module.exports = authorizeRoles;