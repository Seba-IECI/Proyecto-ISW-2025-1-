"use strict";
import{
    crearAvisoService,
}from "../services/aviso.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
}from "../handlers/responseHandlers.js";

export async function crearAvisoController(req, res){
    try{
        const {descripcion, categoria, fecha} = req.body;
        if (!descripcion || !categoria || !fecha) {
            return handleErrorClient(res, 400, "Faltan campos obligatorios: descripcion, categoria o fecha");
        }

        if (errorAviso) return handleErrorClient(res, 404, errorAviso);

        handleSuccess(res, 200, "Aviso creado", aviso);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}




