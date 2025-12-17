import mongoose from 'mongoose';

const tuVanSchema = new mongoose.Schema(
    {
        NguoiDung: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NguoiDung',
            required: true,
        },

        Khoa: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Khoa',
            required: false,
        },

        BacSi: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BacSi',
            required: false,
        },

        cauHoi: {
            type: String,
            required: true,
        },

        traLoi: {
            type: String,
            default: '',
        },

        trangThai: {
            type: String,
            enum: ['Chờ trả lời', 'Đã trả lời', 'Đang xử lý'],
            default: 'Chờ trả lời',
        },

        loaiTraLoi: {
            type: String,
            enum: ['AI', 'BacSi'],
            default: 'AI',
        },
    },
    {
        timestamps: true,
    }
);

const TuVan = mongoose.model("TuVan", tuVanSchema);

export default TuVan;

