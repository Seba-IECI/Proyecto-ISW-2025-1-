import Joi from "joi";

export const avisoValidation = Joi.object({
  descripcion: Joi.string().min(5).max(1000).required(),
  categoria: Joi.string().valid("urgente", "general", "recordatorio").required(),
  fecha: Joi.date().required(),
  fechaExpiracion: Joi.when("categoria", {
    is: Joi.valid("urgente", "recordatorio"),
    then: Joi.date().required().messages({
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