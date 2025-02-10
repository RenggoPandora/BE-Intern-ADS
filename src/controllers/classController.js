import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all classes (ReadMany)
export const getClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      where: {
        status: true,
      },
    });

    res.status(200).json({
      message: "Success get class data",
      datas: classes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get class data",
      error: error.message,
    });
  }
};

// Get a class by ID (ReadByID)
export const getClassById = async (req, res) => {
  const { id } = req.params;
  try {
    const classData = await prisma.class.findFirst({
      where: {
        id,
        status: true,
      },
    });

    if (!classData) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    res.status(200).json({
      message: "Success get class data",
      data: classData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get class data",
      error: error.message,
    });
  }
};

// Create a new class (Create)
export const createClass = async (req, res) => {
  const { code, name, type, level, price, content, categoryId } = req.body;
  try {
    const classData = await prisma.class.create({
      data: {
        code,
        name,
        type,
        level,
        price,
        content,
        categoryId,
      },
    });

    res.status(201).json({
      message: "Class created successfully",
      datas: classData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create class",
      error: error.message,
    });
  }
};

// Update an existing class (Update)
export const updateClass = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const classData = await prisma.class.update({
      where: { id },
      data,
    });

    res.status(200).json({
      message: "Class updated successfully",
      datas: classData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update class",
      error: error.message,
    });
  }
};

// Soft delete a class (Soft Delete)
export const softDeleteClass = async (req, res) => {
  const { id } = req.params;
  try {
    const classData = await prisma.class.update({
      where: {
        id,
        status: true,
      },
      data: { status: false },
    });

    res.status(200).json({
      message: "Class marked as deleted",
      datas: classData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete class",
      error: error.message,
    });
  }
};
