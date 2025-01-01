const mongoose = require("mongoose");

const transportSchema = mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
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
  paidBy: {
    type: String,
    enum: ["Person", "Company"],
  },
});

module.exports = transportSchema;
