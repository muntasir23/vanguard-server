const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const transportSchema = require("../schemas/transportSchema");
const Transport = new mongoose.model("Transport", transportSchema);

// GET ALL TRANSPORT DATA
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
    const total = await Transport.countDocuments(filter);

    // Fetch the filtered and paginated data
    const transports = await Transport.find(filter, null, options);

    // Send response
    res.status(200).json({
      data: transports,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

// GET A TRANSPORT DATA
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID
    const transport = await Transport.findById(id);

    if (!transport) {
      return res.status(404).json({ message: "Transport details not found" });
    }

    res.status(200).json({ data: transport });
  } catch (err) {
    // Handle invalid ObjectId or other errors
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

// POST A TRANSPORT DATA
router.post("/", async (req, res) => {
  const newTransport = new Transport(req.body);
  try {
    newTransport.save();
    res.status(200).json({
      message: "Trasport cost has inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was an server side error!",
    });
  }
});

// POST MULTIPLE TRANSPORT DATA
router.post("/all", async (req, res) => {
  try {
    Transport.insertMany(req.body);
    res.status(200).json({
      message: "Many transport costs data has inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was an error!",
    });
  }
});

// UPDATE A TRANSPORT DATA
router.put("/:id", async (req, res) => {
  try {
    await Transport.updateOne(
      { _id: req.params.id },
      {
        $set: {
          from: req.body.from,
          to: req.body.to,
          date: req.body.date,
          amount: req.body.amount,
          paidBy: req.body.paidBy,
        },
      }
    );
    res.status(200).json({
      message: "Transport details was updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

// DELETE A TRANSPORT DATA
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the product by ID
    const deletedTransport = await Transport.findByIdAndDelete(id);

    if (!deletedTransport) {
      return res.status(404).json({ message: "Item not found" });
    }

    res
      .status(200)
      .json({ message: "Cost deleted successfully", data: deletedTransport });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

module.exports = router;
