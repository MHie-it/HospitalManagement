import express from 'express';
import {
    createThietBi,
    getAllThietBi,
    getThietBiById,
    getThietBiByKhoa,
    updateThietBi,
    deleteThietBi
} from '../Controller/thietBiController.js';

const router = express.Router();

router.post("/", createThietBi);
router.get("/", getAllThietBi);
router.get("/khoa/:khoaId", getThietBiByKhoa);
router.get("/:id", getThietBiById);
router.put("/:id", updateThietBi);
router.delete("/:id", deleteThietBi);

export default router;