const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const productSchema = require("../schemas/productSchema");
const Product = new mongoose.model("Product", productSchema);

// GET ALL THE PRODUCT
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
    const total = await Product.countDocuments(filter);

    // Fetch the filtered and paginated data
    const products = await Product.find(filter, null, options);

    // Send response
    res.status(200).json({
      data: products,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

// GET A PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ data: product });
  } catch (err) {
    // Handle invalid ObjectId or other errors
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

// POST A PRODUCT
router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    newProduct.save();
    res.status(200).json({
      message: "Product has inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was an server side error!",
    });
  }
});

// POST MULTIPLE PRODUCTS
router.post("/all", async (req, res) => {
  try {
    Product.insertMany(req.body);
    res.status(200).json({
      message: "Many products has inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was an error!",
    });
  }
});

// PUT PRODUCT
router.put("/:id", async (req, res) => {
  try {
    await Product.updateOne(
      { _id: req.params.id },
      {
        $set: {
          productName: req.body.productName,
          imgUrl: req.body.imgUrl,
          M: req.body.M,
          L: req.body.L,
          XL: req.body.XL,
          XXL: req.body.XXL,
        },
      }
    );
    res.status(200).json({
      message: "It was updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the product by ID
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product deleted successfully", data: deletedProduct });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

module.exports = router;
