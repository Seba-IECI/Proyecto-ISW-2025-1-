"use strict";
import Asamblea from "../entity/asamblea.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function crearAsambleaService(query){
    try {
        const {tema, lugar, fecha, temasATratar, creador} = query;
        const asambleaRepository = AppDataSource.getRepository(Asamblea);

        const asambleaExistente = await asambleaRepository.findOne({ where: { fecha } });
        if (asambleaExistente) {
            return [null, "Ya existe una asamblea para la fecha indicada"];
        }

        const nuevaAsamblea = asambleaRepository.create({
            tema,
            lugar,
            fecha,
            temasATratar,
            creador,
            createdAt: new Date(),
        });

        await asambleaRepository.save(nuevaAsamblea);
        return [nuevaAsamblea, null];

    } catch (error) {
        console.error("Error al crear la asamblea", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getAsambleaService(){
    try {
        const asambleaRepository = AppDataSource.getRepository(Asamblea);
        const fechaActual = new Date().toISOString().split('T')[0];
        
        
        await asambleaRepository
            .createQueryBuilder()
            .update(Asamblea)
            .set({ estado: "no realizada" })
            .where("estado = :estado AND fecha < :fechaActual", { 
                estado: "pendiente", 
                fechaActual: fechaActual 
            })
            .execute();
        
        
        const asamblea = await asambleaRepository.find();

        if(asamblea.length === 0) return [null, "No hay asambleas registradas"];
        return [asamblea, null];
    } catch (error) {
        console.error("Error al obtener asambleas:", error);
        return [null, "Error interno en el servidor"];
    }
}

export async function getAsambleaByIdService(id){
    try {
        const asamblea = await AppDataSource.getRepository(Asamblea).findOne({ where: { id } });

        if(!asamblea) return [null, "No se encontró la asamblea"];
        return [asamblea, null];
    } catch (error) {
        console.error("Error al obtener la asamblea por id:", error);
        return [null, "Error interno en el servidor"];
    }
}

export async function updateAsambleaService(query,body){
    try {
        const { id } = query;
        const { tema, fecha, temasATratar, ...restBody } = body;  
        const asambleaRepository = AppDataSource.getRepository(Asamblea);

        const asambleaFound = await asambleaRepository.findOne({
            where: { id: id },
        });

        if (!asambleaFound) return [null, "No se encontró la asamblea"];

        
        let fechaFinal = fecha;
        if (fecha) {
            let fechaDisponible = new Date(fecha);
            let intentos = 0;
            const maxIntentos = 365; 
            
            while (intentos < maxIntentos) {
                const asambleaConFecha = await asambleaRepository.findOne({ 
                    where: { fecha: fechaDisponible.toISOString().split('T')[0] } 
                });
                
                
                if (!asambleaConFecha || asambleaConFecha.id === parseInt(id)) {
                    fechaFinal = fechaDisponible.toISOString().split('T')[0];
                    break;
                }
                
                
                fechaDisponible.setDate(fechaDisponible.getDate() + 1);
                intentos++;
            }
            
            if (intentos >= maxIntentos) {
                return [null, "No se pudo encontrar una fecha disponible"];
            }
        }

        
        const updateData = fechaFinal ? { fecha: fechaFinal, temasATratar, ...restBody } : { temasATratar, ...restBody };
        
        await asambleaRepository.update(id, updateData);
        return [await asambleaRepository.findOne({where: { id: id}}), null];
    } catch (error) {
        console.error("Error al actualizar la asamblea", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteAsambleaService(query){
    try {
        const { id } = query;
        const asambleaRepository = AppDataSource.getRepository(Asamblea);
        const asambleaFound = await asambleaRepository.findOne({
            where: { id: id },
        });

        if (!asambleaFound) return [null, "No se encontró la asamblea"];

        await asambleaRepository.delete(id);
        return [asambleaFound, null];
    } catch (error) {
        console.error("Error al eliminar la asamblea", error);
        return [null, "Error interno del servidor"];
    }
}