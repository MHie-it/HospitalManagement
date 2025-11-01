import mongoose from "mongoose";
import BacSi from "./BacSi.js";

const licLamViecSchema = new mongoose.Schema (
    {
        ngayLam : {
            type : Date ,
        },

        BacSi: {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'BacSi',
            required : true,
        },

        CaLamViec : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'CaLamViec',
            required :true,
        }],
    },

    {
        timestamps :true,
    }

);

const LichLamViec = mongoose.model("LichLamViec",licLamViecSchema);

export default LichLamViec;