const jwt = require("jsonwebtoken");

// Middleware to validate JWT
function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
}

function authSocketMiddleware(socket, next) {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Attach user to the socket
    next();
  } catch (error) {
    next(new Error("Authentication error: Invalid token"));
  }
}

module.exports = { authMiddleware, authSocketMiddleware };
