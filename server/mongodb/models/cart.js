const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "users", required: true },
  isDone: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  cartItems: [
    { type: mongoose.Types.ObjectId, ref: "cart_items", required: true }
  ]
});

const Carts = mongoose.model("carts", cartSchema);

module.exports = Carts;
