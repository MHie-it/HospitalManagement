import mongoose from 'mongoose';

const loaiThuocSchema = new mongoose.Schema(
    {
        loaiThoc :{
            type : String,
            required : true,
        },

        moTa :{
            type :String,
            required : true,
        },
    },
    
);

const LoaiThuoc = mongoose.model("LoaiThuoc", loaiThuocSchema);

export default LoaiThuoc;