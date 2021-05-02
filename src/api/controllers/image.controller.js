const { getGFS, upload } = require("../../connection/db");

module.exports = {
  imageShow: (req, res) => {
    let gfs = getGFS();
    gfs.files.findOne({ filename: req.params.id }, (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "No file exists",
        });
      }

      if (
        file.contentType === "image/jpeg" ||
        file.contentType === "image/png"
      ) {
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: "Not an image",
        });
      }
    });
  },

  removeImage: (req, res) => {
    let gfs = getGFS();
    gfs.remove(
      { filename: req.params.id, root: "book_images" },
      (err, result) => {
        if (err) {
          return res.status(404).json({ err: err });
        }
        res.json({message: 'deleted'})
      }
    );
  },
};
