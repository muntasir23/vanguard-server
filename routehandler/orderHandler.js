const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const orderSchema = require("../schemas/orderSchema");
const Order = new mongoose.model("Oder", orderSchema);

// GET ALL ORDER DATA
router.get("/", async (req, res) => {
  try {
    // Parse query parameters
    const { page = 1, limit = 2, search } = req.query;

    // Construct the filter object
    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Pagination variables
    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
    };

    // Get the total count for pagination
    const total = await Order.countDocuments(filter);

    // Fetch the filtered and paginated data
    const orders = await Order.find(filter, null, options);

    // Send response
    res.status(200).json({
      data: orders,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

// GET A ORDER
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order data not found" });
    }

    res.status(200).json({ data: order });
  } catch (err) {
    // Handle invalid ObjectId or other errors
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid oder ID" });
    }
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

// POST A ORDER
router.post("/", async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    newOrder.save();
    res.status(200).json({
      message: "Order data has inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was an server side error!",
    });
  }
});

// POST MULTIPLE ORDER
router.post("/all", async (req, res) => {
  try {
    Order.insertMany(req.body);
    res.status(200).json({
      message: "Many orders data has inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was an error!",
    });
  }
});

// UPDATE A ORDER
router.put("/:id", async (req, res) => {
  try {
    await Order.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
          soldBy: req.body.soldBy,
        },
      }
    );
    res.status(200).json({
      message: "Oder was updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

// DELETE A ORDER
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the product by ID
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order deleted successfully", data: deletedOrder });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

module.exports = router;
