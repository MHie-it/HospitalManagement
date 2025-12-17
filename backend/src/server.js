import express from 'express';
import { connectDB } from './Config/DB.js';
import dotenv from 'dotenv';
import authRouter from './Router/authRouter.js';
import khoaRouter from './Router/khoaRouter.js';
import doctorRouter from './Router/doctorRouter.js';
import nguoiDungRouter from './Router/nguoiDungRouter.js';
import lichHenRouter from './Router/lichHenRouter.js';
import lichLamViecRouter from './Router/lichLamViecRouter.js';
import dichVuRouter from './Router/dichVuRouter.js';
import loaiDVRouter from './Router/loaiDVRouter.js';
import thietbiRouter from './Router/thietbiRouter.js';
import tuVanRouter from './Router/tuVanRouter.js';
import cors from 'cors';
import path from 'path';

dotenv.config();


const app = express();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json());

//caasu hinhf cors connect fe and be

if (process.env.NODE_ENV !== 'production') {
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true
    }));
}


app.use("/api/auth", authRouter);
app.use("/api/khoa", khoaRouter)
app.use("/api/doctor", doctorRouter);
app.use("/api/nguoiDung", nguoiDungRouter);
app.use("/api/lichHen", lichHenRouter);
app.use("/api/lichLamViec", lichLamViecRouter);
app.use("/api/dichvu", dichVuRouter);
app.use("/api/loaidv", loaiDVRouter);
app.use("/api/thietbi", thietbiRouter);
app.use("/api/tuVan", tuVanRouter);


// deploy

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

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


