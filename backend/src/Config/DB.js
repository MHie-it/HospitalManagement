import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        // Kiểm tra connection string
        if (!process.env.MONGODB_CONNECTIONSTRING) {
            throw new Error('MONGODB_CONNECTIONSTRING is not defined in environment variables');
        }

        // Cấu hình connection options cho độ ổn định
        const options = {
            maxPoolSize: 10, // Số lượng kết nối tối đa trong pool
            serverSelectionTimeoutMS: 5000, // Timeout khi chọn server
            socketTimeoutMS: 45000, // Timeout cho socket
            family: 4, // Sử dụng IPv4
            retryWrites: true, // Retry write operations
            w: 'majority' // Write concern
        };

        await mongoose.connect(
            process.env.MONGODB_CONNECTIONSTRING,
            options
        );

        console.log("Ket noi DB thanh cong");

        // Xử lý các sự kiện kết nối
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected successfully');
        });

        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected');
        });

    } catch (error) {
        console.error("Ket noi DB that bai:", error.message);
        // Không exit ngay, cho phép retry
        throw error;
    }
};