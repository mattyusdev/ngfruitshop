const router = require("express").Router();
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

const onlyUsers = require("../../auth/mw/onlyUsers");
const onlyAdmins = require("../../auth/mw/onlyAdmins");

const Products = require("../../../mongodb/models/product");
const Categories = require("../../../mongodb/models/category");

router.get("/", onlyUsers, (req, res) => {
  Products.find()
    .populate("categories")
    .exec((err, results) => {
      if (err) {
        console.log(err.message);
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    });
});

router.get("/categories", onlyUsers, (req, res) => {
  Categories.find({}, (err, results) => {
    if (err) {
      console.log(err.message);
      res.sendStatus(500);
    } else {
      res.json(results);
    }
  });
});

router.get("/categories/:name", onlyUsers, (req, res) => {
  const { name } = req.params;

  Categories.findOne(
    { name: { $regex: "^" + name + "$", $options: "i" } },
    (err, doc) => {
      if (err) {
        console.log(err.message);
        res.sendStatus(500);
      } else {
        if (doc) {
          Products.find({ categories: { $in: [doc._id] } })
            .populate("categories")
            .exec((err, results) => {
              if (err) {
                console.log(err.message);
                res.sendStatus(500);
              } else {
                res.json(results);
              }
            });
        } else {
          res.sendStatus(404);
        }
      }
    }
  );
});

router.get("/search/:text", onlyUsers, (req, res) => {
  Products.find({ name: { $regex: "^" + req.params.text, $options: "i" } })
    .populate("categories")
    .exec((err, results) => {
      if (err) {
        console.log(err.message);
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    });
});

router.post("/upload/:id", (req, res) => {
  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "/../../../uploads");
  form.on("file", (field, file) => {
    fs.rename(
      file.path,
      path.join(form.uploadDir, req.params.id + ".jpg"),
      (err) => {
        if (err) throw err;
      }
    );
  });
  form.on("error", (err) => {
    console.log("An error has occured: \n" + err);
  });
  form.on("end", () => {
    res.send("success");
  });
  form.parse(req);
});

router.post("/", onlyAdmins, (req, res) => {
  const { name, categories, price } = req.body;

  if (name && categories && price) {
    const newProd = new Products({
      name,
      categories,
      price,
      image: "initial",
    });
    newProd.save((err, doc) => {
      if (err) {
        console.log(err.message);
        res.sendStatus(500);
      } else {
        doc.updateOne(
          {
            $set: {
              image: "/images/" + doc._id + ".jpg",
            },
          },
          (err, updatedDoc) => {
            if (err) {
              console.log(err.message);
              res.sendStatus(500);
            } else {
              res.json(doc._id);
            }
          }
        );
      }
    });
  } else {
    res.status(400).send("Missing Info");
  }
});

router.put("/:productId", onlyAdmins, (req, res) => {
  let { name, categories, price } = req.body;

  categories = [categories];

  if (name && categories && price) {
    Products.findByIdAndUpdate(
      req.params.productId,
      {
        $set: {
          name,
          categories,
          price,
        },
      },
      (err, doc) => {
        if (err) {
          console.log(err.message);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      }
    );
  } else {
    res.status(400).send("Missing Info");
  }
});

module.exports = router;
