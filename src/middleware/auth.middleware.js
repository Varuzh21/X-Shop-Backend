import prisma from '../prisma.js';
import jwt from "jsonwebtoken";


export const protectRoute = async (req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET environment variable is not defined.");
        }

        const token = req.cookies?.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized - Token Expired" });
            }
            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({ message: "Unauthorized - Invalid Token" });
            }
            throw err;
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};