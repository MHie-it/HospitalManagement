import express from 'express';
import taskRouter from './Router/taskRouter.js';
import { connectDB } from './Config/DB.js';
import dotenv from 'dotenv';
import authRouter from './Router/authRouter.js';
import khoaRouter from './Router/khoaRouter.js';
import doctorRouter from './Router/doctorRouter.js';
import nguoiDungRouter from './Router/nguoiDungRouter.js';
import cors from 'cors';

dotenv.config();


const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.json());

//caasu hinhf cors connect fe and be
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));


app.use("/api/role",taskRouter);
app.use("/api/auth",authRouter);
app.use("/api/khoa",khoaRouter)
app.use("/api/doctor",doctorRouter);
app.use("/api/nguoi-dung", nguoiDungRouter);

// Kết nối database trước khi start server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });


