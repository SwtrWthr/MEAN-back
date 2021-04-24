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
      if(err) return err
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
    console.log(req.body)
    Book.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, result) => {
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