const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createClassValidation, updateClassValidation } = require("./validations/classValidation");
const { createCategoryValidation } = require("./validations/categoryValidation");




const prisma = new PrismaClient();
const app = express();  

dotenv.config();
const PORT = process.env.PORT ;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());


//ReadMany
app.get("/api/class", async (req, res) => {
  try {
      const classes = await prisma.class.findMany({
          where: {
              status: true,
          },
          include: {
              category: true, // Tambahkan ini untuk menyertakan data category
          },
      });

      res.status(200).json({
          message: "Success get class data",
          datas: classes,
      });
  } catch (error) {
      console.error("Error fetching classes:", error);
      res.status(500).json({ message: "Failed to fetch class data" });
  }
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
      include: {
          category: true, // Sertakan kategori jika relasi kategori dihubungkan
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
    const {error, value} = createClassValidation(req.body);

    if (error) {
        return res.status(422).json({ message: error.details[0].message });
    }

    const classData = await prisma.class.create({
        data: value
    });
    
    res.status(200).json({
        message: "Success create class data",
        datas: classData,
    }); 
});

//Patch
app.patch("/api/class/:id", async (req, res) => {
    const {id} = req.params;
    
    const {error, value} = updateClassValidation(req.body);
    if (error) {
      return res.status(422).json({ message: error.details[0].message});
    }

    const classData = await prisma.class.update({
        where: {
            id,
        },
        data: value,
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
  const {error,value} = createCategoryValidation(req.body);

  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }

  try {
    const categoryData = await prisma.category.create({
      data: value
    });

    res.status(201).json({
      message: "Success create category data",
      data: categoryData,
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

// REGISTER

app.use('/api/register',async (req, res) => {
  const {name, email, phone, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
    }
  })
  res.json({
    message: "Success register",
    data: result
  })
})

//LOGIN
app.use('/api/login',async (req, res) => {
  const {email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if(!user){
    res.status(404).json({
      message: "Alamat email tidak terdaftar" 
      });
    }
    if(!user?.password) {
      return res.status(404),json ({
        message: "Password not set"
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if(isPasswordValid) {
      const payload = {
        id: user.id,
        email: user.email
      }

      const secret = process.env.JWT_SECRET;

      const expiresIn = 60 * 60 * 1;

      const token = jwt.sign(payload, secret, { expiresIn: expiresIn })

      return res.json({
        data: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token: token
      })
    } else {
      return res.status(403).json({
        message: "Maaf, kata sandi salah"
      })
    }
  })

//GET ALL USER
app.get("/api/user", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({
      message: "Success get user data",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

//GET USER BY ID
app.get("/api/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Success get user data",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
    })

//Update User
app.patch("/api/user/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });

    res.status(200).json({
      message: "Success update user data",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

//Soft Delete User
app.delete("/api/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { status: false },
    });

    res.status(200).json({
      message: "Success delete user data",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});
