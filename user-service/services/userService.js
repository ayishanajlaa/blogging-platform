const User = require('../models/user');
const jwt = require('jsonwebtoken');

async function registerUser({ name, email, password,isAdmin,interests }) {
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }

    const newUser = new User({ name, email, password,isAdmin,interests });
    await newUser.save();
    const userCount = await User.countDocuments();
    io.emit('analytics', { action: 'REGISTER', userCount });
    return { message: 'User registered successfully' };
}

async function loginUser({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
   
    io.emit('analytics', { action: 'LOGIN', email: user.email });

    return { token,name:user.name,email:user.email,isAdmin:user.isAdmin };
}

async function updateUserProfile(userId, { name, profile,interests }) {
    const user = await User.findByIdAndUpdate(userId, { name, profile,interests }, { new: true });
    if (!user) {
        throw new Error('User not found');
    }

    io.emit('analytics', { action: 'UPDATE_PROFILE',email: user.email });
    return { message: 'Profile updated successfully', user };
}

function verifyJwtToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

async function getUserInfo(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return { message: 'Profile fetch successfully', user };

}

const getUserCount = async () => {
    try {
      const count = await User.countDocuments();
      return count;
    } catch (error) {
      throw new Error('Error fetching user count');
    }
  };


module.exports = { registerUser, loginUser, updateUserProfile, verifyJwtToken,getUserInfo,getUserCount };
