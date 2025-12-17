import express from 'express';
import { getLichHenByUserId, createLichHen, getLichHenByDoctorId, updateLichHen, getAllLichHen } from '../Controller/lichHenController.js';

const router = express.Router();

router.get('/all', getAllLichHen);
router.get('/user/:userId', getLichHenByUserId);
router.get('/doctor/:doctorId', getLichHenByDoctorId);
router.post('/', createLichHen);
router.put('/:id', updateLichHen);

export default router;

