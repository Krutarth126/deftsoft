const Router = require("express").Router();
const UserRegistration = require("../dbModule/RegisterSchema.js");
const UserLogin = require("../dbModule/LoginShema.js");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const verify = require("./middleware.js");
const {
  registerValidation,
  LoginValidation,
} = require("../validation/validation.js");

dotenv.config();

Router.post("/register", async (req, res) => {
  const dbPost = req.body;
  console.log(req.body);
  const { error } = registerValidation(dbPost);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const emailExists = UserRegistration.findOne({ email: dbPost.email });
  if (emailExists === undefined) {
    return res.status(400).send("Email Already Exist");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(dbPost.password, salt);
  const user = {
    username: dbPost.username,
    email: dbPost.email,
    password: hashedPassword,
    phone: dbPost.phone,
  };

  UserRegistration.create(user, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).render("login");
    }
  });
});

Router.post("/login", async (req, res) => {
  const dbPost = req.body;
  const { error } = LoginValidation(dbPost);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const user = await UserRegistration.findOne({ email: dbPost.email });
  if (user === null) {
    return res.status(400).send("Email not Found");
  }
  const password = user.password;
  const validPassword = await bcrypt.compare(dbPost.password, password);
  if (validPassword === false) {
    return res.status(400).send("Invalid Password");
  }
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.cookie("token", token).render("go");
});

Router.get("/logged-in", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(500).send("no token found");
    }
    jwt.verify(token, process.env.TOKEN_SECRET);
    res.json({ isSucced: true });
  } catch (err) {
    res.status(500).send(err);
  }
});

Router.get("/logout", (req, res) => {
  res.cookie("token", "").render({ token: "" });
});

Router.get("/private", verify, (req, res) => {
  res.send("you rocks");
});
module.exports = Router;
