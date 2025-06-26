"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import asambleaRoutes from "./asamblea.routes.js";
import avisoRoutes from "./aviso.routes.js";
import emailRoutes from "./email.routes.js";
import actaRoutes from "./acta.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/aviso", avisoRoutes)
    .use("/asamblea", asambleaRoutes)
    .use("/email", emailRoutes)
    .use("/acta",actaRoutes);

export default router;
