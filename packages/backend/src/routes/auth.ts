import { Router } from 'express';
import { wrapHandler } from '../utils/handlerWrapper';
import { login } from '../controllers/authController';

const router = Router();

// Auth routes
router.post('/login', wrapHandler(login));

export default router;
