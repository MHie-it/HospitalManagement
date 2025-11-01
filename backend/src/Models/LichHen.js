import mongoose from 'mongoose';
import LichLamViec from './LichLamViec.js';

const lichHenSchema = new mongoose.Schema(
    {
        NguoiDung :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'NguoiDung',
            required : true,
        },

        LichLamViec: {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'LichLamViec',
            required : true,
        },

        ngayHen : {
            type : Date,
            required : true,
        },

        DichVu : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'DichVu',
            required : true,
        }],

        moTa: {
            type : String ,

        },

        trangThai : {
            type : String ,
            enum : ['Đã xác nhận', 'Chưa xác nhận', 'Đã hủy', 'Đã khám'],
            default : 'Chưa xác nhận',
        },
        
    },

    {
        timestamps : true,
    }
);

const LichHen = mongoose.model("LichHen", lichHenSchema);

export default LichHen;