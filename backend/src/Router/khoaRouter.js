import express from 'express';
import { getAllKhoa, regisKhoa } from '../Controller/khoaController.js';

const router = express.Router();

router.post("/", regisKhoa);
router.get("/", getAllKhoa);

export default router;