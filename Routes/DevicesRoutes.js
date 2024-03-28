import express from 'express';
import { getDevices, addDevice, getDeviceById,  deleteDevice, updateDevice } from '../Controllers/DevicesController.js';
const router = express.Router();

router.get('/', getDevices);
router.post('/', addDevice);
router.get('/:id', getDeviceById);
router.delete('/:id', deleteDevice);
router.put('/:id', updateDevice);





export default router;