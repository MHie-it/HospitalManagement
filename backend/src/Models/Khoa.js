import mongoose from 'mongoose';

const khoaSchema = new mongoose.Schema(
    {
        tenKhoa: {
            type : String, 
            required : true,
            unique : true,
        },

        moTa: {
            type : String,
            required : true,
        },
    },

    {
        timestamps : true,
    }
);

const Khoa = mongoose.model("Khoa", khoaSchema);

export default Khoa;