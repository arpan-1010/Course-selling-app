require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const { reviewRouter } = require("./routes/review");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/uploads", express.static("uploads"))

async function main() {
    await mongoose.connect(process.env.DATABASE_URL)
    app.listen(3000);
    console.log("Listening on port 3000");
}

main().catch((err) => {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
});