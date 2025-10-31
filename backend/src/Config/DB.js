import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        await mongoose.connect(
            process.env.MONGODB_CONNECTIONSTRING
        );

        console.log("Ket noi DB thanh cong");
    }catch (error) {
        console.log("Ket noi DB that bai", error);
        process.exit(1);
        // thoat kho keet noi DB that bai
    }
};