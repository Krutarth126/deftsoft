const Router = require("express").Router();
const multer = require("multer");
const PostSchema = require("../dbModule/PostSchema.js");

const storage = multer.diskStorage({
  destination: "./upload",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

Router.post("/uploads", upload.single("productImage"), (req, res) => {
  const product = new PostSchema({
    name: req.body.name,
    productImage: req.file.path.replace("\\", "/"),
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      console.log({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          request: {
            type: "GET",
            url:
              "http://localhost:8000/" + result.productImage.replace("\\", "/"),
          },
        },
      });
      res.render("postCreated");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

Router.get("/get-images", async (req, res) => {
  const response = await PostSchema.find({});
  res.send(response);
});

module.exports = Router;
