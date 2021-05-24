const ctrlBook = require('../controllers/book.controller.js')
const ctrlGenre = require('../controllers/genre.controller.js')
const ctrlImage = require('../controllers/image.controller')
const ctrlAuth = require('../controllers/auth.controller')
const { upload } = require('../../connection/db')
const express = require('express');
const router = express.Router()
const { isAdmin, verifyUserToken } = require('../middleware/auth')

// AUTH
router.post("/auth/register", ctrlAuth.register);
router.post("/auth/login", ctrlAuth.login);
router.get("/auth/me", verifyUserToken, ctrlAuth.me);

// BOOK
router.get('/books', ctrlBook.getBooks)
router.get('/book/:id', ctrlBook.getBook)
router.get('/books/:id/favourite/:user_id', ctrlBook.addToFavourite)
router.post('/books', verifyUserToken, isAdmin, upload.single('image'), ctrlBook.addBook) 
router.put("/book/:id", verifyUserToken, isAdmin, upload.single("image"), ctrlBook.updateBook);
router.delete("/book/:id", verifyUserToken, isAdmin, ctrlBook.deleteBook);
router.post("/books/filter", ctrlBook.filterBooks);

// GENRE
router.get("/genres", ctrlGenre.getGenres);
router.get("/genres/:id", ctrlGenre.getGenre);
router.post('/genres', verifyUserToken, isAdmin, ctrlGenre.addGenre) 
router.put("/genres/:id", verifyUserToken, isAdmin, ctrlGenre.updateGenre);
router.delete("/genres/:id", verifyUserToken, isAdmin, ctrlGenre.deleteGenre);

// DASHBOARD BOOKS
router.get('/dashboard/genres', verifyUserToken, isAdmin, ctrlGenre.dashboardGetGenreBooks)
router.get('/dashboard/books', verifyUserToken, isAdmin, ctrlBook.dashboardGetBookQuantities)

// IMAGE
router.get('/image/:id', ctrlImage.imageShow)
router.delete("/image/:id", verifyUserToken, isAdmin, ctrlImage.removeImage);

module.exports = router