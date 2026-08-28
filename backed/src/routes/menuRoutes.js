const express = require("express");

const {
  createFood,
  getMenu,
  getFoodById,
  updateFood,
  updateFoodAvailability,
  deleteFood,
} = require("../controllers/menuController");

// REMOVED: authMiddleware and adminMiddleware imports
// const authMiddleware = require("../middleware/authMiddleware");
// const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ===================================
// PUBLIC ROUTES - NO PROTECTION
// ==========================================

router.get("/", getMenu);
router.get("/:id", getFoodById);

// ===================================
// ADMIN ROUTES - NO PROTECTION
// ==========================================

// POST - Create food (NO AUTH REQUIRED)
router.post("/", createFood);

// PUT - Update food (NO AUTH REQUIRED)
router.put("/:id", updateFood);

// PATCH - Update food availability (NO AUTH REQUIRED)
router.patch("/:id/availability", updateFoodAvailability);

// DELETE - Delete food (NO AUTH REQUIRED)
router.delete("/:id", deleteFood);

module.exports = router;