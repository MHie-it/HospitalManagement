import mongoose from 'mongoose';

const bacsiSchema = new mongoose.Schema(
    {
        tenBS: {
            type : String,
            required : true            
        },

        email: {
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true,
        },

        SDT :{
            type : String,
            required : true,
            unique : true,
            match: [/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ']
        },

        ngaySinh : {
            type :Date,
            required : true,
        },

        diaChi: {
            type : String ,            
        },

        gioiTinh : {
            type : String ,
        },

        imgURL :{
            type :String,
        },
        
        isActive: {
            type: Boolean,
            default: true,  // Mặc định là đang hoạt động
        },

        Khoa:{
            type : mongoose.Schema.Types.ObjectId,
            ref :'Khoa',
            required : true,
        },

        User: {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true,
        },

    },

    {
        timestamps : true,
    }

);

const BacSi  = mongoose.model("BacSi", bacsiSchema);

export default BacSi;