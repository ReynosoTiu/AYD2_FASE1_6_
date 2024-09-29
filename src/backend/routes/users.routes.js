import { Router } from "express";
import {
  login
} from "../controller/users.controller.js";

const router = Router();

router.post("/users/login", login);
router.post("/users/register", login);
router.post("/users/driver_information", login);
router.post("/users/report_problem", login);
router.post("/users/cancel_trip", login);
router.post("/users/request_trip", login);

export default router;