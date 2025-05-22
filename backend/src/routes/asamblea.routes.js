"use strict";
import { Router } from "express";
import { isAdminOrDirectiva } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    crearAsamblea,
    getAsamblea,
    updateAsamblea,
    deleteAsamblea,
}from "../controllers/asamblea.controller.js";

const router = Router();

router 
    .use(authenticateJwt);

router
    .post("/crearAsamblea",isAdminOrDirectiva,crearAsamblea)
    .get("/getAsamblea", getAsamblea)
    .patch("/updateAsamblea/:id",isAdminOrDirectiva, updateAsamblea)
    .delete("/deleteAsamblea/:id",isAdminOrDirectiva, deleteAsamblea);

export default router;