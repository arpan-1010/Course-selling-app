const { Router } = require("express");

const reviewRouter = Router();

const { reviewModel, purchaseModel } = require("../db");

const { authMiddleware } = require("../middlewares/authMiddleware");

const { adminMiddleware } = require("../middlewares/adminMiddleware")

reviewRouter.post("/add", authMiddleware, async (req, res) => {
    const {courseId, rating, comment} = req.body;

    try {
        const purchase = await purchaseModel.findOne({
            userId : req.userId,
            courseId
        })
        if(!purchase) {
            return res.status(403).json({
                message : "Purchase course before reviewing"
            })
        }

        const existingReview = await reviewModel.findOne({
            userId: req.userId,
            courseId
        })
        if (existingReview) {
            return res.status(409).json({
                message: "You have already reviewed this course"
            })
        }

        const review = await reviewModel.create({
            userId : req.userId,
            courseId,
            rating,
            comment
        })
        return res.status(201).json({
            message : "Review added",
            review
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message
        })
    }
})

reviewRouter.get("/all", async (req, res) => {
    try {
        const reviews = await reviewModel
            .find({})
            .populate("userId", "firstName lastName")
            .populate("courseId", "title")
            .sort({ createdAt: -1 })
            .limit(20)

        return res.status(200).json({ 
            reviews 
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message 
        })
    }
});

reviewRouter.get("/:courseId", async (req, res) => {
        try {

            const reviews = await reviewModel.find({
                        courseId : req.params.courseId
                    }).populate(
                        "userId",
                        "firstName lastName"
                    );

            return res.status(200).json({
                reviews
            });

        } catch (error) {

            return res.status(500).json({
                message: error.message
            });

        }
    }
);

reviewRouter.delete("/:reviewId", adminMiddleware, async (req, res) => {
    try {
        const review = await reviewModel.findByIdAndDelete(req.params.reviewId)

        if (!review) {
            return res.status(404).json({ 
                message: "Review not found" 
            })
        }

        return res.status(200).json({ 
            message: "Review deleted successfully" 
        })

    } catch (error) {
        return res.status(500).json({ 
            message: error.message 
        })
    }
})

module.exports = {
    reviewRouter : reviewRouter
}