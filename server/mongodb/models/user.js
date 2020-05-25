const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  idNumber: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  city: String,
  street: String
});

const Users = mongoose.model("users", userSchema);

module.exports = Users;
