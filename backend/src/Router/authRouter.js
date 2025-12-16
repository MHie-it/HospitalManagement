import express from "express";
import { getAllAccounts, Login, register, registerDoctor, updateAccountStatus } from "../Controller/authController.js";


const router = express.Router();

router.post("/register",register);
router.post("/registerDoctor", registerDoctor);
router.post("/login",Login);
router.get("/accounts",getAllAccounts);
router.put("/accounts/:userId/status", updateAccountStatus);


export default router;