import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        status: true,
      },
    });

    res.status(200).json({
      message: 'Success get category data',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get category data',
      error: error.message,
    });
  }
};

// Get a category by ID
export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findFirst({
      where: {
        id,
        status: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
      });
    }

    res.status(200).json({
      message: 'Success get category data',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get category data',
      error: error.message,
    });
  }
};

// Create a category
export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json({
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create category',
      error: error.message,
    });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const category = await prisma.category.update({
      where: { id },
      data,
    });

    res.status(200).json({
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update category',
      error: error.message,
    });
  }
};

// Soft delete a category
export const softDeleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.update({
      where: {
        id,
        status: true,
      },
      data: { status: false },
    });

    res.status(200).json({
      message: 'Category marked as deleted',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete category',
      error: error.message,
    });
  }
};
