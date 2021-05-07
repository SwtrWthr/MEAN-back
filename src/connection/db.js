const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const multer = require('multer')
const GridFsStorage = require("multer-gridfs-storage");

const url =
  "mongodb+srv://sakenzie:ssss1234@supercluster.nb24i.mongodb.net/mean?retryWrites=true&w=majority";

let gfs;

const connect = () => {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })

  mongoose.connection.on("error", (err) => {
    console.log(`error ${err}`);
  });

  mongoose.connection.on("connected", () => {
    console.log("БД подключен...");
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection("book_images");
  });
};

const getGFS = () => {
  return gfs
}

//CREATE STORAGE
const storage = new GridFsStorage({
  url: url,
  file: (req, file) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      return {
        bucketName: "book_images",
      };
    } else {
      return null;
    }
  },
  options: {
    useUnifiedTopology: true,
  },
});
const upload = multer({ storage });

module.exports = {
  connect,
  getGFS,
  upload
}