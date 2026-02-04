const auth = (req, res, next) => {
  const id = req.headers["x-user-id"];
  const role = req.headers["x-role"];

  if (!id || !role) return res.status(401).json({ message: "Missing headers" });

  req.user = { id, role };
  next();
};

module.exports = { auth };
