import { Router } from "express";
import {
    registerAsistente,listarConductoresInactivos,obtenerConductorInactivoPorID,obtenerConductoresBasicos,obtenerConductorDetallesPorID,obtenerUsuarios,obtenerDetalleUsuario,darDeBajaUsuario
   } from "../controller/assistant.controller.js"

const router = Router();

router.post("/asistant/register", registerAsistente);
router.get("/asistant/getDriverPendingList", listarConductoresInactivos);
router.get("/asistant/getDriverPending/:id", obtenerConductorInactivoPorID);
router.post("/asistant/getDriversList", obtenerConductoresBasicos);
router.get("/asistant/getDriverById/:id", obtenerConductorDetallesPorID);
router.post("/asistant/getUsers", obtenerUsuarios);
router.post("/asistant/getUserById/:id", obtenerDetalleUsuario);
router.post("/asistant/unSuscribeUser", darDeBajaUsuario);
export default router;