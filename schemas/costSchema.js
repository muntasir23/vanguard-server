const mongoose = require("mongoose");

const costSchema = mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  catagory: {
    type: String,
    required: true,
  },
});

module.exports = costSchema;
