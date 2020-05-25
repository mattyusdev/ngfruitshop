const router = require("express").Router();

const PDFDocument = require("pdfkit");
const moment = require("moment");

const onlyUsers = require("../../auth/mw/onlyUsers");

const Carts = require("../../../mongodb/models/cart");
const Orders = require("../../../mongodb/models/order");

router.post("/", onlyUsers, (req, res) => {
  const { cart, city, street, arriveDate, creditCard } = req.body;

  if (cart && city && street && arriveDate && creditCard) {
    Carts.findOneAndUpdate(
      { user: req.token.id, isDone: false },
      { isDone: true },
      (err, cartDoc) => {
        if (err) {
          console.log(err.message);
          res.sendStatus(500);
        } else {
          const newOrder = new Orders({
            cart,
            city,
            street,
            arriveDate,
            creditCard: creditCard.toString().substr(-4),
          });

          newOrder.save((err, orderDoc) => {
            if (err) {
              console.log(err.message);
              res.sendStatus(500);
            } else {
              res.json(orderDoc._id);
            }
          });
        }
      }
    );
  } else {
    res.status(400).send("Missing Info");
  }
});

router.get("/:orderId", onlyUsers, (req, res) => {
  Orders.findById(req.params.orderId)
    .populate({
      path: "cart",
      select: "cartItems user",
      populate: {
        path: "cartItems user",
        select: "product quantity firstName lastName",
        populate: { path: "product", select: "name price" },
      },
    })
    .exec((err, orderDoc) => {
      if (err) {
        console.log(err.message);
        res.sendStatus(500);
      } else {
        if (req.token.id == orderDoc.cart.user._id) {
          const doc = new PDFDocument();
          doc.pipe(res);

          //////////////////////////////////////////////////////////////////
          doc.fontSize(22).text(`Order ID - ${orderDoc._id}`, 100, 60);
          doc
            .fontSize(16)
            .text(
              `Customer: ${orderDoc.cart.user.firstName} ${orderDoc.cart.user.lastName}`,
              100,
              100
            );

          doc
            .fontSize(16)
            .text(
              `Order date: ${orderDoc.orderDate.toLocaleString()}`,
              100,
              130
            );
          doc
            .fontSize(16)
            .text(
              `Shipping date: ${orderDoc.arriveDate.toLocaleDateString()}`,
              100,
              160
            );
          //////////////////////////////////////////////////////////////////

          doc.fontSize(20).text(`Items:`, 100, 200);

          let totalPrice = 0;

          let items = "";

          orderDoc.toObject().cart.cartItems.forEach((i) => {
            totalPrice += i.quantity * i.product.price;
            items += `${i.product.name} x ${i.quantity} | $${
              i.product.price * i.quantity
            } \n`;
          });

          items += `\n Total: $${totalPrice} \n\n Credit Card: XXXX XXXX XXXX ${orderDoc.creditCard} \n\n Thanks for choosing Ng Shop!`;

          doc.fontSize(14).text(items, 100, 230);

          //////////////////////////////////////////////////////////////////

          doc.end();
        } else {
          res.sendStatus(401);
        }
      }
    });
});

router.post("/arrivedate", onlyUsers, (req, res) => {
  const { arrDate } = req.body;

  const date = new Date(arrDate);
  let datePlusOne = new Date(arrDate);
  datePlusOne.setDate(datePlusOne.getDate() + 1);

  Orders.find(
    {
      arriveDate: {
        $gte: date,
        $lt: datePlusOne,
      },
    },
    (err, docs) => {
      if (err) {
        console.log(err.message);
        res.sendStatus(500);
      } else {
        if (docs) {
          if (docs.length < 3) {
            res.sendStatus(200);
          } else {
            res
              .status(400)
              .send("This shipping date is full, try another one.");
          }
        } else {
          res.sendStatus(200);
        }
      }
    }
  );
});

module.exports = router;
