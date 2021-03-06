const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  year: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  genres: {
    type: [{ type: mongoose.Types.ObjectId, ref: "Genre" }],
  },
});

bookSchema.index({price: 1, name: 1})

module.exports = mongoose.model('Book', bookSchema)