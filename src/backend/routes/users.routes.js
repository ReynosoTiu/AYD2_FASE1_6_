import { Router } from "express";
import {
  cancelarViaje,
  getInfoConductor, 
  pedirViaje, 
  registerUsuario, 
  reportarProblema,
  viajeActivo,
  nuevoViaje,
  listarUbicacionesGuardadas,
  guardarUbicacion,
  calificarConductor,
  verInformacionUsuario,
  actualizarInformacionUsuario
} from "../controller/users.controller.js";

const router = Router();

router.post("/users/register", registerUsuario);
router.get("/users/driver_information/:id", getInfoConductor);
router.post("/users/report_problem", reportarProblema);
router.post("/users/cancel_trip", cancelarViaje);
router.post("/users/request_trip", pedirViaje);
router.get("/users/active_trip/:id", viajeActivo);
router.get("/users/new_trip/:id", nuevoViaje);
router.get("/users/getUbicaciones/:id", listarUbicacionesGuardadas);
router.post("/users/saveUbicaciones", guardarUbicacion);
router.post("/users/rateDriver", calificarConductor);
router.get("/users/getUserInfo/:id", verInformacionUsuario);
router.get("/users/updateUser/:id", actualizarInformacionUsuario);

export default router;