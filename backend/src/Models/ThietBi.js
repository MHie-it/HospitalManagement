import mongoose from 'mongoose';

const thietBiSchema = new mongoose.Schema(
    {
        tenThietBi: {
            type: String,
            required: true,
            trim: true,
        },

        maThietBi: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },

        loaiThietBi: {
            type: String,
            required: true,
            enum: [
                'Chẩn đoán hình ảnh',
                'Chẩn đoán',
                'Theo dõi bệnh nhân',
                'Hỗ trợ hô hấp',
                'Điều trị',
                'Phẫu thuật',
                'Khác'
            ],
        },

        nhaSanXuat: {
            type: String,
            required: true,
            trim: true,
        },

        ngayMua: {
            type: Date,
            required: true,
        },

        ngayHetHanBaoHanh: {
            type: Date,
            required: true,
        },

        ngayBaoDuongTiepTheo: {
            type: Date,
            required: true,
        },

        tinhTrang: {
            type: String,
            required: true,
            enum: [
                'Hoạt động tốt',
                'Cần bảo dưỡng',
                'Sắp đến hạn bảo dưỡng',
                'Hết hạn bảo dưỡng',
                'Hỏng'
            ],
            default: 'Hoạt động tốt',
        },

        Khoa: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Khoa',
            required: true,
        },

        soLuong: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },

        moTa: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);


const ThietBi = mongoose.model("ThietBi", thietBiSchema);

export default ThietBi;