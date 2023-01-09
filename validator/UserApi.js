import { body, query } from "express-validator";
import { handleValidationError } from "../middleware/ValidationErrorHandler.js";

export const createUserValidator = () => [
    body("email", "email must be string and not empty").isString().bail().notEmpty(),
    body("fullName", "fullName must be string and not empty").isString().bail().notEmpty(),
    body("password", "password must be string and not empty").isString().bail().notEmpty(),
    body("phone", "phone must be string and not empty").isString().bail().notEmpty(),
    body("role", "role must be in ['SA', 'TA', 'EU', 'L1', 'L2']")
        .isIn(["SA", "TA", "EU", "L1", "L2"]),
    body("tenant").customSanitizer((value, { req }) => {
        if (!req.payload.role.includes("SA")) {
            return req.payload.tenant;
        } else return value;
    }),
    // check tenant if user creating is not SA
    body("tenant", "tenant must be string and not empty").custom((tenant, { req }) => {
        return !(!tenant && req.body.role !== "SA")
    }),
    handleValidationError
]

export const findUserValidator = () => [
    query("size").replace([null, undefined], 10),
    query("page").replace([null, undefined], 0),
    query("orderBy").replace([null, undefined], "created_time"),
    query("orderType").replace([null, undefined], "asc"),

    query("email").replace([null, undefined], ""),
    query("phone").replace([null, undefined], ""),
    query("group").replace([null, undefined], ""),

    query("size", "size must be integer and in [1:50]").isInt({ min: 1, max: 50 }),
    query("page", "page must be integer and greater than -1").isInt({ min: 0 }),
    query("orderType", "value orderType must be asc or desc").isIn(["asc", "desc"]),
    query("orderType").replace(["asc"], 1), query("orderType").replace(["desc"], -1),

    query("orderBy", "orderBy must be in ['fullname', 'created_time']")
        .isIn(["fullname", "created_time"]),
    query("type", "type must be in ['TA','EU','L*', 'L1', 'L2']").
        isIn(["TA", "EU", "L*", "L1", "L2"]),
    handleValidationError
]

export const findUserByIdsValidator = () => [
    body("ids", "ids must be array of string").notEmpty().bail().isArray()
        .bail().custom((id) => !id.some(v => typeof v !== "string")),
    handleValidationError
]

export const updateActivationValidator = () => [
    query("tenant", "tenant must be string and not empty").isString().bail().notEmpty(),
    body("is_active", "is_active must boolean").exists().bail().isBoolean(),
    handleValidationError
]