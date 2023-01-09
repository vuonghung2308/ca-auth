import { OK, UNAUTHORIZED } from "../constants/HttpStatus.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import { genRefreshToken, genAccessToken, getPayload }
    from "../token/VerifyToken.js";

export async function login(email, password) {
    const loginError = {
        status: UNAUTHORIZED,
        code: "WRONG_EMAIL_OR_PASSWORD",
        errors: [{
            location: "body",
            param: "email|password"
        }]
    };
    const user = await User.findOne(
        { email: email, is_active: true },
        { _id: 0, created_time: 0, is_active: 0 }
    ).lean()
    if (user) {
        let isPasswordOke = bcrypt.compareSync(password, user.password);
        if (isPasswordOke) {
            const { id, role, tenant, permissions, fullname, email } = user;
            const accessToken = genAccessToken({
                id, role, permissions,
                fullname, email, tenant,
            });
            const refreshToken = genRefreshToken({ id });
            const data = {
                ...user,
                accessToken,
                refreshToken,
            };
            delete data.password;
            return { status: OK, data };
        } else { return loginError; }
    } else { return loginError; }
}

export async function generateNewToken(refreshToken) {
    const payload = getPayload(refreshToken)
    const errors = [{
        param: "token",
        location: "header"
    }];
    if (!payload || !payload.id) {
        return {
            status: UNAUTHORIZED,
            code: "INVALID_TOKEN",
            errors: errors
        };
    }
    if (payload instanceof Error) {
        const err = payload;
        if (err.name && err.name ===
            "TokenExpiredError"
        ) {
            return {
                status: UNAUTHORIZED,
                code: "TOKEN_EXPIRED",
                errors: errors
            };
        } else {
            return {
                status: UNAUTHORIZED,
                code: "INVALID_TOKEN",
                errors: errors
            };
        }
    }
    const user = await User.findOne(
        { id: payload.id, is_active: true },
        { _id: 0, is_active: 0, password: 0 }
    ).lean();
    if (user) {
        const { id, role, tenant, permissions, fullname, email } = user;
        const accessToken = genAccessToken({
            id, role, permissions,
            fullname, email, tenant,
        });
        const refreshToken = genRefreshToken({ id });
        const data = {
            ...user,
            accessToken,
            refreshToken,
        };
        return { status: OK, data };
    }
}