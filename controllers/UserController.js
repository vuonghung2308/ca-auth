import { BAD_REQUEST, INTERNAL_SERVER, NOT_FOUND } from "../constants/HttpStatus.js";
import { getTenantByCode } from "../services/TenantService.js";
import User from "../models/User.js"
import bcrypt from 'bcrypt';
import { v1 } from "uuid";
import { findUserWithKey } from "../services/GroupService.js";
import { error, success } from "../utils/result.js";

const databaseError = () => {
    return {
        status: INTERNAL_SERVER,
        code: "DATABASE_SERVER_ERROR",
    }
}

async function checkTenantByCode(tenant) {
    const response = await getTenantByCode(tenant)
    if (response.status === INTERNAL_SERVER) {
        return error.service(response.path);
    }
    if (response.status === NOT_FOUND ||
        response.data.code === "NOT_FOUND"
    ) {
        return error.invalidData({
            param: "tenant", value: tenant,
            msg: `the tenant ${tenant} does not exist`
        });
    }
    return null;
}

export async function createUser(
    email, fullname, password, phone, tenant, userRoles, role
) {
    if (!userRoles.includes("SA") && role === "SA") {
        return error.actionNotAllowed()
    }
    if (userRoles.includes("SA")) {
        const status = await checkTenantByCode(tenant);
        if (status) return status;
    }
    let result = await checkEmailExists(email);
    if (result) return result;

    const hashedPassword = await bcrypt.hash(
        password, await bcrypt.genSalt(10)
    );
    let model = new User({
        id: v1(), fullname: fullname,
        email: email, phone: phone,
        role: [role], tenant: tenant,
        password: hashedPassword,
        create_time: new Date(),
    });
    await model.save();
    const data = model.toJSON();
    ["password", "_id", "is_active"]
        .forEach(k => delete data[k]);
    return success.created(data);
}

export async function findTenantAdmin(
    email, phone, page, size,
    orderBy, orderType, role
) {
    if (!role.includes("SA")) return error.actionNotAllowed()
    const sort = { [orderBy]: orderType * 1 };
    const match = {
        role: "TA",
        phone: { $regex: phone, $options: 'i' },
        email: { $regex: email, $options: 'i' }
    }
    const group = {
        _id: "$_id", id: { $first: "$id" },
        fullname: { $first: "$fullname" },
        email: { $first: "$email" },
        phone: { $first: "$phone" },
        tenant: { $first: "$tenant" },
        created_time: { $first: "$created_time" },
        is_active: { $first: "$is_active" },
        role: { $push: "$role" },
        permissions: { $first: "$permissions" },
    };
    const facet = {
        meta: [{ $count: "total" }],
        data: [{ $skip: size * page }, { $limit: size * 1 }]
    }
    let result = await User.aggregate([
        { $unwind: "$role" },
        { $match: match },
        { $group: group },
        { $sort: sort },
        { $project: { _id: 0 } },
        { $facet: facet },
    ]).then(res => res[0]).then(res => {
        const total = !res.meta.length > 0 ?
            0 : res.meta[0].total;
        return {
            page: Number(page), total: total,
            total_page: Math.ceil(total / size),
            data: res.data
        }
    })
    return success.ok(result);
}

export async function findEndUser(
    email, phone, page, size,
    orderBy, orderType, payload
) {
    if (!payload.role.includes("TA"))
        return error.actionNotAllowed()
    const sort = { [orderBy]: orderType * 1 };
    const match = {
        role: "EU", tenant: payload.tenant,
        phone: { $regex: phone, $options: 'i' },
        email: { $regex: email, $options: 'i' }
    }
    const group = {
        _id: "$_id", id: { $first: "$id" },
        fullname: { $first: "$fullname" },
        email: { $first: "$email" },
        phone: { $first: "$phone" },
        tenant: { $first: "$tenant" },
        created_time: { $first: "$created_time" },
        is_active: { $first: "$is_active" },
        role: { $push: "$role" },
        permissions: { $first: "$permissions" },
    };
    const facet = {
        meta: [{ $count: "total" }],
        data: [{ $skip: size * page }, { $limit: size * 1 }]
    }
    let result = await User.aggregate([
        { $unwind: "$role" },
        { $match: match },
        { $group: group },
        { $sort: sort },
        { $project: { _id: 0 } },
        { $facet: facet },
    ]).then(res => res[0]).then(res => {
        const total = !res.meta.length > 0 ?
            0 : res.meta[0].total;
        return {
            page: Number(page), total: total,
            total_page: Math.ceil(total / size),
            data: res.data
        }
    })
    return success.ok(result);
}

export async function findTechnician(
    type, email, phone, groupKey, page,
    size, orderBy, orderType, payload
) {
    if (!payload.role.includes("TA"))
        return error.actionNotAllowed()
    const response = await findUserWithKey(payload.tenant, groupKey);
    if (response.status === INTERNAL_SERVER) {
        return error.service(response.path);
    }
    const usersWithGroups = response.data;
    const userIds = usersWithGroups.map(u => u.userId);
    const sort = { [orderBy]: orderType * 1 };
    let roleMatch = [
        { role: "L1" },
        { role: "L2" }
    ]
    if (type === "L1") {
        roleMatch = [{ role: "L1" }]
    }
    if (type === "L2") {
        roleMatch = [{ role: "L2" }]
    }
    const match = {
        $or: roleMatch, tenant: payload.tenant,
        phone: { $regex: phone, $options: 'i' },
        email: { $regex: email, $options: 'i' },
        id: { $in: userIds }
    }
    const group = {
        _id: "$_id", id: { $first: "$id" },
        fullname: { $first: "$fullname" },
        email: { $first: "$email" },
        phone: { $first: "$phone" },
        tenant: { $first: "$tenant" },
        created_time: { $first: "$created_time" },
        is_active: { $first: "$is_active" },
        role: { $push: "$role" },
        permissions: { $first: "$permissions" },
    };
    const facet = {
        meta: [{ $count: "total" }],
        data: [{ $skip: size * page }, { $limit: size * 1 }]
    }
    let result = await User.aggregate([
        { $unwind: "$role" },
        { $match: match },
        { $group: group },
        { $sort: sort },
        { $project: { _id: 0 } },
        { $facet: facet },
    ]).then(res => res[0]).then(res => {
        const total = !res.meta.length > 0 ?
            0 : res.meta[0].total;
        return {
            page: Number(page), total: total,
            total_page: Math.ceil(total / size),
            data: res.data
        }
    })
    for (let i = 0; i < result.data.length; i++) {
        const userAtPositionI = result.data[i];
        const user = usersWithGroups.find(
            u => u.userId === userAtPositionI.id)
        result.data[i] = {
            ...userAtPositionI,
            groups: user.groups
        }
    }
    return success.ok(result);
}

export async function getUserById(
    id, tenantCode, userId, userRoles
) {
    const match = { id: id };
    if (!userRoles.includes("SA")) {
        match["tenant"] = tenantCode;
        if (!userRoles.includes("TA")
            && id !== userId
        ) { return error.actionNotAllowed(); }
    }
    const user = await User.findOne(
        match, { _id: 0, password: 0 }
    ).lean();
    if (!user) {
        return error.notFound({
            param: "userId", value: userId,
            msg: `the user ${userId} does not exist`
        });
    }
    return success.ok(user);
}

export async function _getUserById(userId) {
    const user = await User.findOne(
        { id: userId, is_active: true },
        { _id: 0, password: 0 }
    ).lean();
    if (!user) {
        return error.notFound({
            param: "userId", value: userId,
            msg: `the user ${userId} does not exist`
        });
    }
    return success.ok(user);
}

export async function getUsers(ids) {
    const users = await User.find(
        { id: { $in: ids } },
        { _id: 0, password: 0 }
    ).lean();
    return success.ok(users);
}

export async function updateActivationStatus(
    tenantCode, status
) {
    try {
        const result = await User.updateMany(
            { tenant: tenantCode },
            { is_active: status }
        )
        if (result && result.matchedCount) {
            return success.ok({
                updatedUser: result.matchedCount
            });
        } else {
            return databaseError();
        }
    } catch (err) { return err; }
}

export async function checkEmailExists(email) {
    if (await User.findOne({ email: email })) {
        return {
            status: BAD_REQUEST,
            code: "REGISTERED_EMAIL",
            errors: [{
                param: "email",
                location: "body",
                value: email,
            }]
        };
    } else return null;
}