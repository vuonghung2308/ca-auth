import express from 'express';
import { login, generateNewToken } from '../../controllers/AuthController.js';
import { refreshTokenValidator } from '../../validator/AuthApi.js';
const router = express.Router();

router.post('/login', async (req, _, next) => {
    const { email, password } = req.body;
    const result = await login(email, password);
    next(result);
})

router.post('/refresh-token',
    refreshTokenValidator(),
    async (req, _, next) => {
        const { refreshToken } = req.body;
        const result = await generateNewToken(
            refreshToken
        );
        next(result);
    }
)

export default router;