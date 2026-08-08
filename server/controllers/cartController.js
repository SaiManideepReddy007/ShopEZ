const Cart = require("../models/Cart");

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const newCartItem = new Cart(req.body);
    await newCartItem.save();
    res.status(201).json({ message: "Item added to cart", item: newCartItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all cart items for a user
const getCartByUser = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId });
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update cart item (e.g. change quantity)
const updateCartItem = async (req, res) => {
  try {
    const updatedItem = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json({ message: "Cart item updated", item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
  try {
    const deletedItem = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addToCart, getCartByUser, updateCartItem, removeCartItem };