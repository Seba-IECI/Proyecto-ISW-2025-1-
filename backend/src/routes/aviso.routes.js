"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { isDirectiva } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { uploadAviso } from "../middlewares/subirArchivo.middleware.js"; 
import {
    crearAvisoController,
    obtenerAvisosController,
    modificarAvisoController,
    eliminarAvisoController
    
}from "../controllers/aviso.controller.js";

const router = Router();

router 
    .use(authenticateJwt);

import { isAdminOrDirectiva } from "../middlewares/authorization.middleware.js";

router
    .post("/crearAviso", authenticateJwt, isAdminOrDirectiva, uploadAviso.single("archivoAdjunto"), crearAvisoController)
    .get("/obtenerAvisos", authenticateJwt, obtenerAvisosController)
    .patch("/modificarAviso/:id", authenticateJwt, isAdminOrDirectiva, uploadAviso.single("archivoAdjunto"), modificarAvisoController)
    .delete("/eliminarAviso/:id", authenticateJwt, isAdminOrDirectiva, eliminarAvisoController)
    

export default router;