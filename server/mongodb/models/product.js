const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  categories: [{ type: mongoose.Types.ObjectId, ref: "categories" }],
  price: { type: Number, required: true },
  image: { type: String, required: true }
});

const Products = mongoose.model("products", productSchema);

module.exports = Products;
