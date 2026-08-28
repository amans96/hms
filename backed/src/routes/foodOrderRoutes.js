const express = require("express");

const {
  createFoodOrder,
  getFoodOrders,
  getFoodOrderById,
  updateFoodOrderStatus,
  deleteFoodOrder,
} = require("../controllers/foodOrderController");

// REMOVED: protect middleware import
// const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// ALL ROUTES - PUBLIC (NO PROTECTION)
// ==========================================

// POST - Create food order (ANYONE can do)
router.post("/", createFoodOrder);

// GET - View all food orders (ANYONE can do)
router.get("/", getFoodOrders);

// GET - View single food order (ANYONE can do)
router.get("/:id", getFoodOrderById);

// PATCH - Update food order status (ANYONE can do)
router.patch("/:id/status", updateFoodOrderStatus);

// DELETE - Delete food order (ANYONE can do)
router.delete("/:id", deleteFoodOrder);

module.exports = router;