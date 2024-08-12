import express from "express";
import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import ProfileController from "../controllers/ProfileController.js";

const router = express.Router();

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);


router.get("/profile", authMiddleware, ProfileController.index)
router.put("/profile/:id", authMiddleware, ProfileController.update)

export default router;