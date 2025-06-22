"use strict";
import { EntitySchema } from "typeorm";

const AvisoSchema = new EntitySchema({
  name: "Avisos",
  tableName: "avisos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    descripcion: {
      type: "varchar",
      length: 1000,
      nullable: false,
    },
    categoria: { // Urgente, General, Recordatorio
      type: "varchar",
      length: 13,
      nullable: false,
    },
    fecha: {
      type: "date",
      nullable: false,
    },
    destinatario: {
      type: "varchar",
      length: 255,
      nullable: true, // null = aviso general
    },
    fechaExpiracion: {
      type: "timestamp with time zone",
      nullable: true, // obligatorio para urgente y recordatorio
    },
    archivoAdjunto: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
   
  },
});

export default AvisoSchema;