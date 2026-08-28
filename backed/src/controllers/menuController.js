

const prisma = require("../util/prisma");

// ==========================================
// CREATE FOOD
// ==========================================

const createFood = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
    } = req.body;

    // Required fields
    if (!name || price === undefined || !category) {
      return res.status(400).json({
        message: "Name, price and category are required",
      });
    }

    // Validate category
    const validCategories = [
      "BREAKFAST",
      "LUNCH",
      "DINNER",
      "DRINK",
      "DESSERT",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: "Invalid food category",
        validCategories,
      });
    }

    // Validate price
    if (Number(price) <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0",
      });
    }

    // Create food
    const food = await prisma.food.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        price: Number(price),
        category,
        image: image || null,
      },
    });

    return res.status(201).json({
      message: "Food created successfully",
      food,
    });

  } catch (error) {
    console.error("CREATE FOOD ERROR:", error);

    return res.status(500).json({
      message: "Server error while creating food",
    });
  }
};


// ==========================================
// GET ALL MENU
// ==========================================

const getMenu = async (req, res) => {
  try {
    const { category } = req.query;

    const validCategories = [
      "BREAKFAST",
      "LUNCH",
      "DINNER",
      "DRINK",
      "DESSERT",
    ];

    // Validate category filter
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        message: "Invalid food category",
        validCategories,
      });
    }

    const foods = await prisma.food.findMany({
      where: category
        ? { category }
        : {},
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      count: foods.length,
      foods,
    });

  } catch (error) {
    console.error("GET MENU ERROR:", error);

    return res.status(500).json({
      message: "Server error while fetching menu",
    });
  }
};


// ==========================================
// GET SINGLE FOOD
// ==========================================

const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await prisma.food.findUnique({
      where: {
        id,
      },
    });

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    return res.status(200).json({
      food,
    });

  } catch (error) {
    console.error("GET FOOD ERROR:", error);

    return res.status(500).json({
      message: "Server error while fetching food",
    });
  }
};


// ==========================================
// UPDATE FOOD
// ==========================================

const updateFood = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      category,
      image,
    } = req.body;

    // Check food exists
    const existingFood = await prisma.food.findUnique({
      where: {
        id,
      },
    });

    if (!existingFood) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    // Validate category
    const validCategories = [
      "BREAKFAST",
      "LUNCH",
      "DINNER",
      "DRINK",
      "DESSERT",
    ];

    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        message: "Invalid food category",
        validCategories,
      });
    }

    // Validate price
    if (price !== undefined && Number(price) <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0",
      });
    }

    const food = await prisma.food.update({
      where: {
        id,
      },
      data: {
        ...(name !== undefined && {
          name: name.trim(),
        }),

        ...(description !== undefined && {
          description: description?.trim() || null,
        }),

        ...(price !== undefined && {
          price: Number(price),
        }),

        ...(category !== undefined && {
          category,
        }),

        ...(image !== undefined && {
          image: image || null,
        }),
      },
    });

    return res.status(200).json({
      message: "Food updated successfully",
      food,
    });

  } catch (error) {
    console.error("UPDATE FOOD ERROR:", error);

    return res.status(500).json({
      message: "Server error while updating food",
    });
  }
};


// ==========================================
// UPDATE AVAILABILITY
// ==========================================

const updateFoodAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;

    if (typeof available !== "boolean") {
      return res.status(400).json({
        message: "available must be true or false",
      });
    }

    const existingFood = await prisma.food.findUnique({
      where: {
        id,
      },
    });

    if (!existingFood) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    const food = await prisma.food.update({
      where: {
        id,
      },
      data: {
        available,
      },
    });

    return res.status(200).json({
      message: "Food availability updated successfully",
      food,
    });

  } catch (error) {
    console.error("UPDATE AVAILABILITY ERROR:", error);

    return res.status(500).json({
      message: "Server error while updating food availability",
    });
  }
};


// ==========================================
// DELETE FOOD
// ==========================================

const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await prisma.food.findUnique({
      where: {
        id,
      },
      include: {
        foodOrders: true,
      },
    });

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    // Don't delete food with order history
    if (food.foodOrders.length > 0) {
      return res.status(400).json({
        message: "Cannot delete food with order history",
      });
    }

    await prisma.food.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Food deleted successfully",
    });

  } catch (error) {
    console.error("DELETE FOOD ERROR:", error);

    return res.status(500).json({
      message: "Server error while deleting food",
    });
  }
};


module.exports = {
  createFood,
  getMenu,
  getFoodById,
  updateFood,
  updateFoodAvailability,
  deleteFood,
};