import express from 'express';
import { getNguoiDungByUserId, updateNguoiDung } from '../Controller/nguoiDungController.js';

const router = express.Router();

router.get('/:userId', getNguoiDungByUserId);
router.put('/:userId', updateNguoiDung);

export default router;

