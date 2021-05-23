const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const config = require("../../config");

module.exports = {
  register: async (req, res) => {
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    let user = new User({
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: hashPass,
      admin: req.body.isAdmin || false,
    });

    user.save((err, registered_user) => {
      if (err) {
        if (err.code === 11000)
          return res
            .status(409)
            .json({ message: "Email is already registered." });
        else
          return res.status(409).json({ message: "unknown error", err: err });
      } else {
        let payload = {
          id: registered_user._id,
          admin: req.body.admin || false,
        };
        const token = jwt.sign(payload, config.TOKEN_SECRET);
        res.status(200).send({ token });
      }
    });
  },

  login: async (req, res) => {
    User.findOne({ email: req.body.email }, async (err, user) => {
      if (err) {
        console.log(err);
      } else {
        if (user) {
          const validPass = await bcrypt.compare(
            req.body.password,
            user.password
          );
          if (!validPass)
            return res
              .status(401)
              .json({ message: "E-Mail or password is incorrect" });

          let payload = { id: user._id, admin: user.admin };
          const token = jwt.sign(payload, config.TOKEN_SECRET, { expiresIn: "10h" });

          res
            .status(200)
            .header("auth-token", token)
            .json({ token: token, user: user });
        } else {
          res.status(401).send({ message: "account doesn't exist!" });
        }
      }
    });
  },

  me: (req, res) => {
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    let verifiedUser = jwt.verify(token, config.TOKEN_SECRET);

    User.findById(verifiedUser.id, {password: 0, __v: 0}, (err, user) => {
      if (err) return err;
      res.json(user);
    }).lean();
  },
};
