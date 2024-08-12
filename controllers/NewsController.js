import vine from "@vinejs/vine";
import { newsSchema } from "../validations/newsValidation.js";
import { generateRandomNumber, imageValidator } from "../utils/helper.js";
import prisma from "../DB/db.config.js";
import NewsApiTransform from "../transform/newsApiTransform.js";

class NewsController {
    static async index(req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 1;

        if (page <= 0) {
            page = 1;
        }

        if (limit <= 0 || limit > 100) {
            limit = 10
        }

        const skip = (page - 1) * limit;

        try {
            const news = await prisma.news.findMany({
                take: limit,
                skip: skip,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profile: true
                        }
                    }
                }
            });
            const newsTransform = news?.map((item) => NewsApiTransform.transform(item))
            const totalNews = await prisma.news.count();
            const totalPages = Math.ceil(totalNews / limit);

            return res.status(200).json({
                news: newsTransform, metadata: {
                    totalPages,
                    currentPage: page,
                    currentLimit: limit
                }
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" })
        }

    }
    static async store(req, res) {
        try {
            const user = req.user;
            const body = req.body;

            const validator = vine.compile(newsSchema);
            const payload = await validator.validate(body);

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ message: "Image field is required" });
            }

            const image = req.files.image;
            const message = imageValidator(image?.size, image?.mimetype);
            if (message !== null) {
                return res.status(400).json({ message });
            }

            const imgExt = image.name.split(".").pop();
            const imageName = generateRandomNumber() + "." + imgExt;
            const uploadPath = process.cwd() + "/public/images/" + imageName;

            // Move the file and update the payload only after a successful upload
            image.mv(uploadPath, async (err) => {
                if (err) {
                    console.error("File upload error:", err);
                    return res.status(500).json({ message: "Image upload failed" });
                }

                console.log("Image successfully uploaded to", uploadPath);

                // Update the payload with the image name and user ID
                payload.image = imageName;
                payload.user_id = user.id;

                try {
                    const newNews = await prisma.news.create({
                        data: payload
                    });

                    console.log(newNews, "this is newnews");
                    return res.status(201).json({ message: "News created successfully", newNews });
                } catch (dbError) {
                    console.error("Database error:", dbError);
                    return res.status(500).json({ message: "Failed to create news" });
                }
            });

        } catch (error) {
            console.error("Internal server error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async show(req, res) {

    }
    static async update(req, res) {

    }
    static async destroy(req, res) {

    }
}

export default NewsController