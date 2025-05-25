"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { isDirectiva } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    crearAvisoController,
    obtenerAvisosController,
    
}from "../controllers/aviso.controller.js";

const router = Router();

router 
    .use(authenticateJwt);

router
    .post("/crearAviso",isAdmin,crearAvisoController)
    .post("/crearAviso",isDirectiva, crearAvisoController)
    .get("/obtenerAvisos", isAdmin, obtenerAvisosController)
    .get("/obtenerAvisos", isDirectiva, obtenerAvisosController);
    

export default router;