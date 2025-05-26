"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import asambleaRoutes from "./asamblea.routes.js";
import avisoRoutes from "./aviso.routes.js";
<<<<<<< HEAD
import emailRoutes from "./email.routes.js";
=======
>>>>>>> eabc937a29f1101dedfa03e1ef659652dc58330e

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/aviso", avisoRoutes)
<<<<<<< HEAD
    .use("/asamblea", asambleaRoutes)
    .use("/email", emailRoutes);
=======
    .use("/asamblea", asambleaRoutes);
>>>>>>> eabc937a29f1101dedfa03e1ef659652dc58330e

export default router;