import mongoose from 'mongoose';
import NhaSanXuat from './NhaSanXuat.js';

const thuocSchema = new mongoose.Schema(
    {
        tenThuoc :{
            type : String ,
            required : true,
            unique : true,
        },

        congDung :{
            type : String ,
        },

        cachDung :{
            type: String,
        },

        LoaiThuoc :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'LoaiThuoc',
            required : true,
        },

        NSX :{
            type : Date ,
            required : true,
        },

        HSD : {
            type: String,
        },

        NHH :{
            type : Date ,
            required : true,
        },

        NhaSanXuat :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'NhaSanXuat',
            required : true,
        },
    },
);

const Thuoc = mongoose.model("Thuoc", thuocSchema);

export default Thuoc;