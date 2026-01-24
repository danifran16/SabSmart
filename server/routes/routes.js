import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

router.post("/login", authController.login);


router.post("/crearCliente", authController.crearCliente);

export default router;
