import { Router } from "express";
import {
    cambiarContrasena, registerConductor,aceptarViaje,cancelarViaje,reportarProblema,verInformacionUsuario,finalizarViaje,
    listaViajes,viajeActivo
} from "../controller/driver.controller.js"

const router = Router();

router.post("/driver/register", registerConductor);
router.post("/driver/acceptDrive", aceptarViaje);
router.post("/driver/cancelDrive", cancelarViaje);
router.post("/driver/reportProblem", reportarProblema);
router.get("/driver/getUserInfo/:id", verInformacionUsuario);
router.post("/driver/endDrive", finalizarViaje);cambiarContrasena
router.post("/driver/changePassword", cambiarContrasena);
router.get("/driver/getTripList", listaViajes);
router.get("/driver/active_trip/:id", viajeActivo);
export default router;