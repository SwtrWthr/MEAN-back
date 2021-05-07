const ctrlBook = require('../controllers/book.controller.js')
const ctrlImage = require('../controllers/image.controller')
const { upload } = require('../../connection/db')
const express = require('express');
const router = express.Router()

// BOOK
router.get('/books', ctrlBook.getBooks)
router.get('/book/:id', ctrlBook.getBook)
router.post('/books', upload.single('image'), ctrlBook.addBook) 
router.put("/book/:id", upload.single("image"), ctrlBook.updateBook);
router.delete('/book/:id', ctrlBook.deleteBook)
// DASHBOARD BOOKS
router.get('/books/quantities', ctrlBook.dashboardGetBookQuantities)

// IMAGE
router.get('/image/:id', ctrlImage.imageShow)
router.delete('/image/:id', ctrlImage.removeImage)

module.exports = router