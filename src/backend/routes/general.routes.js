import { Router } from "express";
import {
    loginUsuario, cambiarContrasena,
    listaViajes, verInformacionViaje
} from "../controller/general.controller.js"

const router = Router();

router.post("/general/logIn", loginUsuario);
router.post("/general/pwdChange", cambiarContrasena);
router.get("/general/getTripList", listaViajes);
router.get("/general/getTripInfo/:id", verInformacionViaje);

export default router;