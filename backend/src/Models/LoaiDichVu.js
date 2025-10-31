import mongoose from 'mongoose';

const loaiDichVuSchema = new mongoose.Schema(
    {
        loaiDV :{
            type :String ,
            required : true,
            enum : ['Ngoai Tru', 'Noi Tru', 'Cap Cuu', 'Ho Tro Chuan Doan', 'Ngoai Khoa', 'Khac' ],
        },

        moTa :{
            type : String,
            required : true,
        },
    },
);

const LoaiDichVu = mongoose.model("LoaiDichVu", loaiDichVuSchema);

export default LoaiDichVu;