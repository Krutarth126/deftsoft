const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("../routes/auth.js");
const hbs = require("hbs");
const path = require("path");
const verify = require("../routes/middleware.js");
const postRoute = require("../routes/upload.js");
const PostSchema = require("../dbModule/PostSchema.js");

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
app.use(express.urlencoded({ extended: false }));
app.use("/upload", express.static("upload"));
const connection_url = process.env.CONNECTION_URL;

mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const port = process.env.PORT || 8000;

app.get("/", async (req, res) => {
  const token = req.cookies.token;
  const response = await PostSchema.find({});
  if (!token) {
    res.render("index");
  } else {
    res.render("post", { response: response });
  }
});

app.get("/uploads", verify, (req, res) => {
  res.render("upload");
});

app.use("/api/user", postRoute);

app.get("/login", (req, res) => {
  res.render("login");
});

app.use("/api/user", authRoute);

app.listen(port, () => {
  console.log("Listening at the port localhost:", port);
});
