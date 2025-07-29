"use strict"

import { EntitySchema } from "typeorm";

const ActaSchema = new EntitySchema({
  name: "Acta",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    archivo: {
      type: "varchar",
      length: 500,
      nullable: false,
    },
    subidoPor: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    asambleaId: {
      type: "int",
      nullable: true,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    asamblea: {
      target: "asamblea",
      type: "many-to-one",
      joinColumn: {
        name: "asambleaId",
      },
      nullable: true,
    },
  },
});

export default ActaSchema;