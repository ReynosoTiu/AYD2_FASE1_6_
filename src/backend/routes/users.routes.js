import { Router } from "express";
import {
  cancelarViaje,
  getInfoConductor, 
  pedirViaje, 
  registerUsuario, 
  reportarProblema,
  viajeActivo
} from "../controller/users.controller.js";

const router = Router();

router.post("/users/register", registerUsuario);
router.get("/users/driver_information/:id", getInfoConductor);
router.post("/users/report_problem", reportarProblema);
router.post("/users/cancel_trip", cancelarViaje);
router.post("/users/request_trip", pedirViaje);
router.get("/users/active_trip/:id", viajeActivo);

export default router;