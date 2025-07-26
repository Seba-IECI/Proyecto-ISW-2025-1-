"use strict";
import { Router } from "express";
import { isAdminOrDirectiva } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    crearAsamblea,
    getAsamblea,
    getAsambleasDisponibles,
    getAsambleaById,
    updateAsamblea,
    deleteAsamblea,
    changeAsambleaEstado,
}from "../controllers/asamblea.controller.js";

const router = Router();

router 
    .use(authenticateJwt);

router
    .post("/crearAsamblea",isAdminOrDirectiva,crearAsamblea)
    .get("/getAsamblea", getAsamblea)
    .get("/getAsambleasDisponibles", getAsambleasDisponibles)
    .get("/getAsamblea/:id", getAsambleaById)
    .patch("/updateAsamblea/:id",isAdminOrDirectiva, updateAsamblea)
    .patch("/changeEstado/:id",isAdminOrDirectiva, changeAsambleaEstado)
    .delete("/deleteAsamblea/:id",isAdminOrDirectiva, deleteAsamblea);

export default router;
