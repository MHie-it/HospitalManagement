import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name :{
        type : String, 
        required : true,
        enum : ['Admin', 'User', 'Doctor'],
        unique : true
    },

    description : {
        type : String ,
        required : true
    },
},

//createdAt, updatedAt tu dong them vao database
{
    timestamps : true,
}

);

const Role  = mongoose.model("Role", roleSchema);

export default Role;
