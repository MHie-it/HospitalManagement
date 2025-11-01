import mongoose from 'mongoose';
import NguoiDung from './NguoiDung';
import BacSi from './BacSi';

const lichSuHoatDongSchema = new mongoose.Schema (
    {
        NguoiDung : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'NguoiDung',
            required : true,    
        },

        BacSi :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'BacSi',
            required : true,
        },

        noiDung :{
            type : String ,
            required : true,
        },

        thoiGian :{
            type : Date ,
            default : Date.now,
        },
    },      

    {
        timestamps : true,
    }

);

const LichSuHoatDong = mongoose.model("LichSuHoatDong", lichSuHoatDongSchema);

export default LichSuHoatDong;