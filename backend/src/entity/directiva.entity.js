"use strict";
import { EntitySchema } from "typeorm";

const DirectivaSchema = new EntitySchema({
  name: "Directiva",
  tableName: "directiva",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombreCompleto: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    rut: {
      type: "varchar",
      length: 12,
      nullable: false,
      unique: true,
    },
    email: {
      type: "varchar",
      length: 255,
      nullable: false,
      unique: true,
    },
    cargo: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    password: {
      type: "varchar",
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
  indices: [
    {
      name: "IDX_DIRECTIVA",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_DIRECTIVA_RUT",
      columns: ["rut"],
      unique: true,
    },
    {
      name: "IDX_DIRECTIVA_EMAIL",
      columns: ["email"],
      unique: true,
    },
  ],
});

export default DirectivaSchema;