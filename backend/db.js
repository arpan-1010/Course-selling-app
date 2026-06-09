const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
    {
        email : {
            type : String,
            unique : true,
            required : true
        },
        password : {
            type : String,
            minLength : 6,
            required : true
        },
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true
    }
);

const adminSchema = new mongoose.Schema(
    {
        email : {
            type : String,
            unique : true,
            required : true
        },
        password : {
            type : String,
            minLength : 6,
            required : true
        },
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true
    }
);

const courseSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        price : {
            type : Number,
            required : true,
            min : 0
        },
        imageUrl : {
            type : String,
            required : true
        },
        creatorId : {
            type : ObjectId,
            ref : "admin",
            required : true
        }
    },
    {
        timestamps : true
    }
);

const purchaseSchema = new mongoose.Schema(
    {
        userId : {
            type : ObjectId,
            ref : "user",
            required : true
        },
        courseId : {
            type : ObjectId,
            ref : "course",
            required : true
        }
    },
    {
        timestamps : true
    }
);

const reviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "course",
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        comment: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const lessonSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "course",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        videoUrl: {
            type: String,
            required: false
        },

        videoFile: {
            type: String,
            required: false
        },

        videoType: {
            type: String,
            enum: ["url", "file"],
            default: "url"
        },

        order: {
            type: Number,
            required: false
        }
    },
    {
        timestamps: true
    }
);


const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);
const reviewModel = mongoose.model("reviews", reviewSchema);
const lessonModel = mongoose.model("lesson", lessonSchema);

module.exports = { 
    userModel,
    adminModel,
    courseModel,
    purchaseModel,
    reviewModel,
    lessonModel
}