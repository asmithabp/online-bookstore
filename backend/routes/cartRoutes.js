const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");

// GET CART
router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({ cart });
  } catch (error) {
    console.error("GET CART ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD TO CART
router.post("/", protect, async (req, res) => {
  try {
    const { bookId, title, price, coverImage, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const existing = cart.items.find((item) => item.book === bookId);

    if (existing) {
      existing.quantity += quantity || 1;
    } else {
      cart.items.push({
        book: bookId,
        title,
        price,
        coverImage,
        quantity: quantity || 1,
      });
    }

    await cart.save();

    res.json({ cart });
  } catch (error) {
    console.error("ADD CART ERROR:", error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

// UPDATE CART
router.put("/:itemId", protect, async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    const item = cart.items.id(req.params.itemId);

    item.quantity = quantity;

    await cart.save();

    res.json({ cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart" });
  }
});

// REMOVE ITEM
router.delete("/:itemId", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    cart.items.pull(req.params.itemId);

    await cart.save();

    res.json({ cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item" });
  }
});

// CLEAR CART
router.delete("/clear", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    cart.items = [];

    await cart.save();

    res.json({ cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

module.exports = router;