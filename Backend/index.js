const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
dotEnv.config();

app.use(express.json());

// CONNECTION
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("DB connection success");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3500, () => {
  console.log("App server start...");
});
