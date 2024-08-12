import express from "express";
import dotenv from "dotenv";
import ApiRoutes from "./routes/api.js"
import fileUpload from "express-fileupload";
import helmet from "helmet";
import cors from "cors";
import { limiter } from "./config/rateLimiter.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
    return res.send("Server started")
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload());
app.use(express.static("public"));
app.use(helmet());
app.use(cors());
app.use(limiter)

//
app.use('/api', ApiRoutes);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})