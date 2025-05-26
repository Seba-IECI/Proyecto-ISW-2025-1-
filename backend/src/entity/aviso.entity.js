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
      unique: true,
    },
    fecha: {
      type: "date",
      nullable: false,
    },
   
  },
});

export default AvisoSchema;