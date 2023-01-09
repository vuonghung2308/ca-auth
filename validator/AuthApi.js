import { body } from "express-validator";
import { handleValidationError } from "../middleware/ValidationErrorHandler.js";

export const refreshTokenValidator = () => [
    body("refreshToken", "refresh token must not be empty")
        .exists().bail().notEmpty(),
    handleValidationError
]