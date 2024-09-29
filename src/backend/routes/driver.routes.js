import { Router } from "express";
import {
    registerConductor
} from "../controller/driver.controller.js"

const router = Router();

router.post("/driver/register", registerConductor);
export default router;