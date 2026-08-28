const prisma = require("../util/prisma");

// ==========================================
// CREATE ROOM
// ==========================================


const createRoom = async (req, res) => {

    try {

        const {
            roomNumber,
            type,
            price,
            status
        } = req.body;

        if (!roomNumber || !type || !price) {

            return res.status(400).json({
                message: "Room number, type and price are required."
            });
        }

        const existingRoom =
            await prisma.room.findUnique({
                where: {
                    roomNumber
                }
            });

        if (existingRoom) {

            return res.status(400).json({
                message: "Room number already exists."
            });
        }

        const image =
            req.file
                ? `/uploads/rooms/${req.file.filename}`
                : null;

        const room =
            await prisma.room.create({
                data: {
                    roomNumber,
                    type,
                    price: Number(price),
                    status: status || "AVAILABLE",
                    image
                }
            });

        res.status(201).json({
            message: "Room created successfully.",
            room
        });

    } catch (error) {

        console.error("CREATE ROOM ERROR:", error);

        res.status(500).json({
            message: "Failed to create room."
        });
    }
};


// ==========================================
// GET ALL ROOMS
// ==========================================

const getRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        roomNumber: "asc",
      },
    });

    return res.status(200).json({
      count: rooms.length,
      rooms,
    });

  } catch (error) {
    console.error("GET ROOMS ERROR:", error);

    return res.status(500).json({
      message: "Server error while fetching rooms",
    });
  }
};


// ==========================================
// GET SINGLE ROOM
// ==========================================

const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({
      where: {
        id,
      },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    return res.status(200).json({
      room,
    });

  } catch (error) {
    console.error("GET ROOM ERROR:", error);

    return res.status(500).json({
      message: "Server error while fetching room",
    });
  }
};


// ==========================================
// UPDATE ROOM
// ==========================================

const updateRoom = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            roomNumber,
            type,
            price,
            status
        } = req.body;

        const existingRoom =
            await prisma.room.findUnique({
                where: { id }
            });

        if (!existingRoom) {

            return res.status(404).json({
                message: "Room not found."
            });
        }

        const data = {};

        if (roomNumber !== undefined) {
            data.roomNumber = roomNumber;
        }

        if (type !== undefined) {
            data.type = type;
        }

        if (price !== undefined) {
            data.price = Number(price);
        }

        if (status !== undefined) {
            data.status = status;
        }

        // New image
        if (req.file) {

            data.image =
                `/uploads/rooms/${req.file.filename}`;

            // Delete old image
            if (existingRoom.image) {

                const oldPath =
                    path.join(
                        __dirname,
                        "../..",
                        existingRoom.image
                    );

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        const room =
            await prisma.room.update({
                where: { id },
                data
            });

        res.json({
            message: "Room updated successfully.",
            room
        });

    } catch (error) {

        console.error("UPDATE ROOM ERROR:", error);

        res.status(500).json({
            message: "Failed to update room."
        });
    }
};

// ==========================================
// UPDATE ROOM STATUS
// ==========================================

const updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "AVAILABLE",
      "BOOKED",
      "MAINTENANCE",
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid room status",
        validStatuses,
      });
    }

    const existingRoom = await prisma.room.findUnique({
      where: {
        id,
      },
    });

    if (!existingRoom) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const room = await prisma.room.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return res.status(200).json({
      message: "Room status updated successfully",
      room,
    });

  } catch (error) {
    console.error("UPDATE ROOM STATUS ERROR:", error);

    return res.status(500).json({
      message: "Server error while updating room status",
    });
  }
};


// ==========================================
// DELETE ROOM
// ==========================================

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({
      where: {
        id,
      },
      include: {
        bookings: true,
      },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    // Don't delete a room with booking history
    if (room.bookings.length > 0) {
      return res.status(400).json({
        message: "Cannot delete a room with booking history",
      });
    }

    await prisma.room.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Room deleted successfully",
    });

  } catch (error) {
    console.error("DELETE ROOM ERROR:", error);

    return res.status(500).json({
      message: "Server error while deleting room",
    });
  }
};


module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  updateRoomStatus,
  deleteRoom,
};