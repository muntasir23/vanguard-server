const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  productionCost: {
    type: Number,
    required: true,
  },
  M: {
    type: Number,
  },
  L: {
    type: Number,
  },
  XL: {
    type: Number,
  },
  XXL: {
    type: Number,
  },
});

module.exports = productSchema;
