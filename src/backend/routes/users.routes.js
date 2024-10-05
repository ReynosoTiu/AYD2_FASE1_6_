import { Router } from "express";
import {
  cancelarViaje,
  getInfoConductor, 
  pedirViaje, 
  registerUsuario, 
  reportarProblema
} from "../controller/users.controller.js";

const router = Router();

router.post("/users/register", registerUsuario);
router.post("/users/driver_information", getInfoConductor);
router.post("/users/report_problem", reportarProblema);
router.post("/users/cancel_trip", cancelarViaje);
router.post("/users/request_trip", pedirViaje);

export default router;