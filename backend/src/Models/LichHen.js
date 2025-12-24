import mongoose from 'mongoose';
import LichLamViec from './LichLamViec.js';

const lichHenSchema = new mongoose.Schema(
    {
        NguoiDung: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NguoiDung',
            required: true,
        },

        LichLamViec: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LichLamViec',

        },

        ngayHen: {
            type: Date,
            required: true,
        },

        DichVu: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DichVu',
        }],

        moTa: {
            type: String,

        },

        soThuTu: {
            type: Number,
            required: false,
        },

        ghiChuBacSi: {
            type: String,
        },

        trangThai: {
            type: String,
            enum: ['Đã xác nhận', 'Chưa xác nhận', 'Đã hủy', 'Đã khám'],
            default: 'Chưa xác nhận',
        },

        CaLamViec: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CaLamViec',
        },

    },

    {
        timestamps: true,
    }
);

const LichHen = mongoose.model("LichHen", lichHenSchema);

export default LichHen;