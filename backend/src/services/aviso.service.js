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