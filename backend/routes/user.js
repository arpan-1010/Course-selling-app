const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userRouter = Router();

const { userValidation } = require("../validations/userValidation");
const { userSignInValidation } = require("../validations/userSignInValidation");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { userModel, courseModel, purchaseModel } = require("../db");

userRouter.post("/signup", async (req, res) => {
    const result = userValidation.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid inputs",
            errors: result.error.format()
        });
    }

    try {
        const existingUser = await userModel.findOne({
            email: result.data.email
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(result.data.password, 10);

        const user = await userModel.create({
            email: result.data.email,
            password: hashedPassword,
            firstName: result.data.firstName,
            lastName: result.data.lastName
        });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_USER_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            message: "User created successfully",
            token
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
});

userRouter.post("/signin", async (req, res) => {
    const result = userSignInValidation.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid inputs",
            errors: result.error.format()
        });
    }

    try {
        const user = await userModel.findOne({
            email: result.data.email
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const passwordMatch = await bcrypt.compare(
            result.data.password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_USER_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Signin successful",
            token
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error signing in",
            error: error.message
        });
    }
});

userRouter.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select("-password")
        if(!user) {
            return res.status(404).json({
                message : "User not found"
            })
        }
        return res.status(200).json({
            user
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message
        })
    }
})

userRouter.get("/course/bulk", async (req, res) => {
    try {
        const courses = await courseModel.find({});

        return res.status(200).json({
            courses
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching courses",
            error: error.message
        });
    }
});

userRouter.get("/course/:courseId", async (req, res) => {
    try {
        const course = await courseModel.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        return res.status(200).json({
            course
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching course",
            error: error.message
        });
    }
});

userRouter.get("/purchases", authMiddleware, async (req, res) => {
    try {
        const purchases = await purchaseModel.find({
            userId: req.userId
        });

        return res.status(200).json({
            purchases
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching purchases",
            error: error.message
        });
    }
});

userRouter.delete("/delete-account", authMiddleware, async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.userId)
        return res.status(200).json({ message: "Account deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
});

module.exports = {
    userRouter
};