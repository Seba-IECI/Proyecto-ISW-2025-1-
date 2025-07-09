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
    .post("/crearAviso",authenticateJwt, isAdmin, uploadAviso.single("archivoAdjunto"), crearAvisoController)
    .post("/crearAviso", authenticateJwt, isDirectiva, uploadAviso.single("archivoAdjunto"), crearAvisoController)
    .get("/obtenerAvisos", authenticateJwt, isAdmin, obtenerAvisosController)
    .get("/obtenerAvisos", authenticateJwt, isDirectiva, obtenerAvisosController)
    .patch("/modificarAviso/:id", authenticateJwt, isAdmin, uploadAviso.single("archivoAdjunto"), modificarAvisoController)
    .patch("/modificarAviso/:id", authenticateJwt, isDirectiva,uploadAviso.single("archivoAdjunto"), modificarAvisoController)
    .delete("/eliminarAviso/:id", authenticateJwt, isAdmin, eliminarAvisoController)
    .delete("/eliminarAviso/:id", authenticateJwt, isDirectiva, eliminarAvisoController);
    

export default router;