import express from 'express';
import { updateActivationStatus, _getUserById, getUsers }
    from '../../controllers/UserController.js';
import { updateActivationValidator, findUserByIdsValidator }
    from '../../validator/UserApi.js';
const router = express.Router();

router.post('/get-by-ids',
    findUserByIdsValidator(),
    async (req, _, next) => {
        const { ids } = req.body;
        const result = await getUsers(ids);
        next(result);
    }
)

router.post('/update-activation',
    updateActivationValidator(),
    async (req, _, next) => {
        const { tenant } = req.query;
        const { is_active } = req.body;
        const result = await updateActivationStatus(
            tenant, is_active
        );
        next(result);
    }
)

router.get('/:userId', async (req, _, next) => {
    const { userId } = req.params;
    const result = await _getUserById(userId);
    next(result);
})

export default router;