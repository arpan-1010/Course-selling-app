const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const adminRouter = Router();

const { adminValidation } = require("../validations/adminValidation");
const { adminSignInValidation } = require("../validations/adminSignInValidation");
const { courseValidation } = require("../validations/courseValidation");
const { adminMiddleware } = require("../middlewares/adminMiddleware");
const { adminModel, courseModel, lessonModel, reviewModel, purchaseModel } = require("../db");
const mongoose = require("mongoose");

const multer = require("multer")
const path = require("path")
const fs = require("fs")

adminRouter.post("/signup", async (req, res) => {
    const result = adminValidation.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid inputs",
            errors: result.error.format()
        });
    }

    try {
        const existingAdmin = await adminModel.findOne({
            email: result.data.email
        });

        if (existingAdmin) {
            return res.status(409).json({
                message: "Admin already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(result.data.password, 10);

        const admin = await adminModel.create({
            email: result.data.email,
            password: hashedPassword,
            firstName: result.data.firstName,
            lastName: result.data.lastName
        });

        const token = jwt.sign(
            { adminId: admin._id },
            process.env.JWT_ADMIN_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            message: "Admin created successfully",
            token
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error creating admin",
            error: error.message
        });
    }
});

adminRouter.post("/signin", async (req, res) => {
    const result = adminSignInValidation.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid inputs",
            errors: result.error.format()
        });
    }

    try {
        const admin = await adminModel.findOne({
            email: result.data.email
        });

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        const passwordMatch = await bcrypt.compare(
            result.data.password,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }

        const token = jwt.sign(
            { adminId: admin._id, email: admin.email },
            process.env.JWT_ADMIN_SECRET,
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

adminRouter.get("/me", adminMiddleware, async (req, res) => {
    try {
        const admin = await adminModel.findById(req.adminId).select("-password")
        if(!admin) {
            return res.status(404).json({
                message : "Admin not found"
            })
        }
        return res.status(200).json({
            admin
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message
        })
    }
})

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/courses"
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true })
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        cb(null, unique + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowed = [".jpg", ".jpeg", ".png", ".webp"]
        const ext = path.extname(file.originalname).toLowerCase()
        if (allowed.includes(ext)) cb(null, true)
        else cb(new Error("Only image files are allowed"))
    }
})

adminRouter.post("/course/create", adminMiddleware, imageUpload.single("imageFile"), async (req, res) => {
    try {
        const { title, description, price, imageUrl, imageType } = req.body

        if (!title || !description || !price) {
            return res.status(400).json({ message: "Title, description and price are required" })
        }

        let finalImageUrl = ""

        if (imageType === "file" && req.file) {
            const normalized = req.file.path.replace(/\\/g, "/")
            finalImageUrl = `${process.env.BASE_URL || "http://localhost:3000"}/${normalized}`
        } else if (imageType === "url" && imageUrl) {
            finalImageUrl = imageUrl
        } else {
            return res.status(400).json({ message: "Please provide an image" })
        }

        const course = await courseModel.create({
            title,
            description,
            price,
            imageUrl: finalImageUrl,
            creatorId: req.adminId
        })

        return res.status(201).json({
            message: "Course created successfully",
            courseId: course._id
        })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

adminRouter.get("/stats", adminMiddleware, async (req, res) => {
    try {
        const courses = await courseModel.find({ creatorId: req.adminId })
        const courseIds = courses.map(c => c._id)

        const purchases = await purchaseModel.find({ courseId: { $in: courseIds } })
        const uniqueStudents = new Set(purchases.map(p => p.userId.toString())).size

        const courseMap = {}
        courses.forEach(c => { courseMap[c._id.toString()] = c.price })
        const revenue = purchases.reduce((sum, p) => {
            return sum + (courseMap[p.courseId.toString()] || 0)
        }, 0)

        return res.status(200).json({ students: uniqueStudents, revenue })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/lessons"
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true })
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        cb(null, unique + path.extname(file.originalname))
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
    fileFilter: (req, file, cb) => {
        const allowed = [".mp4", ".webm", ".mkv", ".mov"]
        const ext = path.extname(file.originalname).toLowerCase()
        if (allowed.includes(ext)) cb(null, true)
        else cb(new Error("Only video files are allowed"))
    }
})

adminRouter.post("/course/:courseId/lesson", adminMiddleware, upload.single("videoFile"), async (req, res) => {
    try {
        const { title, videoUrl, videoType, order } = req.body

        if (!title) return res.status(400).json({ 
            message: "Lesson title is required" 
        })

        if (videoType === "url" && !videoUrl) {
            return res.status(400).json({ 
                message: "Video URL is required"
            })
        }

        if (videoType === "file" && !req.file) {
            return res.status(400).json({ 
                message: "Video file is required" 
            })
        }

        const lesson = await lessonModel.create({
            courseId: req.params.courseId,
            title,
            videoUrl: videoType === "url" ? videoUrl : null,
            videoFile: videoType === "file" ? req.file.path : null,
            videoType: videoType || "url",
            order
        })

        return res.status(201).json({ 
            lesson 
        })

    } catch (error) {
        return res.status(500).json({ 
            message: error.message 
        })
    }
})

adminRouter.put("/course/update", adminMiddleware, imageUpload.single("imageFile"), async (req, res) => {
    try {
        const { courseId, title, description, price, imageUrl, imageType } = req.body

        if (!title || !description || !price) {
            return res.status(400).json({ message: "Title, description and price are required" })
        }

        let finalImageUrl = imageUrl  // default — keep existing url

        if (imageType === "file" && req.file) {
            const normalized = req.file.path.replace(/\\/g, "/")
            finalImageUrl = `${process.env.BASE_URL || "http://localhost:3000"}/${normalized}`
        }

        const updatedCourse = await courseModel.findByIdAndUpdate(
            { _id: courseId, creatorId: req.adminId },
            { title, description, price, imageUrl: finalImageUrl },
            { new: true }
        )

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" })
        }

        return res.status(200).json({
            message: "Course updated successfully",
            updatedCourse
        })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
    try {
        const courses = await courseModel.find({
            creatorId: req.adminId
        });

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

adminRouter.get("/course/:courseId/lessons", adminMiddleware, async (req, res) => {
    try {
        const lessons = await lessonModel
            .find({ courseId: req.params.courseId })
            .sort({ order: 1 })

        return res.status(200).json({ lessons })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

adminRouter.delete("/course/delete/:courseId", adminMiddleware, async (req, res) => {
    const courseId = req.params.courseId;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
            message: "Invalid course Id"
        });
    }

    try {
        const deletedCourse = await courseModel.findOneAndDelete({
            _id: courseId,
            creatorId: req.adminId
        });

        if (!deletedCourse) {
            return res.status(404).json({
                message: "Course not found or unauthorized"
            });
        }

        await lessonModel.deleteMany({ courseId });

        await reviewModel.deleteMany({ courseId });

        return res.status(200).json({
            message: "Course deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error deleting course",
            error: error.message
        });
    }
});

adminRouter.delete("/course/:courseId/lesson/:lessonId", adminMiddleware, async (req, res) => {
    try {
        const lesson = await lessonModel.findOneAndDelete({
            _id: req.params.lessonId,
            courseId: req.params.courseId
        })

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" })
        }

        if (lesson.videoType === "file" && lesson.videoFile) {
            const fs = require("fs")
            const normalizedPath = lesson.videoFile.replace(/\\/g, "/")
            if (fs.existsSync(normalizedPath)) {
                fs.unlinkSync(normalizedPath)
            }
        }

        return res.status(200).json({ message: "Lesson deleted successfully" })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

adminRouter.delete("/delete-account", adminMiddleware, async (req, res) => {
    try {
        await adminModel.findByIdAndDelete(req.adminId)
        return res.status(200).json({ message: "Account deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
});

module.exports = {
    adminRouter
};