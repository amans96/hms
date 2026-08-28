const prisma = require("../util/prisma");

// Create a booking
const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;

    // User comes from authentication middleware
    const userId = req.user.userId;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        message: "roomId, checkIn and checkOut are required",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid check-in or check-out date",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date",
      });
    }

    // Check if room exists
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    // Check overlapping bookings
    const existingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        status: {
          not: "CANCELLED",
        },
        checkIn: {
          lt: checkOutDate,
        },
        checkOut: {
          gt: checkInDate,
        },
      },
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "Room is already booked for these dates",
      });
    }

    // Calculate number of nights
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const nights = Math.ceil(
      (checkOutDate - checkInDate) / millisecondsPerDay
    );

    const totalPrice = Number(room.price) * nights;

    const booking = await prisma.booking.create({
      data: {
        userId,
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice,
      },
      include: {
        room: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);

    return res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
};


// Get all bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        room: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};


// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },
      include: {
        room: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      message: "Booking fetched successfully",
      booking,
    });
  } catch (error) {
    console.error("GET BOOKING ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};


// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "CHECKED_IN",
      "CHECKED_OUT",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status",
        allowedStatuses,
      });
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        room: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("UPDATE BOOKING STATUS ERROR:", error);

    return res.status(500).json({
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};


// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    await prisma.booking.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("DELETE BOOKING ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete booking",
      error: error.message,
    });
  }
};


module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
};