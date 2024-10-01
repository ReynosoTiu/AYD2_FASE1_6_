import { Router } from "express";
import {
    registerConductor,loginConductor,aceptarViaje,cancelarViaje,reportarProblema,verInformacionUsuario,finalizarViaje
} from "../controller/driver.controller.js"

const router = Router();

router.post("/driver/register", registerConductor);
router.post("/driver/loginDriver", loginConductor);
router.post("/driver/acceptDrive", aceptarViaje);
router.post("/driver/cancelDrive", cancelarViaje);
router.post("/driver/reportProblem", reportarProblema);
router.get("/driver/getUserInfo/:id", verInformacionUsuario);
router.post("/driver/endDrive", finalizarViaje);
export default router;