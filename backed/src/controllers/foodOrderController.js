const prisma = require("../util/prisma");

// ==========================================
// CREATE FOOD ORDER
// ==========================================

const createFoodOrder = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    const userId = req.user.userId;

    if (!foodId || !quantity) {
      return res.status(400).json({
        message: "foodId and quantity are required",
      });
    }

    if (quantity <= 0 || !Number.isInteger(Number(quantity))) {
      return res.status(400).json({
        message: "Quantity must be a positive whole number",
      });
    }

    // Find food
    const food = await prisma.food.findUnique({
      where: {
        id: foodId,
      },
    });

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    // Check if food is available
    if (!food.available) {
      return res.status(400).json({
        message: "This food is currently unavailable",
      });
    }

    // Calculate total
    const totalPrice = Number(food.price) * Number(quantity);

    // Create order
    const foodOrder = await prisma.foodOrder.create({
      data: {
        userId,
        foodId,
        quantity: Number(quantity),
        totalPrice,
      },
      include: {
        food: true,
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
      message: "Food order created successfully",
      foodOrder,
    });
  } catch (error) {
    console.error("CREATE FOOD ORDER ERROR:", error);

    return res.status(500).json({
      message: "Failed to create food order",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL FOOD ORDERS
// ==========================================

const getFoodOrders = async (req, res) => {
  try {
    const foodOrders = await prisma.foodOrder.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        food: true,
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
      message: "Food orders fetched successfully",
      foodOrders,
    });
  } catch (error) {
    console.error("GET FOOD ORDERS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch food orders",
      error: error.message,
    });
  }
};


// ==========================================
// GET FOOD ORDER BY ID
// ==========================================

const getFoodOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const foodOrder = await prisma.foodOrder.findUnique({
      where: {
        id,
      },
      include: {
        food: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!foodOrder) {
      return res.status(404).json({
        message: "Food order not found",
      });
    }

    return res.status(200).json({
      message: "Food order fetched successfully",
      foodOrder,
    });
  } catch (error) {
    console.error("GET FOOD ORDER ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch food order",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE FOOD ORDER STATUS
// ==========================================

const updateFoodOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "PENDING",
      "PREPARING",
      "READY",
      "SERVED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid food order status",
        allowedStatuses,
      });
    }

    const foodOrder = await prisma.foodOrder.findUnique({
      where: {
        id,
      },
    });

    if (!foodOrder) {
      return res.status(404).json({
        message: "Food order not found",
      });
    }

    const updatedFoodOrder = await prisma.foodOrder.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        food: true,
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
      message: "Food order status updated successfully",
      foodOrder: updatedFoodOrder,
    });
  } catch (error) {
    console.error("UPDATE FOOD ORDER STATUS ERROR:", error);

    return res.status(500).json({
      message: "Failed to update food order status",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE FOOD ORDER
// ==========================================

const deleteFoodOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const foodOrder = await prisma.foodOrder.findUnique({
      where: {
        id,
      },
    });

    if (!foodOrder) {
      return res.status(404).json({
        message: "Food order not found",
      });
    }

    await prisma.foodOrder.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Food order deleted successfully",
    });
  } catch (error) {
    console.error("DELETE FOOD ORDER ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete food order",
      error: error.message,
    });
  }
};


module.exports = {
  createFoodOrder,
  getFoodOrders,
  getFoodOrderById,
  updateFoodOrderStatus,
  deleteFoodOrder,
};