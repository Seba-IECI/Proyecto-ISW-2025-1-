"use strict";
import Asamblea from "../entity/asamblea.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function crearAsambleaService(query){
    try {
        const {tema,lugar,fecha}= query;
        const asambleaRepository = AppDataSource.getRepository(Asamblea);

        const nuevaAsamblea = asambleaRepository.create({
            tema,
            lugar,
            fecha,
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
        const asamblea = await AppDataSource.getRepository(Asamblea).find();

        if(asamblea.length === 0) return [null, "No hay asambleas registradas"];
        return [asamblea, null];
    } catch (error) {
        console.error("Error al obtener asambleas:", error);
        return [null, "Error interno en el servidor"];
    }
}
