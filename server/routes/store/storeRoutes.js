const router = require("express").Router();

const productsRoutes = require("./routes/productsRoutes");
const cartsRoutes = require("./routes/cartsRoutes");
const ordersRoutes = require("./routes/ordersRoutes");

router.use("/products", productsRoutes);
router.use("/carts", cartsRoutes);
router.use("/orders", ordersRoutes);

const Products = require("../../mongodb/models/product");
const Orders = require("../../mongodb/models/order");
const onlyUsers = require("../auth/mw/onlyUsers");
const Carts = require("../../mongodb/models/cart");

router.get("/stats", (req, res) => {
  Products.countDocuments({}, (err, productsNum) => {
    if (err) {
      console.log(err.message);
      res.sendStatus(500);
    } else {
      Orders.countDocuments({}, (err, ordersNum) => {
        if (err) {
          console.log(err.message);
          res.sendStatus(500);
        } else {
          res.json({ products: productsNum, orders: ordersNum });
        }
      });
    }
  });
});

router.get("/notifications", onlyUsers, (req, res) => {
  Carts.findOne({ user: req.token.id, isDone: false })
    .select("cartItems date")
    .populate([
      {
        path: "cartItems",
        populate: { path: "product", select: "price" }
      }
    ])
    .exec((err, results) => {
      if (err) {
        console.log(err.message);
        res.sendStatus(500);
      } else {
        if (results) {
          let price = 0;

          results.cartItems.forEach(i => {
            price += i.quantity * i.product.price;
          });

          res.json([{ cart: true }, { ...results.toObject(), price }]);
        } else {
          ///////////////////////
          // ORDER CHECK
          ///////////////////////
          Carts.find({ user: req.token.id, isDone: true }, (err, cartDocs) => {
            if (err) {
              console.log(err.message);
              res.sendStatus(500);
            } else {
              const cartIds = cartDocs.map(c => c._id);

              Orders.findOne({ cart: { $in: cartIds } })
                .select("orderDate")
                .populate({
                  path: "cart",
                  select: "cartItems",
                  populate: {
                    path: "cartItems",
                    select: "product quantity",
                    populate: { path: "product", select: "price" }
                  }
                })
                .sort({ orderDate: -1 })
                .exec((err, orderDocs) => {
                  if (err) {
                    console.log(err.message);
                    res.sendStatus(500);
                  } else {
                    if (orderDocs) {
                      let price = 0;

                      orderDocs.cart.cartItems.forEach(i => {
                        price += i.quantity * i.product.price;
                      });

                      res.json([
                        { cart: false },
                        { ...orderDocs.toObject(), price }
                      ]);
                    } else {
                      res.json([{ cart: false }]);
                    }
                  }
                });
            }
          });
        }
      }
    });
});

module.exports = router;
