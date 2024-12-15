const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        if (value.length < 6) return false;
        return /[0-9]/.test(value) &&
               /[a-z]/.test(value) &&
               /[A-Z]/.test(value) &&
               /[\W_]/.test(value);
      },
      message: 'Password must contain at least 1 number, 1 lowercase letter, 1 uppercase letter, 1  special character',
    }
  },
  profile: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  interests: {
    type: [String],
    default: [],
  },
});

usersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

usersSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const Users = mongoose.model("Users", usersSchema);
module.exports = Users;
