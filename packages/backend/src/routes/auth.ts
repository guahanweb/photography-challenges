import { Router } from 'express';
import { wrapHandler } from '../utils/handlerWrapper';
import { authController } from '../controllers/auth';

const router = Router();

// Auth routes
router.post('/login', wrapHandler(authController.login));
router.post('/register', wrapHandler(authController.register));
router.get('/validate', wrapHandler(authController.validate));

export default router;
