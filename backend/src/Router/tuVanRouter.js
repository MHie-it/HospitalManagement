import express from 'express';
import {
    createTuVan,
    getTuVanByUserId,
    getTuVanByDoctorId,
    updateTuVan,
    deleteTuVan
} from '../Controller/tuVanController.js';

const router = express.Router();

router.post('/', createTuVan);
router.get('/user/:userId', getTuVanByUserId);
router.get('/doctor/:doctorId', getTuVanByDoctorId);
router.put('/:id', updateTuVan);
router.delete('/:id', deleteTuVan);

export default router;

