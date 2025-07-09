import Joi from "joi";

export const avisoValidation = Joi.object({
  descripcion: Joi.string().min(5).max(1000).required().custom((value, helpers) => {
    if (typeof value === "string" && value.trim().length === 0) {
      return helpers.message("La descripción no puede estar vacía o contener solo espacios en blanco.");
    }
    return value;
  }),
  categoria: Joi.string().valid("urgente", "general", "recordatorio").required(),
  fecha: Joi.date().required().custom((value, helpers) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaValue = new Date(value);
    fechaValue.setHours(0, 0, 0, 0);
    if (fechaValue.getTime() !== hoy.getTime()) {
      return helpers.message("La fecha del aviso solo puede ser la fecha actual.");
    }
    return value;
  }),
  fechaExpiracion: Joi.when("categoria", {
    is: Joi.valid("urgente", "recordatorio"),
    then: Joi.date().required().custom((value, helpers) => {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaExp = new Date(value);
      fechaExp.setHours(0, 0, 0, 0);
      const unAnioDespues = new Date(hoy);
      unAnioDespues.setFullYear(hoy.getFullYear() + 1);
      if (fechaExp <= hoy) {
        return helpers.message("La fecha de expiración debe ser mayor a la fecha actual.");
      }
      if (fechaExp > unAnioDespues) {
        return helpers.message("La fecha de expiración no puede ser mayor a 1 año desde hoy.");
      }
      return value;
    }).messages({
      "any.required": "La fecha de expiración es obligatoria para avisos urgentes o de recordatorio.",
    }),
    otherwise: Joi.optional(),
  }),
  destinatario: Joi.string().email().allow(null, ""),
  archivoAdjunto: Joi.any(),
}).custom((value, helpers) => {
  if (
    value.destinatario &&
    value.categoria === "general"
  ) {
    return helpers.message("No se puede enviar un aviso individual con categoría general.");
  }
  return value;
});