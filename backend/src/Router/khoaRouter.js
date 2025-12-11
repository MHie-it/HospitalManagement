import express from 'express';
import { getAllKhoa, deleteKhoa, getKhoaId, regisKhoa, updateKhoa } from '../Controller/khoaController.js';


const router = express.Router();

router.post("/", regisKhoa);
router.get("/", getAllKhoa);
router.get("/:id", getKhoaId);
router.put("/:id", updateKhoa);
router.delete("/:id", deleteKhoa);

export default router;