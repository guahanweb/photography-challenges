import { Router } from 'express';
import { wrapHandler } from '../utils/handlerWrapper';
import { login, validateToken } from '../controllers/authController';

const router = Router();

// Auth routes
router.post('/login', wrapHandler(login));
router.get('/validate', wrapHandler(validateToken));

export default router;
