const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
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
  },
  phone: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  favourite_books: {
    type: [{ type: mongoose.Types.ObjectId, ref: "Book" }],
  },
});

module.exports = mongoose.model("User", userSchema);
