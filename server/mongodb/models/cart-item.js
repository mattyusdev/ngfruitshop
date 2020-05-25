const mongoose = require("mongoose");

const cartItemSchema = mongoose.Schema({
  product: { type: mongoose.Types.ObjectId, ref: "products", required: true },
  quantity: { type: Number, required: true }
});

const CartItems = mongoose.model("cart_items", cartItemSchema);

module.exports = CartItems;
