const { Router } = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const  JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD 
const { userMiddleware } = require("../middlewares/userMidd");
const bcrypt = require("bcrypt")//for hashing password
const { z } = require('zod'); //for input validations


const userRouter = Router();


userRouter.post("/signup", async function(req, res) {
    
    try {
        const { email, password, firstName, lastName } = req.body; 

    const requiredUser = z.object({
        email:z.string().email().max(30).min(2),
        password:z.string().min(4).max(40),
        firstName:z.string().min(2),
        lastName:z.string().min(2)
    })

    requiredUser.parse({email,password,firstName,lastName})

    const hashedPass =await bcrypt.hash(password,5)
    
        await userModel.create({
            email: email,
            password: hashedPass,
            firstName: firstName, 
            lastName: lastName
        })
        
        res.json({
            message: "Signup succeeded"
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors.map(err => ({
                    path: err.path,
                    message: err.message
                })),
            });
        }
     }
})


 userRouter.post("/signin",async function(req, res) {
    const { email, password} = req.body;

    const user = await userModel.findOne({
        email: email
        
    }); 

    if (user && await bcrypt.compare(password, user.password)){
        const token = jwt.sign({
            id: user._id,
        }, JWT_USER_PASSWORD);
        res.json({
            token: token,
            userName:user.firstName
        })
    }else {
            res.status(403).json({
                message: "Incorrect credentials"
            })
          }
})


userRouter.get("/purchases", userMiddleware, async function(req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        coursesData
    })
})

module.exports = {
    userRouter: userRouter
}