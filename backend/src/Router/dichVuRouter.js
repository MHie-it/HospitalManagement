import express from 'express';
import { getAllDichVu, getDichVuByKhoa } from '../Controller/dichVuController.js';

const router = express.Router();

router.get('/', getAllDichVu);
router.get('/khoa/:khoaId', getDichVuByKhoa);

export default router;

