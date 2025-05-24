"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    crearAviso,
    obtenerAviso,
    modificarAviso,
    eliminarAviso,
}from "../controllers/asamblea.controller.js";

const router = Router();

router 
    .use(authenticateJwt);

router
    .post("/crearAsamblea",isAdmin,crearAsamblea)
    .get("/getAsamblea",isAdmin, getAsamblea)
    .patch("/updateAsamblea/:id",isAdmin, updateAsamblea)
    .delete("/deleteAsamblea/:id",isAdmin, deleteAsamblea);

export default router;