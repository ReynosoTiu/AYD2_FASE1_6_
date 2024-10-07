import { Router } from "express";
import {
    cambiarContrasena, registerConductor,aceptarViaje,cancelarViaje,reportarProblema,verInformacionUsuario,finalizarViaje
} from "../controller/driver.controller.js"

const router = Router();

router.post("/driver/register", registerConductor);
router.post("/driver/acceptDrive", aceptarViaje);
router.post("/driver/cancelDrive", cancelarViaje);
router.post("/driver/reportProblem", reportarProblema);
router.get("/driver/getUserInfo/:id", verInformacionUsuario);
router.post("/driver/endDrive", finalizarViaje);cambiarContrasena
router.post("/driver/changePassword", cambiarContrasena);
export default router;