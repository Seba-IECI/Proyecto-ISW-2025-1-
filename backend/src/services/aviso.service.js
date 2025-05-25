"use strict";
import Aviso from "../entity/aviso.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function crearAvisoService(query){
    try {
        const {descripcion,categoria,fecha}= query;
        const avisoRepository = AppDataSource.getRepository(Aviso);

        const nuevoAviso = avisoRepository.create({
            descripcion,
            categoria,
            fecha,
            createdAt: new Date(),
        });

        await avisoRepository.save(nuevoAviso);
        return [nuevoAviso, null];

    } catch (error) {
        console.error("Error al crear el aviso", error);
        return [null, "Error interno del servidor"];
    }
}

export async function obtenerAvisosService(){
    try {
        const aviso = await AppDataSource.getRepository(Aviso).find();

        if(aviso.length === 0) return [null, "No hay avisos registrados"];
        return [aviso, null];
    } catch (error) {
        console.error("Error al obtener avisos:", error);
        return [null, "Error interno en el servidor"];
    }
}

export async function modificarAvisoService(id, camposActualizar) {
    try {
        const avisoRepository = AppDataSource.getRepository(Aviso);

        const avisoFound = await avisoRepository.findOne({
            where: { id: id },
        });

        if (!avisoFound) return [null, "No se encontró el aviso"];

        await avisoRepository.update(id, camposActualizar);
        return [await avisoRepository.findOne({ where: { id: id } }), null];
    } catch (error) {
        console.error("Error al actualizar el aviso", error);
        return [null, "Error interno del servidor"];
    }
}
