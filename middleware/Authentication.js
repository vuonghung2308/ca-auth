import jsonwebtoken from 'jsonwebtoken';
import { UNAUTHORIZED } from "../constants/HttpStatus.js";
import { publicKey } from '../keys/ConfigKey.js';

export function verifyToken(req, _, next) {
    let option = { algorithm: "RS256" };
    let { token } = req.headers;
    const errors = [{
        param: "token",
        location: "header"
    }];
    if (!token) {
        return next({
            status: UNAUTHORIZED,
            code: "NO_TOKEN",
            errors: errors
        });
    }
    try {
        let payload = jsonwebtoken.verify(token, publicKey, option);
        req.payload = payload;
        if (payload.type !== "ACCESS_TOKEN") {
            return next({
                status: UNAUTHORIZED,
                code: "INVALID_TOKEN",
                errors: errors
            });
        }
        return next();
    } catch (e) {
        if (e.name && e.name === "TokenExpiredError") {
            return next({
                status: UNAUTHORIZED,
                code: "TOKEN_EXPIRED",
                errors: errors
            });
        } else {
            return next({
                status: UNAUTHORIZED,
                code: "INVALID_TOKEN",
                errors: errors
            });
        }
    }
}