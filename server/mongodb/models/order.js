const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  cart: { type: mongoose.Types.ObjectId, ref: "carts", required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  arriveDate: { type: Date, required: true },
  creditCard: { type: String, required: true },
});

const Orders = mongoose.model("orders", orderSchema);

module.exports = Orders;
