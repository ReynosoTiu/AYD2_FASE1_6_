import { Router } from "express";
import {
    reporteViajesConductores,
  reporteCancelaciones, 
  bajaAsistente, 
  obtenerAsistentes,
  obtenerConductores,
  obtenerUsuariosYCalificaciones,
  obtenerEstadisticasUso

} from "../controller/admin.controller.js";

const router = Router();

router.post("/admin/getAsistants", obtenerAsistentes);
router.post("/admin/unSuscribeAsistant", bajaAsistente);
router.get("/admin/cancelationsReport", reporteCancelaciones);
router.get("/admin/tripsReport", reporteViajesConductores);
router.get("/admin/getDriversReport", obtenerConductores);
router.get("/admin/getUserReport", obtenerUsuariosYCalificaciones);
router.get("/admin/getGeneralStatisticsReport", obtenerEstadisticasUso);

export default router;