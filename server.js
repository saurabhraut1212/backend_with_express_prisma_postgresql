import express from "express";
import dotenv from "dotenv";
import ApiRoutes from "./routes/api.js"
import fileUpload from "express-fileupload"

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
    return res.send("Server started")
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload());
app.use(express.static("public"))

//
app.use('/api', ApiRoutes);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})