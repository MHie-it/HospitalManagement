import express from "express";
import { Login, register, registerDoctor } from "../Controller/authController.js";

const router = express.Router();

router.post("/register",register);
router.post("/registerDoctor", registerDoctor);
router.post("/login",Login);


export default router;