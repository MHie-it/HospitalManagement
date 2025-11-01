import mongoose from 'mongoose';

const khoaSchema = new mongoose.Schema(
    {
        tenKhoa: {
            type : String, 
            required : true,
            unique : true,
        },

        email :{
            type : String ,
            required : true,
            unique : true,
            trim : true,
            lowercase : true,
        },

        SDT : {
            type : String ,
            required : true,
            unique : true,
            match: [/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ']
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