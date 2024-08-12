import { supportMimes } from "../config/fileSystem.js";
import { v4 as uuidv4 } from "uuid";

export const imageValidator = (size, mime) => {
    if (byteToMb(size) > 2) {
        return "Image size must be less than 2 mb"
    }
    else if (!supportMimes.includes(mime)) {
        return "Image must be type of jpg,jpeg,png,svg,webp,gif"
    }
    return null;
}

export const byteToMb = (bytes) => {
    return bytes / (1024 * 1024);
}

export const generateRandomNumber = () => {
    return uuidv4()
}   