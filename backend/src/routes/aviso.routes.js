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

router
    .post("/crearAviso", isAdmin, uploadAviso.single("archivoAdjunto"), crearAvisoController)
    .post("/crearAviso", isDirectiva, uploadAviso.single("archivoAdjunto"), crearAvisoController)
    .get("/obtenerAvisos", isAdmin, obtenerAvisosController)
    .get("/obtenerAvisos", isDirectiva, obtenerAvisosController)
    .patch("/modificarAviso/:id", isAdmin, modificarAvisoController)
    .patch("/modificarAviso/:id", isDirectiva, modificarAvisoController)
    .delete("/eliminarAviso/:id", isAdmin, eliminarAvisoController)
    .delete("/eliminarAviso/:id", isDirectiva, eliminarAvisoController);
    

export default router;