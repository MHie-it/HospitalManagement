import mongoose from 'mongoose';

const loaiDichVuSchema = new mongoose.Schema(
    {
        loaiDV :{
            type :String ,
            required : true,
        },

        moTa :{
            type : String,
            required : true,
        },
    },
);

const LoaiDichVu = mongoose.model("LoaiDichVu", loaiDichVuSchema);

export default LoaiDichVu;