import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader === null || authHeader === undefined) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(401).json({ message: "Unauthorized" });

            req.user = user;
            next();
        })
    } catch (error) {
        console.error(error)
    }
}

export default authMiddleware;