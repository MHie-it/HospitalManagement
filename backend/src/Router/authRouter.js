import express from "express";
import { getAllAccounts, Login, register, registerDoctor, updateAccountStatus, changePassword } from "../Controller/authController.js";


const router = express.Router();

router.post("/register",register);
router.post("/registerDoctor", registerDoctor);
router.post("/login",Login);
router.get("/accounts",getAllAccounts);
router.put("/accounts/:userId/status", updateAccountStatus);
router.put("/change-password/:userId", changePassword);


export default router;