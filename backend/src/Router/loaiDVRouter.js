import express from 'express';
import {
    createLoaiDichVu,
    deleteLoaiDichVu,
    getAllLoaiDichVu,
    getLoaiDichVuById,
    updateLoaiDichVu
} from '../Controller/loaiDVController.js';

const router = express.Router();

router.post("/", createLoaiDichVu);
router.get("/", getAllLoaiDichVu);
router.get("/:id", getLoaiDichVuById);
router.put("/:id", updateLoaiDichVu);
router.delete("/:id", deleteLoaiDichVu);

export default router;