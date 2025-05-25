"use strict";
import { 
    crearAvisoService,
    obtenerAvisosService
} from "../services/aviso.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../handlers/responseHandlers.js";

export async function crearAvisoController(req, res) {
    try {
        const { descripcion, categoria, fecha } = req.body;
        if (!descripcion || !categoria || !fecha) {
            return handleErrorClient(res, 400, "Faltan campos obligatorios: descripcion, categoria o fecha");
        }
        const [aviso, error] = await crearAvisoService(req.body);
        
        if (error) {
            return handleErrorClient(res, 400, error);
        }

        return handleSuccess(res, 201, "Aviso creado exitosamente", aviso);
        
    } catch (error) {
        return handleErrorServer(res, 500, error.message);
    }
}

export async function obtenerAvisosController(req, res){
    try {
        const [aviso, errorAviso] = await obtenerAvisosService();

        if (errorAviso) return handleErrorClient(res, 404, errorAviso);

        handleSuccess(res, 200, "Avisos encontrados", aviso);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}



