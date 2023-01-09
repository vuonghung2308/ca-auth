import express from 'express';
import { createUser, findEndUser, findTechnician, findTenantAdmin, getUserById, _getUserById }
    from '../../controllers/UserController.js';
import { verifyRole } from '../../middleware/RoleVerification.js';
import { createUserValidator, findUserValidator } from '../../validator/UserApi.js';
const router = express.Router();

router.get('/', verifyRole("SA", "TA"),
    findUserValidator(),
    async (req, _, next) => {
        const {
            type, email, phone, page, size,
            group, orderType, orderBy
        } = req.query;
        let result = null
        switch (type) {
            case "TA":
                result = await findTenantAdmin(
                    email, phone, page, size,
                    orderBy, orderType, req.payload.role
                );
                break;
            case "EU":
                result = await findEndUser(
                    email, phone, page, size,
                    orderBy, orderType, req.payload
                );
                break;
            case "L*": case "L1": case "L2": default:
                result = await findTechnician(
                    type, email, phone, group, page, size,
                    orderBy, orderType, req.payload
                );
                break;
        }
        next(result);
    }
);

router.get('/:userId', verifyRole("*"),
    async (req, _, next) => {
        const { userId } = req.params;
        const { tenant, role, id } = req.payload;
        const result = await getUserById(
            userId, tenant, id, role
        );
        next(result);
    }
);

router.post('/', verifyRole("SA", "TA"),
    createUserValidator(),
    async (req, _, next) => {
        let {
            email, fullName, role,
            phone, tenant, password
        } = req.body;
        const userRoles = req.payload.role;
        if (role === "SA") tenant = undefined;
        const result = await createUser(
            email, fullName, password,
            phone, tenant, userRoles, role
        );
        next(result);
    }
)

export default router;