const { getGFS } = require('../../connection/db');
const Book = require('../models/book.model')
const User = require('../models/user.model')
const mongoose = require('mongoose')

module.exports = {
  addBook: (req, res) => {
    let body;
    if (req.file) {
      body = {
        ...req.body,
        image: `http://${req.get("host")}/api/image/${req.file.filename}`,
        filename: req.file.filename,
      };
    } else {
      body = {
        ...req.body,
        image: null,
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
    }).populate('genres').lean();
  },

  getBook: (req, res) => {
    // Book.findById(req.params.id, (err, book) => {
    //   if (err) return err;
    //   res.json(book);
    // }).lean();
    Book.aggregate(
      [
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.params.id),
          },
        },
      ],
      (err, book) => {
        if (err) return console.log(err);
        res.json(book);
      }
    );
  },

  updateBook: (req, res) => {
    let body;
    if (req.file) {
      body = {
        ...req.body,
        image: `http://${req.get("host")}/api/image/${req.file.filename}`,
        filename: req.file.filename,
      };
      if (req.body.filename) {
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
        let gfs = getGFS();
        gfs.remove(
          { filename: result.filename, root: "book_images" },
          (err, gridStore) => {
            if (err) {
              return res.status(404).json({ err: err });
            }
          }
        );
      }
      res.status(200).json({ message: "Удалено!" });
    });
  },

  dashboardGetBookQuantities: (req, res) => {
    Book.find((err, books) => {
      if (err) return err;

      quantities = books.map((book) => {
        return book.quantity;
      });
      names = books.map((book) => {
        return book.title;
      });

      res.json({
        names: names,
        quantities: quantities,
      });
    });
  },

  filterBooks: (req, res) => {
    if (req.body.genres && req.body.genres.length > 0) {
      let genres = req.body.genres.map((genre) => {
        return mongoose.Types.ObjectId(genre);
      });
      Book.aggregate(
        [
          {
            $match: {
              genres: {
                $in: genres,
              },
            },
          },
        ]
      ).exec(function (err, books) {
        if (err) return err
        Book.populate(books, { path: 'genres' }, function (err, pop_books) {
          if (err) return err
          res.json(pop_books)
        });
      });;
    } else {
      Book.find((err, books) => {
        if (err) return err;
        res.json(books);
      }).populate('genres').lean();
    }
  },

  addToFavourite: async (req, res) => {
    // console.log(req.params)
    const book = await Book.findById(req.params.id, (err, book) => {
      if (err) return err
      return book
    }).lean();
    // console.log('book', book)
    const user = await User.findById(req.params.user_id, (err, user) => {
      if(err) return err
      return user
    })

    if (user.favourite_books.includes(mongoose.Types.ObjectId(req.params.id))) {
      // User.findByIdAndUpdate(
      //   req.params.user_id,
      //   { $pull: { favourite_books: mongoose.Types.ObjectId(req.params.id)} },
      //   { new: true },
      //   function (err, success) {
      //     if (err) return err
      //     res.send(success)
      //   });
      user.favourite_books.pull(book)
    } else {
      user.favourite_books.push(book)
      // User.findByIdAndUpdate(
      //   req.params.user_id ,
      //   { $push: { favourite_books: book } },
      //   { new: true },
      //   function (err, success) {
      //     if (err) return err
      //     res.send(success)
      //   });
    }
    user.save()
    res.send(user)
  }
};