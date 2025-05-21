"use strict";
import {
    crearAsambleaService,
    getAsambleaService,
} from "../services/asamblea.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
}from "../handlers/responseHandlers.js";

export async function crearAsamblea(req, res) {
    try {
        const { tema, lugar, fecha } = req.body;

        if (!tema || !lugar || !fecha) {
            return handleErrorClient(res, 400, "Faltan campos obligatorios: tema, lugar o fecha");
        }

        const [asamblea, errorAsamblea] = await crearAsambleaService({tema, lugar, fecha});

        if (errorAsamblea) return handleErrorClient(res, 404, errorAsamblea);

        handleSuccess(res, 200, "Asamblea creada", asamblea);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAsamblea(req, res){
    try {
        const [asamblea, errorAsamblea] = await getAsambleaService();

        if (errorAsamblea) return handleErrorClient(res, 404, errorAsamblea);

        handleSuccess(res, 200, "Asambleas encontradas", asamblea);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}