const { getGFS } = require('../../connection/db');
const Book = require('../models/book.model')
const mongoose = require('mongoose')

module.exports = {
  addBook: (req, res) => {
     let body;
     if(req.file) {
       body = {
         ...req.body,
         image: `http://${req.get('host')}/api/image/${req.file.filename}`,
         filename: req.file.filename
       }
     } else {
       body = {
         ...req.body,
         image: null
       };
     }
     Book.create(body, (err, result) => {
       if (err) return err;
       res.json(result);
     });
  },

  getBooks: (req, res) => {
    Book.find((err, books) => {
      if (err) return err;
      res.json(books);
    }).lean();
  },

  getBook: (req, res) => {
    // Book.findById(req.params.id, (err, book) => {
    //   if (err) return err;
    //   res.json(book);
    // }).lean();
    Book.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id)
        }
      }], (err, book) => {
        if(err) return console.log(err)
        res.json(book)
      }
    )
  },

  updateBook: (req, res) => {
    let body;
    if (req.file) {
      body = {
        ...req.body,
        image: `http://${req.get("host")}/api/image/${req.file.filename}`,
        filename: req.file.filename,
      };
      if(req.body.filename) {
        let gfs = getGFS();
        gfs.remove(
          { filename: req.body.filename, root: "book_images" },
          (err, gridStore) => {
            if (err) {
              return res.status(404).json({ err: err });
            }
          }
        );
      }
    } else {
      body = {
        ...req.body,
      };
    }

    Book.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true },
      (err, result) => {
        if (err) return err;
        res.json(result);
      }
    );
  },

  deleteBook: (req, res) => {
    Book.findByIdAndDelete(req.params.id, (err, result) => {
      if (err) return err;
      
      if (result.filename) {
        let gfs = getGFS()
        gfs.remove(
          { filename: result.filename, root: "book_images" },
          (err, gridStore) => {
            if (err) {
              return res.status(404).json({ err: err });
            }
          }
        );
      }
      res.status(200).json({message: 'Удалено!'});
    });
  },

  dashboardGetBookQuantities: (req, res) => {
    Book.find((err, books) => {
      if (err) return err;
      
      quantities = books.map(book => {
        return book.quantity
      })
      names = books.map(book => {
        return book.title
      })
      
      res.json({
        names: names,
        quantities: quantities
      });
    });
  }
};