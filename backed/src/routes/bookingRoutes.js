const express = require("express");

const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController");

// REMOVED: protect middleware import
// const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// ALL ROUTES - PUBLIC (NO PROTECTION)
// ==========================================

// POST - Create booking (ANYONE can do)
router.post("/", createBooking);

// GET - View all bookings (ANYONE can do)
router.get("/", getBookings);

// GET - View single booking (ANYONE can do)
router.get("/:id", getBookingById);

// PATCH - Update booking status (ANYONE can do)
router.patch("/:id/status", updateBookingStatus);

// DELETE - Delete booking (ANYONE can do)
router.delete("/:id", deleteBooking);

module.exports = router;