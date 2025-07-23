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
      nullable: false,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});

export default ActaSchema;