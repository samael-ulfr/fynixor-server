// middleware/authorize.js
module.exports = function authorize(roles = []) {
  // roles can be a single role or an array of roles
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }
    next();
  };
};
