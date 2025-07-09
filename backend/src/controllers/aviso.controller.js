"use strict";
import { 
    crearAvisoService,
    obtenerAvisosService,
    modificarAvisoService,
    eliminarAvisoService,
    obtenerEmailsResidentes
} from "../services/aviso.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../handlers/responseHandlers.js";
import { avisoValidation } from "../validations/aviso.validations.js";
import { sendEmail } from "../services/email.service.js";



export async function crearAvisoController(req, res) {
    try {
        const { file } = req;
        const data = { ...req.body };
        if (file) {
            data.archivoAdjunto = file.filename;
        }
        
        const { error } = avisoValidation.validate(data);
        if (error) {
            return handleErrorClient(res, 400, error.message);
        }
        
        const [aviso, errorAviso] = await crearAvisoService(data);
        if (errorAviso) {
            return handleErrorClient(res, 400, errorAviso);
        }
        
        let destinatarios = [];
        if (data.destinatario) {
            destinatarios = [data.destinatario];
        } else {
            
            destinatarios = await obtenerEmailsResidentes();
        }
        for (const email of destinatarios) {
            await sendEmail(
                email,
                `Nuevo aviso: ${data.categoria}`,
                data.descripcion,
                `<p>${data.descripcion}</p>${file ? `<a href="${process.env.HOST}/uploads/avisos/${file.filename}">Descargar adjunto</a>` : ""}`
            );
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
        const { descripcion, categoria, fecha, fechaExpiracion, destinatario } = req.body;
        const { file } = req;

        if (!id) {
            return handleErrorClient(res, 400, "Falta el parámetro obligatorio: id");
        }

        if (!descripcion && !categoria && !fecha && !fechaExpiracion && !file) {
            return handleErrorClient(res, 400, "Debe proporcionar al menos un campo para actualizar: descripcion, categoria, fecha, fechaExpiracion o archivo adjunto");
        }

        const camposActualizar = {};
        if (descripcion !== undefined) camposActualizar.descripcion = descripcion;
        if (categoria !== undefined) camposActualizar.categoria = categoria;
        if (fecha !== undefined) camposActualizar.fecha = fecha;
        if (fechaExpiracion !== undefined) camposActualizar.fechaExpiracion = fechaExpiracion;
        if (destinatario !== undefined) camposActualizar.destinatario = destinatario;
        if (file) camposActualizar.archivoAdjunto = file.filename;

        const { error } = avisoValidation.validate({ ...camposActualizar });
        if (error) {
            return handleErrorClient(res, 400, error.message);
        }

        const idNum = Number(id);
        const [aviso, errorAviso] = await modificarAvisoService(idNum, camposActualizar);

        if (errorAviso) {
            return handleErrorClient(res, 400, errorAviso);
        }

        let destinatarios = [];
        if (camposActualizar.destinatario) {
            destinatarios = [camposActualizar.destinatario];
        } else {
            destinatarios = await obtenerEmailsResidentes();
        }
        for (const email of destinatarios) {
            await sendEmail(
                email,
                `Aviso modificado: ${camposActualizar.categoria || aviso.categoria}`,
                camposActualizar.descripcion || aviso.descripcion,
                `<p>${camposActualizar.descripcion || aviso.descripcion}</p>` +
                ((camposActualizar.archivoAdjunto || aviso.archivoAdjunto) ? `<a href="${process.env.HOST}/uploads/avisos/${camposActualizar.archivoAdjunto || aviso.archivoAdjunto}">Descargar adjunto</a>` : "")
            );
        }

        return handleSuccess(res, 200, "Aviso modificado exitosamente", aviso);
    } catch (error) {
        return handleErrorServer(res, 500, error.message);
    }
}

export async function eliminarAvisoController(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return handleErrorClient(res, 400, "Falta el parámetro obligatorio: id");
        }

        const idNum = Number(id);
        const [aviso, error] = await eliminarAvisoService(idNum);

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        return handleSuccess(res, 200, "Aviso eliminado exitosamente", aviso);
    } catch (error) {
        return handleErrorServer(res, 500, error.message);
    }
}



