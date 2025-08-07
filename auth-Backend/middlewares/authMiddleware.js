// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    console.log("Backend: Received Authorization Header:", authHeader); 

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        console.log("Backend: Extracted Token:", token); 

        if (!token) {
            console.log("Backend: Token is empty after split."); 
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Backend: Decoded JWT Payload:", decode); 

            if (!decode.user || !decode.user.id || !decode.user.role) {
                console.log("Backend: Invalid token payload - missing user details."); 
                return res.status(400).json({ message: "Invalid token payload: missing user details" });
            }

            req.user = { id: decode.user.id, role: decode.user.role };
            console.log("Backend: Authenticated user details:", req.user); 
            next();
        } catch (err) {
            console.error("Backend: JWT verification failed:", err); 
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token expired, please log in again" });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: "Token is not valid or malformed" });
            }
            res.status(500).json({ message: "Authentication failed" });
        }
    } else {
        console.log("Backend: No Bearer token or Authorization header missing."); 
        return res.status(401).json({ message: "No Bearer token provided in Authorization header" });
    }
};

module.exports = verifyToken;