import path from "path";
import { HOST, PORT } from "../config/configEnv.js";
import { getActasService, subidaActaService, actualizarActaService, eliminarActaService } from "../services/acta.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";


export async function subidaActa(req, res) {
  try {
    const { nombre, asambleaId } = req.body;
    let actaPath = req.file?.path;
    const subidoPor = req.user?.nombreCompleto;

    console.log("Datos recibidos en el controlador:", { nombre, asambleaId, subidoPor });

    if (!actaPath) {
      return handleErrorClient(res, 400, "Acta no subida");
    }

    if (!subidoPor) {
      console.log("Advertencia: Usuario no completamente autenticado, usando valor por defecto");

    }

    // Construye la URL completa para acceder al acta subida
    const baseUrl = `http://${HOST}:${PORT}/api/uploads/actas/`;
    // Obtiene el nombre del acta y lo añade a la URL base
    actaPath = baseUrl + path.basename(actaPath);

    
    const asambleaIdParsed = asambleaId && asambleaId !== '' && asambleaId !== 'undefined' ? parseInt(asambleaId) : null;
    
    console.log("asambleaId original:", asambleaId, "tipo:", typeof asambleaId);
    console.log("asambleaId parseado:", asambleaIdParsed, "tipo:", typeof asambleaIdParsed);

    const [newActa, error] = await subidaActaService({ 
      nombre, 
      actaPath, 
      subidoPor: subidoPor || null, // Asegurarse de pasar null en lugar de undefined
      asambleaId: asambleaIdParsed
    });

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Acta subida", newActa);
  } catch (error) {
    handleErrorServer(res, 500, "Error subiendo acta", error.message);
  }
}

export async function getActas(req, res) {
  try {
    
    const [actas, error] = await getActasService();
    if (error) return handleErrorClient(res, 404, error);

    actas.length === 0
      ? handleSuccess(res, 200)
      : handleSuccess(res, 200, "Actas encontradas", actas);
  } catch (error) {
    handleErrorServer(res, 500, "Error obteniendo actas", error.message);
  }
}

export async function actualizarActa(req, res) {
  try {
    const { id } = req.params;
    const { nombre, asambleaId } = req.body;
    let actaPath = req.file?.path;

   
    if (!id || isNaN(parseInt(id))) {
      return handleErrorClient(res, 400, "ID de acta inválido");
    }

    
    const actaData = {};
    if (nombre) actaData.nombre = nombre;
    if (asambleaId !== undefined) {
      actaData.asambleaId = asambleaId ? parseInt(asambleaId) : null;
    }
    
    
    if (actaPath) {
      const baseUrl = `http://${HOST}:${PORT}/api/uploads/actas/`;
      actaData.actaPath = baseUrl + path.basename(actaPath);
    }

    
    if (Object.keys(actaData).length === 0) {
      return handleErrorClient(res, 400, "No se proporcionaron datos para actualizar");
    }

    const [actaActualizada, error] = await actualizarActaService(parseInt(id), actaData);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Acta actualizada exitosamente", actaActualizada);
  } catch (error) {
    handleErrorServer(res, 500, "Error actualizando acta", error.message);
  }
}

export async function eliminarActa(req, res) {
  try {
    const { id } = req.params;

    
    if (!id || isNaN(parseInt(id))) {
      return handleErrorClient(res, 400, "ID de acta inválido");
    }

    const [actaEliminada, error] = await eliminarActaService(parseInt(id));

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Acta eliminada exitosamente", actaEliminada);
  } catch (error) {
    handleErrorServer(res, 500, "Error eliminando acta", error.message);
  }
}