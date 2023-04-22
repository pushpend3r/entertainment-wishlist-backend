import jwt from "jsonwebtoken";

async function auth(req, res, next) {
  const { token } = req.cookies;

  // token not present
  if (!token) {
    return res.status(403).json({
      message: "A token is required for authentication",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.token = decoded;
  } catch (e) {
    // token is invalid
    return res.status(401).send("Invalid Token");
  }
  // call next middleware
  next();
}

export { auth };
