const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  productImage: { type: String, required: true },
});

module.exports = mongoose.model("PostUpload", PostSchema);
