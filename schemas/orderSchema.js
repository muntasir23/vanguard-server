const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  products: [
    {
      productName: {
        type: String,
        required: true, // Required within the array
        trim: true,
      },
      size: {
        type: String,
        required: true,
        enum: ["M", "L", "XL", "XXL"],
      },
      price: {
        type: Number,
        required: true,
        min: 0, // Ensure price is non-negative
      },
      quantity: {
        type: Number,
        required: true,
        min: 0, // Ensure quantity is non-negative
      },
    },
    { timestamps: true },
  ],

  soldBy: {
    type: String,
    enum: ["Person", "Company"],
  },
  status:{
    enum: ["Pending", "Paid"],
  }
});

module.exports = orderSchema;
