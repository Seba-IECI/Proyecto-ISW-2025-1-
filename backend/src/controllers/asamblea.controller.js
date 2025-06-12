
"use strict";
import {
    crearAsambleaService,
    getAsambleaService,
    getAsambleaByIdService,
    updateAsambleaService,
    deleteAsambleaService,
} from "../services/asamblea.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";
import { asambleaQueryValidation, asambleaUpdateValidation } from "../validations/asamblea.validation.js";

export async function crearAsamblea(req, res) {
    try {
        const { error, value } = asambleaQueryValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const { tema, lugar, fecha } = value;

        const [asamblea, errorAsamblea] = await crearAsambleaService({ tema, lugar, fecha });

        if (errorAsamblea) return handleErrorClient(res, 404, errorAsamblea);

        handleSuccess(res, 200, "Asamblea creada", asamblea);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAsamblea(req, res) {
    try {
        const [asamblea, errorAsamblea] = await getAsambleaService();

        if (errorAsamblea) return handleErrorClient(res, 404, errorAsamblea);

        handleSuccess(res, 200, "Asambleas encontradas", asamblea);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}



export async function updateAsamblea(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;

        
        const { error, value } = asambleaUpdateValidation.validate(body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [asamblea, errorAsamblea] = await updateAsambleaService({ id }, value);

        if (errorAsamblea) return handleErrorClient(res, 404, errorAsamblea);

        handleSuccess(res, 200, "Asamblea actualizada", asamblea);
    } catch (error) {
        handleErrorClient(res, 500, error.message);
    }
}

export async function deleteAsamblea(req, res) {
    try {
        const { id } = req.params;

        const [asamblea, errorAsamblea] = await deleteAsambleaService({ id });

        if (errorAsamblea) return handleErrorClient(res, 404, errorAsamblea);

        handleSuccess(res, 200, "Asamblea eliminada", asamblea);
    } catch (error) {
        handleErrorClient(res, 500, error.message);
    }
}

export async function getAsambleaById(req, res) {
    try {
        const { id } = req.params;

        const [asamblea, errorAsamblea] = await getAsambleaByIdService(id);

        if (errorAsamblea) return handleErrorClient(res, 404, errorAsamblea);

        handleSuccess(res, 200, "Asamblea encontrada", asamblea);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
