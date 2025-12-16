import express from 'express';
import { connectDB } from './Config/DB.js';
import dotenv from 'dotenv';
import authRouter from './Router/authRouter.js';
import khoaRouter from './Router/khoaRouter.js';
import doctorRouter from './Router/doctorRouter.js';
import dichVuRouter from './Router/dichVuRouter.js';
import loaiDVRouter from './Router/loaiDVRouter.js';
import cors from 'cors';

dotenv.config();


const app = express();

const PORT = process.env.PORT || 5001;

connectDB();

app.use(express.json());

//caasu hinhf cors connect fe and be
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));


app.use("/api/auth",authRouter);
app.use("/api/khoa",khoaRouter)
app.use("/api/doctor",doctorRouter);
app.use("/api/dichvu",dichVuRouter);
app.use("/api/loaidv",loaiDVRouter);

connectDB().then(() =>{
    app.listen(PORT, () => {
        console.log('Server is running on ${PORT}');
    });
});


