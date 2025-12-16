import express from 'express';
import { getLichHenByUserId, createLichHen, getLichHenByDoctorId } from '../Controller/lichHenController.js';

const router = express.Router();

router.get('/user/:userId', getLichHenByUserId);
router.get('/doctor/:doctorId', getLichHenByDoctorId);
router.post('/', createLichHen);

export default router;

