"use strict";
import Aviso from "../entity/aviso.entity.js";
import { AppDataSource } from "../config/configDb.js";
import UserSchema from "../entity/user.entity.js";

export async function crearAvisoService(data){
    try {
        const avisoRepository = AppDataSource.getRepository(Aviso);
        let fechaExpiracionFinal = null;
        if (data.fechaExpiracion) {
            if (typeof data.fechaExpiracion === "string") {
                fechaExpiracionFinal = new Date(data.fechaExpiracion);
            } else {
                fechaExpiracionFinal = data.fechaExpiracion;
            }
        }
        const nuevoAviso = avisoRepository.create({
            descripcion: data.descripcion,
            categoria: data.categoria,
            fecha: data.fecha,
            fechaExpiracion: fechaExpiracionFinal,
            destinatario: data.destinatario || null,
            archivoAdjunto: data.archivoAdjunto || null,
            createdAt: new Date(),
        });
        await avisoRepository.save(nuevoAviso);
        return [nuevoAviso, null];
    }catch (error) {
        console.error("Error al obtener avisos:", error);
        return [null, "Error interno en el servidor"];
    }
}

export async function obtenerEmailsResidentes() {
    const userRepository = AppDataSource.getRepository(UserSchema);
    const users = await userRepository.find({ where: [{ rol: "usuario" }, { rol: "directiva" }] });
    return users.map(u => u.email);
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
        console.log('[modificarAvisoService] id:', id);
        console.log('[modificarAvisoService] camposActualizar:', camposActualizar);

        const avisoFound = await avisoRepository.findOne({
            where: { id: id },
        });

        if (!avisoFound) return [null, "No se encontró el aviso"];

        try {
            await avisoRepository.update(id, camposActualizar);
        } catch (updateError) {
            console.error('[modificarAvisoService] Error en update:', updateError);
            return [null, 'Error interno al actualizar el aviso: ' + updateError.message];
        }
        return [await avisoRepository.findOne({ where: { id: id } }), null];
    } catch (error) {
        console.error("Error al actualizar el aviso", error);
        return [null, "Error interno del servidor"];
    }
}

export async function eliminarAvisoService(id) {
    try {
        const avisoRepository = AppDataSource.getRepository(Aviso);

        const avisoFound = await avisoRepository.findOne({
            where: { id: id },
        });

        if (!avisoFound) return [null, "No se encontró el aviso"];

        await avisoRepository.delete(id);
        return [avisoFound, null];
    } catch (error) {
        console.error("Error al eliminar el aviso", error);
        return [null, "Error interno del servidor"];
    }
}
