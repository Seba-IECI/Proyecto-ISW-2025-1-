"use strict";
import { 
    crearAvisoService 
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




