import mongoose from 'mongoose';

const nhaSanXuatSchema = new mongoose.Schema (
    {
        tenNSX : {
            type :String,
            required : true,
            unique : true,
        },

        MST : {
            type : String,
            required : true,
            unique : true,
        },

        diaChi : {
            type : String,
        },

        email :{
            type :String,
            required : true,
            unique : true,
            trim :true,
            lowercase : true,
        },

        SDT :{
            type : String,
            required : true,
            unique : true,
            match: [/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ'] 
        },
    },
);

const NhaSanXuat = mongoose.model("NhaSanXuat", nhaSanXuatSchema);

export default NhaSanXuat;
