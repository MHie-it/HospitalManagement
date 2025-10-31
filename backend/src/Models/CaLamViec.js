import mongoose from 'mongoose';

const caLamViecSchema = new mongoose.Schema(
    {
        caLam :{
            type :String ,
            required : true,
            enum : ['Sang', 'Chieu', 'Toi'],
        },

        gioBatDau : {
            type :String ,
        },

        gioKetThuc :{
            type :String ,
        },
    },
);

const CaLamViec = mongoose.model("CaLamViec", caLamViecSchema);

export default CaLamViec;