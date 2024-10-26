import { Router } from "express";
import {
    reporteViajesConductores,
  reporteCancelaciones, 
  bajaAsistente, 
  obtenerAsistentes
} from "../controller/admin.controller.js";

const router = Router();

router.post("/admin/getAsistants", obtenerAsistentes);
router.post("/admin/unSuscribeAsistant", bajaAsistente);
router.get("/admin/cancelationsReport", reporteCancelaciones);
router.get("/admin/tripsReport", reporteViajesConductores);

export default router;