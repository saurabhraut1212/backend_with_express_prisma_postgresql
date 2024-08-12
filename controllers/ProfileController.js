import { generateRandomNumber, imageValidator } from "../utils/helper.js";
import prisma from "../DB/db.config.js";

class ProfileController {
    static async index(req, res) {
        try {
            const user = req.user;
            return res.status(200).json({ user })
        } catch (error) {
            return res.status(500).json({ message: "Something went wrong" })
        }

    }

    static async store(req, res) {
        try {

        } catch (error) {

        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ message: "Profile image is required" });
            }

            const profile = req.files.profile;
            const message = imageValidator(profile?.size, profile.mimetype);
            console.log("size", profile?.size);
            console.log("mime", profile?.mimetype);
            console.log("validation message", message);

            if (message !== null) {
                return res.status(400).json({ message });
            }

            const imgExt = profile?.name.split(".").pop();
            const imageName = generateRandomNumber() + "." + imgExt;
            const uploadPath = process.cwd() + "/public/images/" + imageName;

            // Attempt to move the file
            profile.mv(uploadPath, (err) => {
                if (err) {
                    console.error("File upload error:", err);
                    return res.status(500).json({ message: "Image upload failed" });
                } else {
                    console.log("Image successfully uploaded to", uploadPath);
                }
            });

            // Attempt to update the database
            await prisma.users.update({
                data: {
                    profile: imageName
                },
                where: {
                    id: Number(id)
                }
            })
                .then(() => {
                    console.log("Database updated successfully");
                })
                .catch((error) => {
                    console.error("Database update error:", error);
                    return res.status(500).json({ message: "Failed to update profile image in database" });
                });

            return res.status(200).json({
                message: "Profile updated successfully"
            });
        } catch (error) {
            console.error("General error:", error);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

}

export default ProfileController;