const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const costSchema = require("../schemas/costSchema");
const Cost = new mongoose.model("Cost", costSchema);

// GET ALL COST DATA
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
    const total = await Cost.countDocuments(filter);

    // Fetch the filtered and paginated data
    const costs = await Cost.find(filter, null, options);

    // Send response
    res.status(200).json({
      data: costs,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

// GET A COST
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
    
        // Find the product by ID
        const cost = await Cost.findById(id);
    
        if (!cost) {
          return res.status(404).json({ message: "Cost data not found" });
        }
    
        res.status(200).json({ data: cost });
      } catch (err) {
        // Handle invalid ObjectId or other errors
        if (err.kind === "ObjectId") {
          return res.status(400).json({ message: "Invalid product ID" });
        }
        res.status(500).json({ error: "Server error", message: err.message });
      }
});

// POST A COST
router.post("/", async (req, res) => {
  const newCost = new Cost(req.body);
  try {
    newCost.save();
    res.status(200).json({
      message: "Cost data has inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was an server side error!",
    });
  }
});

// POST MULTIPLE COST
router.post("/all", async (req, res) => {
  try {
    Cost.insertMany(req.body);
    res.status(200).json({
      message: "Many costs data has inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was an error!",
    });
  }
});

// UPDATE A COST
router.put("/:id", async (req, res) => {
  try {
    await Cost.updateOne(
      { _id: req.params.id },
      {
        $set: {
          description: req.body.description,
          date: req.body.date,
          amount: req.body.amount,
          catagory: req.body.catagory,
        },
      }
    );
    res.status(200).json({
      message: "Cost was updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

// DELETE A COST
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the product by ID
    const deletedCost = await Cost.findByIdAndDelete(id);

    if (!deletedCost) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Cost deleted successfully", data: deletedCost });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

module.exports = router;
