"use strict";

import Joi from "joi";


export const actaNameValidation = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[a-zA-Z0-9\sáéíóúüñÁÉÍÓÚÜÑ.,;:()\-_@#$%&+=!¡¿?]+$/)
    .required()
    .messages({
      "string.empty": "El nombre del acta es requerido",
      "string.min": "El nombre del acta debe tener al menos 3 caracteres",
      "string.max": "El nombre del acta no puede exceder los 100 caracteres",
      "string.pattern.base": "El nombre del acta contiene caracteres no válidos. No se permiten: \\ / : * ? \" < > |",
      "any.required": "El nombre del acta es requerido"
    })
    .custom((value, helpers) => {
      
      if (value.trim().length === 0) {
        return helpers.error("string.empty");
      }
      
     
      const hasValidContent = /[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ]/.test(value);
      if (!hasValidContent) {
        return helpers.message("El nombre del acta debe contener al menos una letra o número");
      }
      
      return value;
    })
});


export const actaUpdateValidation = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[a-zA-Z0-9\sáéíóúüñÁÉÍÓÚÜÑ.,;:()\-_@#$%&+=!¡¿?]+$/)
    .optional()
    .messages({
      "string.empty": "El nombre del acta no puede estar vacío",
      "string.min": "El nombre del acta debe tener al menos 3 caracteres",
      "string.max": "El nombre del acta no puede exceder los 100 caracteres",
      "string.pattern.base": "El nombre del acta contiene caracteres no válidos. No se permiten: \\ / : * ? \" < > |"
    })
    .custom((value, helpers) => {
      if (value && value.trim().length === 0) {
        return helpers.error("string.empty");
      }
      
      if (value) {
        const hasValidContent = /[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ]/.test(value);
        if (!hasValidContent) {
          return helpers.message("El nombre del acta debe contener al menos una letra o número");
        }
      }
      
      return value;
    })
});


export const validateActaCreation = (req, res, next) => {
  const { error } = actaNameValidation.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: "Error de validación",
      details: error.details[0].message
    });
  }
  
  next();
};


export const validateActaUpdate = (req, res, next) => {
  const { error } = actaUpdateValidation.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: "Error de validación",
      details: error.details[0].message
    });
  }
  
  next();
};
