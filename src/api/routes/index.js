const ctrlBook = require('../controllers/book.controller.js')

const express = require('express');
const router = express.Router()

//BOOK
router.get('/books', ctrlBook.getBooks)
router.get('/book/:id', ctrlBook.getBook)
router.post('/books', ctrlBook.addBook)
router.put('/book/:id', ctrlBook.updateBook)
router.delete('/book/:id', ctrlBook.deleteBook)

module.exports = router