const Users = require("./mongodb/models/user");

const newUser = new Users({
  idNumber: 100200300,
  firstName: "Yossi",
  lastName: "Blah",
  email: "blah@gmail",
  password: "blah",
  isAdmin: false,
  city: "Jerusalem",
  street: "100 gates"
});
newUser.save().then(() => console.log("User created"));
///////////////////////////////////////////////////////////////////////////////////////////
const Categories = require("./mongodb/models/category");

const newCat = new Categories({
  name: "Sub-acid"
});
newCat.save().then(() => console.log("Category created"));
///////////////////////////////////////////////////////////////////////////////////////////
const Products = require("./mongodb/models/product");

const newProd = new Products({
  name: "Avocado",
  categories: ["5e70fa7e5bc00648702a7738"],
  price: 6,
  image:
    "https://png.pngtree.com/png-vector/20190927/ourmid/pngtree-avocado-vector-illustration-isolated-on-white-background-avocado-clip-art-png-image_1745802.jpg"
});
newProd.save().then(() => console.log("Product created"));
///////////////////////////////////////////////////////////////////////////////////////////
const CartItems = require("./mongodb/models/cart-item");

const newCartItem = new CartItems({
  product: "5e70fcf0a650cf2a6c756c70",
  quantity: 4
});
newCartItem.save().then(() => console.log("Cart Item created"));
///////////////////////////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  const Products = require("./mongodb/models/product");
  require("./mongodb/models/category");

  Products.find()
    .populate("categories")
    .then(response => res.json(response));
});
///////////////////////////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  const CartItems = require("./mongodb/models/cart-item");
  require("./mongodb/models/product");
  require("./mongodb/models/category");

  CartItems.find()
    .populate({
      path: "product",
      populate: "categories"
    })
    .exec((err, response) => {
      if (err) console.log(err);
      res.json(
        response.map(c => ({ ...c._doc, price: c.quantity * c.product.price }))
      );
    });
});
///////////////////////////////////////////////////////////////////////////////////////////
const Carts = require("./mongodb/models/cart");

const newCart = new Carts({
  user: "5e70faceef8bc63c245ad6d1",
  cartItems: ["5e71003e6e77703dd42b1152"]
});
newCart.save().then(() => console.log("CART created"));
///////////////////////////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  const Carts = require("./mongodb/models/cart");
  require("./mongodb/models/user");
  require("./mongodb/models/product");
  require("./mongodb/models/category");
  require("./mongodb/models/cart-item");

  Carts.find()
    .populate([
      { path: "user" },
      {
        path: "cartItems",
        populate: { path: "product", populate: "categories" }
      }
    ])
    .exec((err, response) => {
      if (err) console.log(err);
      res.json(response);
    });
});
///////////////////////////////////////////////////////////////////////////////////////////
const Orders = require("./mongodb/models/order");

const newOrder = new Orders({
  cart: "5e7112044eb7090594e0fc11",
  city: "Jerusalem",
  street: "100 gates",
  arriveDate: new Date("2020-08-21"),
  creditCard: 3892
});
newOrder.save().then(() => console.log("ORDER created"));
///////////////////////////////////////////////////////////////////////////////////////////
Carts.find({ user: req.token.id, isDone: true }, (err, cartDocs) => {
  if (err) {
    console.log(err.message);
    res.sendStatus(500);
  } else {
    const cartIds = cartDocs.map(c => c._id);

    Orders.findOne({ cart: { $in: cartIds } })
      .populate({
        path: "cart",
        select: "cartItems",
        populate: {
          path: "cartItems",
          select: "product quantity",
          populate: { path: "product", select: "name price" }
        }
      })
      .sort({ orderDate: -1 })
      .exec((err, orderDocs) => {
        if (err) {
          console.log(err.message);
          res.sendStatus(500);
        } else {
          res.json(orderDocs);
        }
      });
    ///////////////////////
    // STOPPED HERE
    ///////////////////////
  }
});
