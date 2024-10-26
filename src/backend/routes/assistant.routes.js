import { Router } from "express";
import {
    registerAsistente,listarConductoresInactivos,obtenerConductorInactivoPorID,obtenerConductoresBasicos,obtenerConductorDetallesPorID,obtenerUsuarios,obtenerDetalleUsuario,darDeBajaUsuario,
    aprobarRechazarConductor,reporteVehiculos,updateConductorInfo,generarOferta,getOfertas,desactivarOferta
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
router.post("/asistant/aproveRejectDriver", aprobarRechazarConductor);
router.get("/asistant/getVehiculeReport", reporteVehiculos);
router.post("/asistant/updateConductor", updateConductorInfo);
router.post("/asistant/generateDiscounts", generarOferta);
router.get("/asistant/getDiscounts", getOfertas);
router.post("/asistant/deleteDiscount", desactivarOferta);




export default router;