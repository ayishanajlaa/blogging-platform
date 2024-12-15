const { validationResult } = require("express-validator");
const userService = require("../services/userService");

//register
async function registerUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, isAdmin, interests } = req.body;

  try {
    const response = await userService.registerUser({
      name,
      email,
      password,
      isAdmin,
      interests,
    });
    res.status(201).json({data:response});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

//login
async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const response = await userService.loginUser({ email, password });

    res.json({data:response});
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

//update user
async function updateUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId } = req.user;
  const { name, profile, interests } = req.body;

  try {
    const response = await userService.updateUserProfile(userId, {
      name,
      profile,
      interests,
    });

    res.json({data:response});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

//get user info
async function getUserInfo(req, res) {
  const { userId } = req.user;
  try {
    const response = await userService.getUserInfo(userId);

    res.json({data:response});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

//verify token
function verifyToken(req, res) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = userService.verifyJwtToken(token);
    res.status(200).json({ userId: decoded.userId, email: decoded.email });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

//get user count
const getUserCount = async (req, res) => {
  try {
    const count = await userService.getUserCount();
    res.json({data:{count}});
  } catch (error) {
    res.status(500).json({ message: "Error fetching user count" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  verifyToken,
  getUserInfo,
  getUserCount,
};
