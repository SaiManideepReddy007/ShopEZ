const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCartByUser,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

router.post("/", addToCart);
router.get("/:userId", getCartByUser);
router.put("/:id", updateCartItem);
router.delete("/:id", removeCartItem);

module.exports = router;