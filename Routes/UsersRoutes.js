import express from 'express';
const router = express.Router();
import { addUser,updateUser,getUserById } from '../Controllers/UsersController.js';

router.post('/', addUser);
router.put('/:id', updateUser);
router.get('/:id', getUserById);

export default router;