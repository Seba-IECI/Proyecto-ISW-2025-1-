"use strict";

import Acta from "../entity/acta.entity.js";
import Asamblea from "../entity/asamblea.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function subidaActaService(actaData) {
  try {
    
    const actaRepository = AppDataSource.getRepository(Acta);
    const asambleaRepository = AppDataSource.getRepository(Asamblea);
    
    
    const { nombre, actaPath, subidoPor, asambleaId } = actaData;
    console.log("Datos recibidos en el servicio:", { nombre, actaPath, subidoPor, asambleaId });

    
    if (asambleaId) {
      const asamblea = await asambleaRepository.findOne({ where: { id: asambleaId } });
      if (!asamblea) {
        return [null, "La asamblea especificada no existe"];
      }
      console.log("Asamblea encontrada:", asamblea.tema);
      
      
      const actaExistente = await actaRepository.findOne({ 
        where: { asambleaId: asambleaId } 
      });
      if (actaExistente) {
        return [null, `La asamblea "${asamblea.tema}" ya tiene un acta asociada`];
      }
    } else {
      console.log("No se proporcionó asambleaId");
    }

    
    const newActa = actaRepository.create({
      nombre,
      archivo: actaPath, 
      subidoPor: subidoPor || null, // Asegurarse de que sea null en lugar de undefined
      asambleaId,
    });
    console.log("Acta creada (antes de guardar):", newActa);
    
    
    await actaRepository.save(newActa);
    console.log("Acta guardada en la base de datos");
    
    
    const actaConAsamblea = await actaRepository.findOne({
      where: { id: newActa.id },
      relations: ["asamblea"]
    });
    console.log("Acta recuperada con relación:", actaConAsamblea);
    
    
    return [actaConAsamblea, null];
  } catch (error) {
    console.error("Error al subir acta:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getActasService() {
  try {
    
    const actaRepository = AppDataSource.getRepository(Acta);

    const actas = await actaRepository.find({
      relations: ["asamblea"],
    });
    
    return [actas, null];
  } catch (error) {
    console.error("Error al obtener actas:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function actualizarActaService(id, actaData) {
  try {
    
    const actaRepository = AppDataSource.getRepository(Acta);
    const asambleaRepository = AppDataSource.getRepository(Asamblea);
    
    
    const actaExistente = await actaRepository.findOne({ where: { id } });
    
    if (!actaExistente) {
      return [null, "Acta no encontrada"];
    }

    
    const { nombre, actaPath, subidoPor, asambleaId } = actaData;
    
   
    if (asambleaId !== undefined && asambleaId !== null) {
      const asamblea = await asambleaRepository.findOne({ where: { id: asambleaId } });
      if (!asamblea) {
        return [null, "La asamblea especificada no existe"];
      }
      
      
      const actaConMismaAsamblea = await actaRepository
        .createQueryBuilder("acta")
        .where("acta.asambleaId = :asambleaId", { asambleaId })
        .andWhere("acta.id != :id", { id })
        .getOne();
      if (actaConMismaAsamblea) {
        return [null, `La asamblea "${asamblea.tema}" ya tiene un acta asociada`];
      }
    }
    
    
    if (nombre) actaExistente.nombre = nombre;
    if (actaPath) actaExistente.archivo = actaPath;
    if (subidoPor !== undefined) actaExistente.subidoPor = subidoPor || null;
    if (asambleaId !== undefined) actaExistente.asambleaId = asambleaId;

    
    const actaActualizada = await actaRepository.save(actaExistente);
    
    
    const actaConAsamblea = await actaRepository.findOne({
      where: { id: actaActualizada.id },
      relations: ["asamblea"]
    });
    
    
    return [actaConAsamblea, null];
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