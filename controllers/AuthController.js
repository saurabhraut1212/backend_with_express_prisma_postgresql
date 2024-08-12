import vine, { errors } from "@vinejs/vine";
import prisma from "../DB/db.config.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { loginSchema, registrationSchema } from "../validations/authValidation.js";

class AuthController {
    static async register(req, res) {
        try {
            const body = req.body;
            const validator = vine.compile(registrationSchema);
            const payload = await validator.validate(body);

            const existingUser = await prisma.users.findUnique({
                where: {
                    email: payload.email
                }
            })

            if (existingUser) {
                return res.status(400).json({ message: "Email already exists" })
            }
            const salt = bcrypt.genSaltSync(10);
            payload.password = bcrypt.hashSync(payload.password, salt);

            const user = await prisma.users.create({
                data: payload
            })
            return res.json({ status: 200, message: "User created successfully", user })
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.messages)
                return res.status(400).json({ errors: error.message })
            }
        }
    }

    static async login(req, res) {
        try {
            const body = req.body;
            const validator = vine.compile(loginSchema);
            const payload = await validator.validate(body);

            const findUser = await prisma.users.findUnique({
                where: {
                    email: payload.email
                }
            })

            if (findUser) {
                if (!bcrypt.compareSync(payload.password, findUser.password)) {
                    return res.status(400).json({ message: "Invalid credentials" })
                }

                const payloadData = {
                    id: findUser.id,
                    name: findUser.email,
                    email: findUser.email,
                    profile: findUser.profile
                }

                const token = jwt.sign(payloadData, process.env.JWT_SECRET, {
                    expiresIn: "365d"
                })
                return res.status(200).json({ message: "Logged in", access_token: `Bearer ${token}` })
            }
            return res.status(400).json({ message: "User not found" })
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.messages)
                return res.status(400).json({ errors: error.message })
            }
        }
    }
}

export default AuthController;