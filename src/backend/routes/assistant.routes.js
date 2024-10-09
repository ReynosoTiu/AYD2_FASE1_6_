import { Router } from "express";
import {
    registerAsistente,listarConductoresInactivos,obtenerConductorInactivoPorID,obtenerConductoresBasicos,obtenerConductorDetallesPorID,obtenerUsuarios,obtenerDetalleUsuario,darDeBajaUsuario
   } from "../controller/assistant.controller.js"

const router = Router();

router.post("/asistant/register", registerAsistente);
router.get("/asistant/getDriverPendingList", listarConductoresInactivos);
router.get("/asistant/getDriverPending/:id", obtenerConductorInactivoPorID);
router.get("/asistant/getDriversList", obtenerConductoresBasicos);
router.get("/asistant/getDriverById/:id", obtenerConductorDetallesPorID);
router.get("/asistant/getUsers", obtenerUsuarios);
router.get("/asistant/getUserById/:id", obtenerDetalleUsuario);
router.post("/asistant/unSuscribeUser", darDeBajaUsuario);
export default router;