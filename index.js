const express = require("express");
const mongoose = require("mongoose");
const productHandler = require("./routehandler/productHandler");
const costHandler = require("./routehandler/costHandler");
const transportHandler = require("./routehandler/trasportHandler");
const oderHandler = require("./routehandler/orderHandler");
const cors = require('cors');

const app = express();
app.use(express.json());


// cors using
app.use(cors());

// database connection with mongoose
mongoose
  .connect(
    "mongodb+srv://muntasiraahmed3:ezGrNVTsKyqTQFwj@cluster0.o3rim.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));

// application routes

app.use("/product", productHandler);
app.use("/cost", costHandler);
app.use("/transport", transportHandler);
app.use("/order", oderHandler);


// default error handler
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
