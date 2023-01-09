import { error } from "../utils/result.js";

export function verifySystemAdmin(req, _, next) {
    const { role } = req.payload;
    if (role.includes("SA")) {
        return next()
    } else {
        return next(error.actionNotAllowed());
    }
}

export function verifyTenantUser(req, _, next) {
    const { role } = req.payload;
    const isTenantUser = ["TA", "L1", "L2", "EU"].some(
        value => role.includes(value)
    )
    if (isTenantUser) {
        return next()
    } else {
        return next(error.actionNotAllowed());
    }
}

export function verifyRole(...roles) {
    if (roles.includes("*")) {
        roles.push("SA", "TA", "EU", "L*");
    }

    if (roles.includes("L*")) {
        roles.push("L1", "L2");
    }

    return (req, _, next) => {
        const { role } = req.payload;
        const isRoleOke = roles.some(
            r => role.includes(r))
        if (isRoleOke) return next();
        return next(error.actionNotAllowed());
    }
}