const express = require("express");

const {
    createRoom,
    getRooms,
    getRoomById,
    updateRoom,
    updateRoomStatus,
    deleteRoom
} = require("../controllers/roomController");

// REMOVED: authMiddleware and adminMiddleware imports
// const authMiddleware = require("../middleware/authMiddleware");
// const adminMiddleware = require("../middleware/adminMiddleware");

// Keep upload middleware for file handling
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ==========================================
// PUBLIC ROUTES - NO PROTECTION
// ==========================================

router.get("/", getRooms);
router.get("/:id", getRoomById);

// ==========================================
// ADMIN ROUTES - NO PROTECTION (Anyone can do anything)
// ==========================================

// POST - Create room (NO AUTH REQUIRED)
router.post(
    "/",
    (req, res, next) => {
        req.uploadType = "room";
        next();
    },
    upload.single("image"),
    createRoom
);

// PUT - Update room (NO AUTH REQUIRED)
router.put(
    "/:id",
    (req, res, next) => {
        req.uploadType = "room";
        next();
    },
    upload.single("image"),
    updateRoom
);

// PATCH - Update room status (NO AUTH REQUIRED)
router.patch(
    "/:id/status",
    updateRoomStatus
);

// DELETE - Delete room (NO AUTH REQUIRED)
router.delete(
    "/:id",
    deleteRoom
);

module.exports = router;