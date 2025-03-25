import { Router } from 'express';
import { wrapHandler } from '../utils/handlerWrapper';
import { projectController } from '../controllers/project';

const router = Router();

// Project Definition CRUD routes (admin only)
router.post('/', wrapHandler(projectController.project.create));
router.get('/:projectId', wrapHandler(projectController.project.get));
router.put('/:projectId', wrapHandler(projectController.project.update));
router.delete('/:projectId', wrapHandler(projectController.project.delete));
router.get('/', wrapHandler(projectController.project.list));

export default router;
