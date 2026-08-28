const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const menuRoutes = require("./routes/menuRoutes");
const foodOrderRoutes = require("./routes/foodOrderRoutes");
const uploadRoutes = require("./routes/uploadRoutes"); // Add this line

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "../uploads")
    )
);

app.get("/", (req, res) => {
    res.json({
        message: "Hotel Management System API is running!"
    });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/food-orders", foodOrderRoutes);
app.use("/api", uploadRoutes); // Add this line - mounts upload routes at /api/upload

// Error handling middleware for file uploads
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
            error: 'File too large. Maximum size is 5MB.' 
        });
    }
    if (err.message && err.message.includes('Invalid file type')) {
        return res.status(400).json({ 
            error: err.message 
        });
    }
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error' 
    });
});

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});