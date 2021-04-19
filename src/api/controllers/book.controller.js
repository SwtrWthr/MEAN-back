const Book = require('../models/book.model')

module.exports = {
  getBooks: (req, res) => {
    Book.find((err, books) => {
      if(err) return err

      res.json(books)
    })
  },

  getBook: (req, res) => {
    res.send(`Book ${req.params.id}`)
  },
  
  addBook: (req, res) => {
    Book.create(req.body, (err, result) => {
      if(err) return err
      res.send(result)
    })
  }
}