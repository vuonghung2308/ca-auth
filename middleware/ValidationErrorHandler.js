import { validationResult } from "express-validator";
import { BAD_REQUEST } from "../constants/HttpStatus.js";

export function handleValidationError(req, _, next) {
    const error = validationResult(req)
    if (error && !error.isEmpty()) {
        return next({
            status: BAD_REQUEST,
            errors: error.array(),
            code: "INVALID_DATA"
        })
    }
    return next();
}