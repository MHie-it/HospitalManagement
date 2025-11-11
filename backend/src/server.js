import express from 'express';
import taskRouter from './Router/taskRouter.js';
import { connectDB } from './Config/DB.js';
import dotenv from 'dotenv';

dotenv.config();


const app = express();

const PORT = process.env.PORT || 5001;

connectDB();

app.use(express.json());

app.use("/api/role",taskRouter);

connectDB().then(() =>{
    app.listen(PORT, () => {
        console.log('Server is running on ${PORT}');
    });
});


