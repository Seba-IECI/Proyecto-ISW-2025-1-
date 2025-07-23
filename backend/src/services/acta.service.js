"use strict";

import Acta from "../entity/acta.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function subidaActaService(actaData) {
  try {
    // Obtiene el repositorio de la entidad Acta a través de TypeORM
    const actaRepository = AppDataSource.getRepository(Acta);
    // Extrae el nombre del acta, la ruta donde se almacenó y quien la subió
    const { nombre, actaPath, subidoPor } = actaData;
    console.log("Datos recibidos para guardar en la base de datos:", { nombre, actaPath, subidoPor });

    // Crea una nueva instancia de la entidad Acta con los datos recibidos
    const newActa = actaRepository.create({
      nombre,
      archivo: actaPath, // Almacena la ruta del acta, no el contenido
      subidoPor,
    });
    // Guarda la nueva instancia en la base de datos
    await actaRepository.save(newActa);
    // Retorna el acta creada y null para indicar que no hubo errores
    return [newActa, null];
  } catch (error) {
    console.error("Error al subir acta:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getActasService() {
  try {
    // Obtiene el repositorio de la entidad Acta
    const actaRepository = AppDataSource.getRepository(Acta);

    const actas = await actaRepository.find();
    // Retorna las actas encontradas y null para indicar que no hubo errores
    return [actas, null];
  } catch (error) {
    console.error("Error al obtener actas:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function actualizarActaService(id, actaData) {
  try {
    
    const actaRepository = AppDataSource.getRepository(Acta);
    
    
    const actaExistente = await actaRepository.findOne({ where: { id } });
    
    if (!actaExistente) {
      return [null, "Acta no encontrada"];
    }

    
    const { nombre, actaPath, subidoPor } = actaData;
    
    
    if (nombre) actaExistente.nombre = nombre;
    if (actaPath) actaExistente.archivo = actaPath;
    if (subidoPor) actaExistente.subidoPor = subidoPor;

    
    const actaActualizada = await actaRepository.save(actaExistente);
    
    
    return [actaActualizada, null];
  } catch (error) {
    console.error("Error al actualizar acta:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function eliminarActaService(id) {
  try {
    
    const actaRepository = AppDataSource.getRepository(Acta);
    
    
    const actaExistente = await actaRepository.findOne({ where: { id } });
    
    if (!actaExistente) {
      return [null, "Acta no encontrada"];
    }

    
    await actaRepository.remove(actaExistente);
    
    
    return [actaExistente, null];
  } catch (error) {
    console.error("Error al eliminar acta:", error);
    return [null, "Error interno del servidor"];
  }
}