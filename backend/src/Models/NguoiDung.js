import mongoose from 'mongoose';

const nguoiDungSchema = new mongoose.Schema(
    {
        hoTen : {
            type :String,
            required : true,
        },

        email :{
            type : String ,            
            unique : true,
            trim : true,//loai bo khoang trang thua
            lowercase : true,//chuyen ve chu thuong
        },

        SDT : {
            type : String ,
            required : true,
            unique : true,
            match: [/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ']
        },

        ngaySinh : {
            type : Date,
            required : true,
        },

        diaChi :{
            type : String ,
            required : true,
        },

        gioiTinh :{
            type : String ,
        },

        imgURL :{
            type : String ,
        },

        User : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true,
        },

    },

    {
        timestamps : true,
    }
    
);

const NguoiDung = mongoose.model("NguoiDung", nguoiDungSchema);

export default NguoiDung;
