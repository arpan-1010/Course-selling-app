const jwt = require("jsonwebtoken");
const { adminModel } = require("../db");

async function adminMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message : "Token missing"
            });
        }

        const token = authHeader.split(" ")[1];

        //console.log("Authorization:", req.headers.authorization);

        const decoded = jwt.verify(
            token,
            process.env.JWT_ADMIN_SECRET
        );

        const admin = await adminModel.findById(decoded.adminId);

        if(!admin) {
            return res.status(403).json({
                message : "Access denied"
            });
        }

        req.adminId = admin._id;
        next();

    } catch (error) {
        return res.status(401).json({
            message : error.message
        });
    }
}

module.exports = { adminMiddleware };