const multer = require("multer");
const path = require("path");
const fs = require("fs");

const roomsPath = path.join(__dirname, "../../uploads/rooms");
const foodsPath = path.join(__dirname, "../../uploads/foods");

// Make sure folders exist
fs.mkdirSync(roomsPath, { recursive: true });
fs.mkdirSync(foodsPath, { recursive: true });

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        if (req.uploadType === "room") {
            cb(null, roomsPath);
        } else {
            cb(null, foodsPath);
        }

    },

    filename: function (req, file, cb) {

        const extension =
            path.extname(file.originalname).toLowerCase();

        const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            ),
            false
        );
    }
};

const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});

module.exports = upload;