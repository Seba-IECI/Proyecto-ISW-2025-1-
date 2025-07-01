"use strict";
import { Router } from "express";
import { getActas, subidaActa, actualizarActa, eliminarActa } from "../controllers/acta.controller.js";
import { handleFileSizeLimit, upload } from "../middlewares/UploadActa.middleware.js";
import { validateActaCreation, validateActaUpdate } from "../validations/acta.validation.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdminOrDirectiva } from "../middlewares/authorization.middleware.js";


const router = Router();


router
    .post("/", authenticateJwt, isAdminOrDirectiva, upload.single("archivo"), handleFileSizeLimit, validateActaCreation, subidaActa)
    .get("/", getActas)
    .patch("/:id", authenticateJwt, isAdminOrDirectiva, upload.single("archivo"), handleFileSizeLimit, validateActaUpdate, actualizarActa)
    .delete("/:id", authenticateJwt, isAdminOrDirectiva, eliminarActa)
export default router;