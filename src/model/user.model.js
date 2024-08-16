const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => validator.isEmail(value),
  },
  password: { type: String, required: true },
  islogin: { type: Boolean, default: false },
});

const User = mongoose.model("user", userSchema);

module.exports = User;