const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/", protect, placeOrder);
router.get("/user/:userId", protect, getOrdersByUser);
router.get("/", protect, isAdmin, getAllOrders);
router.put("/:id/cancel", protect, cancelOrder);
router.put("/:id", protect, isAdmin, updateOrderStatus);

module.exports = router;