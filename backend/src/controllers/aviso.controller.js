"use strict";
import { 
    crearAvisoService,
    obtenerAvisosService,
    modificarAvisoService
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

export async function modificarAvisoController(req, res) {
    try {
        const { id } = req.params;
         console.log("ID recibido en params:", id);
        const { descripcion, categoria, fecha } = req.body;

        if (!id) {
            return handleErrorClient(res, 400, "Falta el parámetro obligatorio: id");
        }
        
        if (!descripcion && !categoria && !fecha) {
            return handleErrorClient(res, 400, "Debe proporcionar al menos un campo para actualizar: descripcion, categoria o fecha");
        }

        const camposActualizar = {};
        if (descripcion !== undefined) camposActualizar.descripcion = descripcion;
        if (categoria !== undefined) camposActualizar.categoria = categoria;
        if (fecha !== undefined) camposActualizar.fecha = fecha;

        const idNum = Number(id);
        const [aviso, error] = await modificarAvisoService(idNum, camposActualizar);

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        return handleSuccess(res, 200, "Aviso modificado exitosamente", aviso);
    } catch (error) {
        return handleErrorServer(res, 500, error.message);
    }
}




