import path from "path";
import { HOST, PORT } from "../config/configEnv.js";
import { getActasService, subidaActaService } from "../services/acta.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";


export async function subidaActa(req, res) {
  try {
    const { nombre } = req.body;
    let actaPath = req.file?.path;

    if (!actaPath) {
      return handleErrorClient(res, 400, "Acta no subida");
    }
    // Construye la URL completa para acceder al acta subida
    const baseUrl = `http://${HOST}:${PORT}/api/uploads/actas/`;
    // Obtiene el nombre del acta y lo añade a la URL base
    actaPath = baseUrl + path.basename(actaPath);

    const [newActa, error] = await subidaActaService({ nombre, actaPath });

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Acta subida", newActa);
  } catch (error) {
    handleErrorServer(res, 500, "Error subiendo acta", error.message);
  }
}

export async function getActas(req, res) {
  try {
    // Llama al service para obtener todas las actas desde la base de datos
    const [actas, error] = await getActasService();
    if (error) return handleErrorClient(res, 404, error);

    actas.length === 0
      ? handleSuccess(res, 200)
      : handleSuccess(res, 200, "Actas encontradas", actas);
  } catch (error) {
    handleErrorServer(res, 500, "Error obteniendo actas", error.message);
  }
}