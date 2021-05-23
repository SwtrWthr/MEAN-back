const Genre = require("../models/genre.model");
const Book = require("../models/book.model");
const mongoose = require("mongoose");

getCount = (genre) => {
  return Book.countDocuments({ genres: { $in: genre } })
    .exec()
    .then((count) => {
      return count
    })
    .catch((err) => {
      console.log(err)
    });
};

module.exports = {
  addGenre: (req, res) => {
    Genre.create(req.body, (err, result) => {
      if (err) return err;
      res.json(result);
    });
  },

  getGenres: (req, res) => {
    Genre.find((err, genres) => {
      if (err) return err;
      res.json(genres);
    }).lean();
  },

  getGenre: (req, res) => {
    Genre.findById(req.params.id, (err, genre) => {
      if (err) return err;
      res.json(genre);
    }).lean();
  },

  updateGenre: (req, res) => {
    Genre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (err, result) => {
        if (err) return err;
        res.json(result);
      }
    );
  },

  deleteGenre: (req, res) => {
    Genre.findByIdAndDelete(req.params.id, (err, result) => {
      if (err) return err;
      res.status(200).json({ message: "Удалено!" });
    });
  },

  dashboardGetGenreBooks: async(req, res) => {
    let quan_list = []
    let gen_list = []
    const genres_list = await Genre.find((err, genres) => {
      if (err) return err;
      return genres
    });
    for (const genre of genres_list) {
      quan_list.push(await getCount(genre._id));
      gen_list.push(genre.title)
    }
    // genres_list.forEach(async (genre) => {
    //   let count = await getCount(genre._id)
    //   console.log(count)
    //   quan_list.push(count)
    // })
    res.json({
      genres: gen_list,
      quantities: quan_list
    })
  },
};
