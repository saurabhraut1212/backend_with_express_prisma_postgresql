import vine from "@vinejs/vine";

export const registrationSchema = vine.object({
    name: vine.string().minLength(2).maxLength(150),
    email: vine.string().email(),
    password: vine.string().minLength(6).maxLength(100).confirmed()
})

export const loginSchema = vine.object({
    email: vine.string().email(),
    password: vine.string()
})