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
      length: 1500,
      nullable: false,
    },
    categoria: {
      type: "varchar",
      length: 13,
      nullable: false,
      unique: true,
    },
    fecha: {
      type: "date",
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
});

export default AvisoSchema;