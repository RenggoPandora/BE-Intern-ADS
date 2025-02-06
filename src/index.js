import express from "express";
import dotenv from "dotenv";
import {PrismaClient} from "@prisma/client"
import bodyParser from "body-parser";
import cors from "cors";


const prisma = new PrismaClient();
const app = express();  

dotenv.config();
const PORT = process.env.PORT ;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

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