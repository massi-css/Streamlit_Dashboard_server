import express from 'express';
const router = express.Router();
import { addUser,updateUser,getUserById,updateNotification } from '../Controllers/UsersController.js';

router.post('/', addUser);
router.put('/:id', updateUser);
router.get('/:id', getUserById);
router.put('/:id/notifications', updateNotification);

export default router;