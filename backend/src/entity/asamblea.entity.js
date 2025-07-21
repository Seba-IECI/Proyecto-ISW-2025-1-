"use strict";
import { EntitySchema } from "typeorm";

const AsambleaSchema = new EntitySchema({
    name: "asamblea",
    tableName: "asamblea",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        tema:{
            type: "varchar",
            length: 255,
            nullable: false,
        },
        lugar:{
            type: "varchar",
            length: 255,
            nullable: false,
        },
        fecha:{
            type: "timestamp",
            nullable: false,
        },
        estado: {
            type: "varchar",
            length: 20,
            nullable: false,
            default: "pendiente"
        },
        creador: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        temasATratar: {
            type: "text",
            nullable: true,
        },
        createdAt:{
          type: "timestamp with time zone",
          default: () => "CURRENT_TIMESTAMP",
          nullable: false,
        },
    },
});

export default AsambleaSchema;
