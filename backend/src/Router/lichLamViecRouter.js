import express from 'express';
import {
    getLichLamViecByDoctorId,
    getLichLamViecByDoctorIdAndDate,
    createOrUpdateLichLamViec,
    deleteLichLamViec,
    getAllCaLamViec
} from '../Controller/lichLamViecController.js';

const router = express.Router();

router.get('/ca-lam-viec', getAllCaLamViec);
router.get('/doctor/:doctorId', getLichLamViecByDoctorId);
router.get('/doctor/:doctorId/date', getLichLamViecByDoctorIdAndDate);
router.post('/doctor/:doctorId', createOrUpdateLichLamViec);
router.delete('/:id', deleteLichLamViec);

export default router;

