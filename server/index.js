const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

require("dotenv").config();
require("./mongodb/connection"); // MONGOOSE CONNECTION

const authRoutes = require("./routes/auth/authRoutes");
const storeRoutes = require("./routes/store/storeRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/store", storeRoutes);
app.use("/images", express.static(__dirname + "/uploads"));

app.listen(
  process.env.PORT,
  console.log(`[express] is running at ${process.env.PORT}`)
);
