const ctrlBook = require('../controllers/book.controller.js')

const express = require('express');
const router = express.Router()

//BOOK
router.get('/books', ctrlBook.getBooks)
router.get('/book/:id', ctrlBook.getBook)
router.post('/books', ctrlBook.addBook)

module.exports = router