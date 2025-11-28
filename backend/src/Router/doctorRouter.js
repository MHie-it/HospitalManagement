import express from 'express';
import {
    getAllDoctors,
    getDoctorID,
    OffDoctor,
    updateDoctor
} from '../Controller/doctorController.js';


const router = express.Router();

router.get("/", getAllDoctors);
router.get("/:id", getDoctorID);
router.put("/:id", updateDoctor);
router.patch("/:id/off", OffDoctor);

export default router;