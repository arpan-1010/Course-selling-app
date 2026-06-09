const { Router } = require("express");
const courseRouter = Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const { courseModel, purchaseModel, lessonModel } = require("../db");

courseRouter.post("/purchase", authMiddleware, async (req, res) => {
    const courseId = req.body.courseId;

    try {
        const course = await courseModel.findById(courseId);

        if(!course) {
            return res.status(404).json({
                message : "Course not found"
            });
        }

        const existingPurchase = await purchaseModel.findOne({
            userId : req.userId,
            courseId
        });

        if(existingPurchase) {
            return res.status(409).json({
                message : "Course already purchased"
            });
        }

        await purchaseModel.create({
            userId : req.userId,
            courseId : courseId
        });

        return res.status(201).json({
            message : "Course purchased successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message : "Error purchasing course",
            error : error.message
        });
    }
});

courseRouter.get("/preview", async (req, res) => {
    try {
        const courses = await courseModel.find({});

        return res.status(200).json({
            courses
        });

    } catch (error) {
        return res.status(500).json({
            message : "Error fetching courses",
            error : error.message
        });
    }
});

courseRouter.get("/my-courses", authMiddleware, async (req, res) => {
        try {

            //console.log("userId =", req.userId);

            const purchases = await purchaseModel.find({
                userId: req.userId
            });

            console.log("purchases =", purchases);

            const courseIds = purchases.map(
                purchase => purchase.courseId
            );

            //console.log("courseIds =", courseIds);

            const courses = await courseModel.find({
                _id: { $in: courseIds }
            });

            console.log("courses =", courses);

            return res.json({ courses });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                message: error.message
            });
        }
    }
);

courseRouter.get("/check-purchase/:courseId", authMiddleware, async (req, res) => {
    try {
        const purchase = await purchaseModel.findOne({
            userId: req.userId,
            courseId: req.params.courseId
        })
        return res.status(200).json({ 
            purchased: !!purchase 
        })
    } catch (error) {
        return res.status(500).json({ 
            message: error.message 
        })
    }
});

courseRouter.get("/:courseId/demo-lesson", async (req, res) => {
    try {
        const lessons = await lessonModel.find({ 
            courseId: req.params.courseId 
        }).sort({ 
            order: 1 
        }).limit(1)

        if (lessons.length === 0) {
            return res.status(404).json({ 
                message: "No lessons found" 
            })
        }

        return res.status(200).json({ 
            lesson: lessons[0] 
        })

    } catch (error) {
        return res.status(500).json({ 
            message: error.message 
        })
    }
})

courseRouter.get("/:courseId/lesson-count", async (req, res) => {
    try {
        const count = await lessonModel.countDocuments({ 
            courseId: req.params.courseId 
        })
        return res.status(200).json({ count })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

courseRouter.get("/:courseId/lessons", authMiddleware, async (req, res) => {
        try {

            const purchase =
                await purchaseModel.findOne({
                    userId: req.userId,
                    courseId: req.params.courseId
                });

            if (!purchase) {
                return res.status(403).json({
                    message:
                        "Purchase course first"
                });
            }

            const lessons = await lessonModel.find({
                    courseId : req.params.courseId
                }).sort({ order: 1 });

            return res.status(200).json({
                lessons
            });

        } catch (error) {

            return res.status(500).json({
                message: error.message
            });

        }
    }
);

module.exports = {
    courseRouter : courseRouter
}