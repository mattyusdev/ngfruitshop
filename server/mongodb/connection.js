const mongoose = require("mongoose");
require("dotenv").config();

const mongooseConnect = mongoose.connect(process.env.MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
mongoose.connection
  .on("open", () => {
    console.log("[mongoose] is connected");
  })
  .on("error", err => {
    console.log(`Connection error: ${err.message}`);
  });

module.exports = mongooseConnect;
