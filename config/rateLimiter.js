import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 1 * 60 * 60, //15 min
    limit: 1,
    standardHeaders: 'draft-7',
    legacyHeaders: false
})