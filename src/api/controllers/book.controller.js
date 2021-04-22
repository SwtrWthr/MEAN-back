const Book = require('../models/book.model')

module.exports = {
  getBooks: (req, res) => {
    Book.find((err, books) => {
      if(err) return err

      res.json(books)
    })
  },

  getBook: (req, res) => {
    Book.findById(req.params.id, (err, book) => {
      if(err) throw new Error(err)
      res.send(book)
    })
  },
  
  addBook: (req, res) => {
    Book.create(req.body, (err, result) => {
      if(err) return err
      res.send(result)
    })
  },

  updateBook: (req, res) => {
    Book.findByIdAndUpdate(req.params.id, (err, result) => {
      if(err) return err
      res.send(result)
    })
  },

  deleteBook: (req, res) => {
    Book.findByIdAndDelete(req.params.id, (err, result) => {
      if(err) return err
      res.send(result)
    })
  }
}