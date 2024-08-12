import express from "express";
import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import ProfileController from "../controllers/ProfileController.js";
import NewsController from "../controllers/NewsController.js";

const router = express.Router();

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);


router.get("/profile", authMiddleware, ProfileController.index)
router.put("/profile/:id", authMiddleware, ProfileController.update)


//newsroutes

router.get("/news", NewsController.index);
router.post("/news", authMiddleware, NewsController.store);
router.get("/news/:id", NewsController.show);
router.put("/news/:id", NewsController.update);
router.delete("/news/:id", NewsController.destroy);


export default router;