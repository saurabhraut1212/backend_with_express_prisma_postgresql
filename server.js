import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
    return res.send("Server started")
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})