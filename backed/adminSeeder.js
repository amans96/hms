require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("./src/util/prisma");

const createAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env"
      );
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    // Admin already exists
    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await prisma.user.create({
      data: {
        name: "Hotel Administrator",
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: true,
        isActive: true,
      },
    });

    console.log("=================================");
    console.log("ADMIN ACCOUNT CREATED");
    console.log("=================================");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("=================================");

  } catch (error) {
    console.error("ADMIN SEED ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();