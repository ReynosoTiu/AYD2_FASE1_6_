import { Router } from "express";
import {
    loginUsuario, cambiarContrasena
} from "../controller/general.controller.js"

const router = Router();

router.post("/general/logIn", loginUsuario);
router.post("/general/pwdChange", cambiarContrasena);

export default router;