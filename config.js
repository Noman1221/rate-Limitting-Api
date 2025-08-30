// fetch user token 
import jwt from "jsonwebtoken";
export const isAuth = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ message: "No token provided" })
        };


        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Invalid token" });
            req.user = decoded;
            next();
        })

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}