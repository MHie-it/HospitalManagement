import express from 'express';
import {
    createDichVu,
    getAllDichVu,
    getDichVuById,
    getDichVuByKhoa,
    updateDichVu,
    deleteDichVu
} from '../Controller/dichVuController.js';

const router = express.Router();

router.post("/", createDichVu);
router.get("/", getAllDichVu);
router.get("/khoa/:khoaId", getDichVuByKhoa);
router.get("/:id", getDichVuById);
router.put("/:id", updateDichVu);
router.delete("/:id", deleteDichVu);

export default router;