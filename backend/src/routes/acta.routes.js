"use strict";
import { Router } from "express";
import { getActas, subidaActa } from "../controllers/acta.controller.js";
import { handleFileSizeLimit, upload } from "../middlewares/UploadActa.middleware.js";


const router = Router();


router
    .post("/", upload.single("archivo"), handleFileSizeLimit, subidaActa)
    .get("/", getActas)
export default router;