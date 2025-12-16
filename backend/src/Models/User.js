import mongoose from 'mongoose';

const userSchema  = new mongoose.Schema(
    {
        username : {
            type : String ,
            required : true,
            unique : true,
        },

        password :{
            type : String,
            required : true
        },

        isActive : {
            type : Boolean,
            default : true,
        },

        role : [{
            type : mongoose.Schema.Types.ObjectId,
            ref  : 'Role',
            required : true,
            default : 'User'
        }],

        BacSi: {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'BacSi',
            required : false,
        },

        NguoiDung: {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'NguoiDung',
            required : false,
        },

        resetPasswordToken: {
            type: String,
            default: null,
        },

        resetPasswordExpires: {
            type: Date,
            default: null,
        },
    },

    {
        timestamps : true,
    }

);

const User = mongoose.model("User", userSchema);

export default User;