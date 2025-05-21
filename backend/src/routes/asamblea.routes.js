"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    crearAsamblea,
    getAsamblea,
}from "../controllers/asamblea.controller.js";

const router = Router();

router 
    .use(authenticateJwt);

router
    .post("/crearAsamblea",isAdmin,crearAsamblea)
    .get("/getAsamblea",isAdmin, getAsamblea);

export default router;