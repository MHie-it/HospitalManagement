import mongoose from 'mongoose';
import LoaiDichVu from './LoaiDichVu.js';

const dichVuSchema = new mongoose.Schema(
    {
        tenDV : {
            type : String ,
            required : true,
            unique : true,
        },

        moTa : {
            type : String ,
            required : true,
        },

        giaTien : {
            type : Decimal128 ,
            required : true,
        },

        Khoa :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Khoa',
            required : true,
        },

        LoaiDichVu : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'LoaiDichVu',
            required : true,
        },
        
    },
);

const DichVu = mongoose.model("DichVu", dichVuSchema);

export default DichVu;