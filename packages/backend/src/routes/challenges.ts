import { Router } from 'express';
import { wrapHandler } from '../utils/handlerWrapper';
import { projectController } from '../controllers/project';

const router = Router();

// Project Instance routes (user-specific)
router.post('/', wrapHandler(projectController.instance.create));
router.get('/:instanceId', wrapHandler(projectController.instance.get));
router.put('/:instanceId', wrapHandler(projectController.instance.update));
router.delete('/:instanceId', wrapHandler(projectController.instance.delete));

// List user's challenges
router.get('/my', wrapHandler(projectController.instance.listUser));

// List challenges where user is mentor
router.get('/mentoring', wrapHandler(projectController.instance.listMentor));

// Challenge submissions and messages
router.post('/:instanceId/submissions', wrapHandler(projectController.instance.addSubmission));
router.get('/:instanceId/submissions', wrapHandler(projectController.instance.getSubmissions));
router.post('/:instanceId/messages', wrapHandler(projectController.instance.addMessage));
router.get('/:instanceId/messages', wrapHandler(projectController.instance.getMessages));

export default router;
