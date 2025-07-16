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
        
        await updateAsambleasVencidas();
        
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

        
        if (fecha) {
            const asambleaConFecha = await asambleaRepository.findOne({ 
                where: { fecha } 
            });
            
            if (asambleaConFecha && asambleaConFecha.id !== parseInt(id)) {
                return [null, "Ya existe una asamblea para la fecha indicada"];
            }
        }

        
        const updateData = fecha ? { fecha, temasATratar, ...restBody } : { temasATratar, ...restBody };
        
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

export async function changeAsambleaEstadoService(asambleaId, nuevoEstado) {
    try {
        const asambleaRepository = AppDataSource.getRepository(Asamblea);
        
        
        const asamblea = await asambleaRepository.findOne({
            where: { id: asambleaId }
        });
        
        if (!asamblea) {
            return [null, "No se encontró la asamblea"];
        }
        
        
        const estadosValidos = ["pendiente", "realizada", "no realizada"];
        if (!estadosValidos.includes(nuevoEstado)) {
            return [null, "Estado inválido. Los estados válidos son: pendiente, realizada, no realizada"];
        }
        
        
        if (asamblea.estado !== "pendiente" && nuevoEstado === "realizada") {
            return [null, "Solo se puede cambiar a 'realizada' desde estado 'pendiente'"];
        }
        
        
        const fechaActual = new Date();
        const fechaAsamblea = new Date(asamblea.fecha);
        fechaAsamblea.setHours(23, 59, 59, 999); 
        
        if (nuevoEstado === "realizada" && fechaActual > fechaAsamblea) {
            return [null, "No se puede cambiar a 'realizada' después de la fecha programada"];
        }
        
        
        await asambleaRepository.update(asambleaId, { estado: nuevoEstado });
        
        const asambleaActualizada = await asambleaRepository.findOne({
            where: { id: asambleaId }
        });
        
        return [asambleaActualizada, null];
        
    } catch (error) {
        console.error("Error al cambiar el estado de la asamblea:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateAsambleasVencidas() {
    try {
        const asambleaRepository = AppDataSource.getRepository(Asamblea);
        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0); 
        
        
        const result = await asambleaRepository
            .createQueryBuilder()
            .update(Asamblea)
            .set({ estado: "no realizada" })
            .where("estado = :estado AND fecha < :fechaActual", { 
                estado: "pendiente", 
                fechaActual: fechaActual.toISOString().split('T')[0]
            })
            .execute();
        
        return [result.affected, null];
        
    } catch (error) {
        console.error("Error al actualizar asambleas vencidas:", error);
        return [null, "Error interno del servidor"];
    }
}


export async function verificarEstadosAsambleas() {
    try {
        const [cantidadActualizada, error] = await updateAsambleasVencidas();
        
        if (error) {
            console.error("Error al verificar estados de asambleas:", error);
            return [null, error];
        }
        
        console.log(`Se actualizaron ${cantidadActualizada} asambleas a estado 'no realizada'`);
        return [cantidadActualizada, null];
        
    } catch (error) {
        console.error("Error en verificación automática de estados:", error);
        return [null, "Error interno del servidor"];
    }
}