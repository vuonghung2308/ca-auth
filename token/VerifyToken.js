import jsonwebtoken from 'jsonwebtoken';
import { privateKey, publicKey } from '../keys/ConfigKey.js';

export function genAccessToken(payload) {
    let signOptions = {
        expiresIn: "1h",
        algorithm: "RS256"
    }
    payload = { ...payload, type: "ACCESS_TOKEN" };
    let accessToken = jsonwebtoken.sign(payload, privateKey, signOptions);
    return accessToken;
}

export function genRefreshToken(payload) {
    let signOptions = {
        expiresIn: "24h",
        algorithm: "RS256"
    }
    payload = { ...payload, type: "REFRESH_TOKEN" };
    let refreshToken = jsonwebtoken.sign(payload, privateKey, signOptions);
    return refreshToken;
}

export function getPayload(token) {
    const verifyOptions = { algorithm: "RS256" }
    try {
        const payload = jsonwebtoken.verify(
            token, publicKey, verifyOptions
        );
        return payload;
    } catch (error) {
        return error;
    }
}

export function genNewToken(refreshToken) {
    const verifyOptions = { algorithm: "RS256" }
    try {
        const payload = jsonwebtoken.verify(
            refreshToken,
            publicKey,
            verifyOptions
        );
        if (payload.type !== "REFRESH_TOKEN") {
            return null;
        } else {
            ["iat", "exp"].forEach(k => delete payload[k]);
            const refreshToken = genRefreshToken(payload);
            const accessToken = genAccessToken(payload);
            return { refreshToken, accessToken }
        }
    } catch (e) {
        return e;
    }
}
