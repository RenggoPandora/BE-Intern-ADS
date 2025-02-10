import express from "express";
import dotenv from "dotenv";
import {PrismaClient} from "@prisma/client"
import bodyParser from "body-parser";
import cors from "cors";
import categoryRoutes from './routes/categoryRoutes.js'; // Impor categoryRoutes
import classRoutes from './routes/classRoutes.js'; // Impor classRoutes



const prisma = new PrismaClient();
const app = express();  

dotenv.config();
const PORT = process.env.PORT ;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

// Gunakan routes untuk class
app.use("/api/class", classRoutes);

// Gunakan routes untuk category
app.use("/api/category", categoryRoutes);


//ReadMany
app.get("/api/class", async (req, res) => {
    const classes = await prisma.class.findMany({
        where: {
            status: true,
        }
    });
    console.log(classes);

    res.status(200).json({
        message: "Success get class data",
        datas : classes,
    }); 
});

//ReadByID
app.get("/api/class/:id", async (req, res) => {

    const {id} = req.params;
    console.log(id);
    const classData = await prisma.class.findFirst({
        where: {
            id,
            status: true,
        },
    });
    
    console.log(classData);
    res.status(200).json({
        message: "Success get class data",
        data: classData,
    }); 
});

//Create
app.post("/api/class", async (req, res) => {
    const data= req.body;
    

    const classData = await prisma.class.create({
        data,
    });
    
    res.status(200).json({
        message: "Success create class data",
        datas: classData,
    }); 
});

//Patch
app.patch("/api/class/:id", async (req, res) => {
    const {id} = req.params;
    const data = req.body;
    const classData = await prisma.class.update({
        where: {
            id,
        },
        data,
    });
    
    res.status(200).json({
        message: "Success update class data",
        datas: classData,
    });
})

/*/Delete
app.delete("/api/class/:id", async (req, res) => {
    const {id} = req.params;
    const classData = await prisma.class.delete({
        where: {
            id,
        },
    });
    
    res.status(200).json({
        message: "Success delete class data",
        datas: classData,
    });
})
*/

//Soft Delete
app.delete("/api/class/:id", async (req, res) => {
    const {id} = req.params;
    const classData = await prisma.class.update({
        where: {
            id,
            status: true,
        },
        data: {status: false}
    });
    
    res.status(200).json({
        message: "Success  class data",
        datas: classData,
    });
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Category Routes

// Get all categories
app.get("/api/category", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        status: true,
      },
      include: {
        classes: true, // Include related classes if needed
      },
    });

    res.status(200).json({
      message: "Success get category data",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
});

// Get category by ID
app.get("/api/category/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findFirst({
      where: {
        id,
        status: true,
      },
      include: {
        classes: true,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Success get category data",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
});

// Create a category
app.post("/api/category", async (req, res) => {
  const data = req.body;

  try {
    const category = await prisma.category.create({
      data,
    });

    res.status(201).json({
      message: "Success create category data",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
});

// Update a category
app.patch("/api/category/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const category = await prisma.category.update({
      where: { id },
      data,
    });

    res.status(200).json({
      message: "Success update category data",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
});

// Soft delete a category
app.delete("/api/category/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { status: false },
    });

    res.status(200).json({
      message: "Success delete category data",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
});
