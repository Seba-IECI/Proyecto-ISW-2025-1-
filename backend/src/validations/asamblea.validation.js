"use strict";
import Joi from "joi";

export const asambleaQueryValidation = Joi.object({
    tema: Joi.string()
    .required()
    .min(3)
    .max(90)
    .pattern(/^[a-zA-Z0-9\s]+$/)
    .messages({
        "string.empty": "El tema es obligatorio",
        "string.min": "El tema debe tener al menos 3 caracteres",
        "string.max": "El tema no puede exceder los 90 caracteres",
        "string.pattern.base": "El tema solo puede contener letras, números y espacios"
    }),
    lugar: Joi.string()
    .required()
    .min(3)
    .max(90)
    .pattern(/^[a-zA-Z0-9\s]+$/)
    .messages({
        "string.empty": "El lugar es obligatorio", 
        "string.min": "El lugar debe tener al menos 3 caracteres",
        "string.max": "El lugar no puede exceder los 90 caracteres",
        "string.pattern.base": "El lugar solo puede contener letras, números y espacios"
        }),
    fecha: Joi.date()
    .required()
    .min("now")
    .messages({
        "data.empty": "La fecha es obligatoria",
        "date.min": "La fecha debe ser una fecha futura"
    })
});

export const asambleaUpdateValidation = Joi.object({
    lugar: Joi.string()
    .required()
    .min(3)
    .max(90)
    .pattern(/^[a-zA-Z0-9\s]+$/)
    .messages({
        "string.empty": "El lugar es obligatorio", 
        "string.min": "El lugar debe tener al menos 3 caracteres",
        "string.max": "El lugar no puede exceder los 90 caracteres",
        "string.pattern.base": "El lugar solo puede contener letras, números y espacios"
    }),
    fecha: Joi.date()
    .required()
    .min("now")
    .messages({
        "data.empty": "La fecha es obligatoria",
        "date.min": "La fecha debe ser una fecha futura"
    })
});
