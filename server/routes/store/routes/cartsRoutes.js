const router = require("express").Router();

const onlyUsers = require("../../auth/mw/onlyUsers");

require("../../../mongodb/models/product");
require("../../../mongodb/models/category");
const Carts = require("../../../mongodb/models/cart");
const CartItems = require("../../../mongodb/models/cart-item");
const Orders = require("../../../mongodb/models/order");

router.get("/", onlyUsers, (req, res) => {
  Carts.findOne({ user: req.token.id, isDone: false })
    .select("cartItems date")
    .populate([
      {
        path: "cartItems",
        populate: { path: "product", populate: "categories" },
      },
    ])
    .exec((err, results) => {
      if (err) {
        console.log(err.message);
        res.sendStatus(500);
      } else {
        if (results) {
          let totalPrice = 0;

          const newResults = results.toObject().cartItems.map((c) => {
            const itemPrice = c.quantity * c.product.price;
            totalPrice += itemPrice;

            const newItem = { ...c, itemPrice };
            return newItem;
          });

          res.json({
            ...results.toObject(),
            cartItems: newResults,
            totalPrice,
          });
        } else {
          res.json(null);
        }
      }
    });
});

router.post("/items", onlyUsers, (req, res) => {
  const { product, quantity } = req.body;

  Carts.findOne({ user: req.token.id, isDone: false }).exec((err, results) => {
    if (err) {
      console.log(err.message);
      res.sendStatus(500);
    } else {
      if (results) {
        const newCartItem = new CartItems({
          product,
          quantity,
        });
        newCartItem.save((err, item) => {
          if (err) {
            console.log(err.message);
            res.sendStatus(500);
          } else {
            results.updateOne(
              {
                $push: { cartItems: item._id },
              },
              (err, doc) => {
                if (err) {
                  console.log(err.message);
                  res.sendStatus(500);
                } else {
                  res.sendStatus(201);
                }
              }
            );
          }
        });
      } else {
        const newCartItem = new CartItems({
          product,
          quantity,
        });
        newCartItem.save((err, item) => {
          if (err) {
            console.log(err.message);
            res.sendStatus(500);
          } else {
            const newCart = new Carts({
              user: req.token.id,
              cartItems: [item._id],
            });
            newCart.save((err, doc) => {
              if (err) {
                console.log(err.message);
                res.sendStatus(500);
              } else {
                res.sendStatus(201);
              }
            });
          }
        });
      }
    }
  });
});

router.delete("/items/:id", onlyUsers, (req, res) => {
  const { id } = req.params;

  CartItems.findByIdAndRemove(id, (err, item) => {
    if (err) {
      console.log(err.message);
      res.sendStatus(500);
    } else {
      Carts.findOneAndUpdate(
        { user: req.token.id, isDone: false },
        { $pull: { cartItems: id } },
        { new: true },
        (err, cart) => {
          if (err) {
            console.log(err.message);
            res.sendStatus(500);
          } else {
            // res.sendStatus(200);
            if (cart.cartItems.length) {
              res.sendStatus(200);
            } else {
              cart.remove((err, removedCart) => {
                if (err) {
                  console.log(err.message);
                  res.sendStatus(500);
                } else {
                  res.send("OK, Cart removed.");
                }
              });
            }
          }
        }
      );
    }
  });
});

router.delete("/items", onlyUsers, (req, res) => {
  Carts.findOne({ user: req.token.id, isDone: false }, (err, cart) => {
    if (err) {
      console.log(err.message);
      res.sendStatus(500);
    } else {
      CartItems.deleteMany({ _id: [...cart.cartItems] }, (err, item) => {
        if (err) {
          console.log(err.message);
          res.sendStatus(500);
        } else {
          cart.remove((err, doc) => {
            if (err) {
              console.log(err.message);
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          });
        }
      });
    }
  });
});

module.exports = router;
