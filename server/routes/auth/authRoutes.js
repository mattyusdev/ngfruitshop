const router = require("express").Router();

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const onlyUsers = require("./mw/onlyUsers");
const Users = require("../../mongodb/models/user");

router.post("/register/validation", (req, res) => {
  const { idNumber, email } = req.body;

  if (idNumber && email) {
    Users.findOne({ idNumber }, (err, results) => {
      if (err) {
        console.log(err.message);
        res.sendStatus(500);
      } else {
        if (!results) {
          Users.findOne({ email }, (err, emailResults) => {
            if (err) {
              console.log(err.message);
              res.sendStatus(500);
            } else {
              if (!emailResults) {
                res.sendStatus(200);
              } else {
                res.status(400).send("Email already exist.");
              }
            }
          });
        } else {
          res.status(400).send("Id number already exist.");
        }
      }
    });
  } else {
    res.status(400).send("Missing Info");
  }
});

router.post("/register", (req, res) => {
  const {
    idNumber,
    firstName,
    lastName,
    email,
    password,
    city,
    street,
  } = req.body;

  if (
    idNumber &&
    firstName &&
    lastName &&
    email &&
    password &&
    city &&
    street
  ) {
    Users.findOne({ idNumber }, (err, results) => {
      if (err) {
        console.log(err.message);
        res.sendStatus(500);
      } else {
        if (!results) {
          Users.findOne({ email }, async (err, emailResults) => {
            if (err) {
              console.log(err.message);
              res.sendStatus(500);
            } else {
              if (!emailResults) {
                const salt = await bcryptjs.genSalt(10);
                const hash = await bcryptjs.hash(password, salt);

                const newUser = new Users({
                  idNumber,
                  firstName,
                  lastName,
                  email,
                  password: hash,
                  city,
                  street,
                });

                newUser.save((err, results) => {
                  if (err) {
                    console.log(err.message);
                    res.sendStatus(500);
                  } else {
                    const userData = {
                      id: results._id,
                      isAdmin: results.isAdmin,
                      firstName: results.firstName,
                      lastName: results.lastName,
                    };

                    jwt.sign(
                      userData,
                      process.env.JWTSECRET,
                      { expiresIn: "50m" },
                      (err, token) => {
                        if (err) throw err;
                        res.json([token, userData]);
                      }
                    );
                  }
                });
              } else {
                res.status(400).send("Email already exist.");
              }
            }
          });
        } else {
          res.status(400).send("Id number already exist.");
        }
      }
    });
  } else {
    res.status(400).send("Missing Info");
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    Users.findOne({ email }, (err, results) => {
      if (err) {
        console.log(err.message);
        res.sendStatus(500);
      } else {
        if (results) {
          if (bcryptjs.compareSync(password, results.password)) {
            const userData = {
              id: results._id,
              isAdmin: results.isAdmin,
              firstName: results.firstName,
              lastName: results.lastName,
            };

            jwt.sign(
              userData,
              process.env.JWTSECRET,
              { expiresIn: "50m" },
              (err, token) => {
                if (err) throw err;
                res.json([token, userData]);
              }
            );
          } else {
            res.status(400).send("Password is incorrect.");
          }
        } else {
          res.status(400).send("Email is incorrect.");
        }
      }
    });
  } else {
    res.status(400).send("Missing info");
  }
});

router.get("/userdata", onlyUsers, (req, res) => {
  res.json(req.token);
});

router.get("/usershippingdata", onlyUsers, (req, res) => {
  Users.findById(req.token.id, (err, doc) => {
    if (err) {
      console.log(err.message);
      res.sendStatus(500);
    } else {
      res.json({ city: doc.city, street: doc.street });
    }
  });
});

module.exports = router;
