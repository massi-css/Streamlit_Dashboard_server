import express from 'express';
import { getDevices, addDevice, getDeviceById,  deleteDevice } from '../Controllers/DevicesController.js';
const router = express.Router();

router.get('/', getDevices);
router.post('/', addDevice);
router.get('/:id', getDeviceById);
router.delete('/:id', deleteDevice);





export default router;