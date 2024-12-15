const axios = require('axios');

const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const response = await axios.get(
            `${process.env.USER_SERVICE_URL}`,  // Fetch the URL from the environment variable
            { headers: { Authorization: `Bearer ${token}` } }
        );

        req.user = response.data;

        next(); 
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized: Invalid or expired token',
            error: error.message,
        });
    }
};

// Middleware to validate JWT token for socket.io connections
const authSocketMiddleware = (socket, next) => {
    const token = socket.handshake.query.token; // Extract token from query params
  
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }
  
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error: Invalid or expired token'));
      }
  
      // Optionally, you can make an API call to validate token or get user info (if necessary)
      try {
        const response = await axios.get(`${process.env.USER_SERVICE_URL}/validate-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data.valid) {
          socket.user = decoded; // Attach user info to socket object
          next(); // Proceed to the connection
        } else {
          return next(new Error('Authentication error: Invalid token'));
        }
      } catch (error) {
        return next(new Error('Authentication error: Unable to validate token'));
      }
    });
  };


module.exports = { verifyToken,authSocketMiddleware };
