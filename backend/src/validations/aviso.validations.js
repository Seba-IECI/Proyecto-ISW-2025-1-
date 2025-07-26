import Joi from "joi";

export const avisoValidation = Joi.object({
  descripcion: Joi.string().min(5).max(1000).required().custom((value, helpers) => {
    if (typeof value === "string" && value.trim().length === 0) {
      return helpers.message("La descripción no puede estar vacía o contener solo espacios en blanco.");
    }
    return value;
  }),
  categoria: Joi.string().valid("urgente", "general", "recordatorio").required(),
  fecha: Joi.alternatives()
    .try(Joi.date(), Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/))
    .required()
    .custom((value, helpers) => {
      let fechaValue;
      if (typeof value === "string") {
        fechaValue = new Date(value);
      } else if (value instanceof Date) {
        fechaValue = value;
      } else {
        return helpers.message("Formato de fecha inválido.");
      }

      const hoyLocal = new Date();
      const hoyUTC = new Date();

      const sameDay = (d1, d2) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

      if (sameDay(fechaValue, hoyLocal) || sameDay(fechaValue, new Date(Date.UTC(hoyUTC.getUTCFullYear(), hoyUTC.getUTCMonth(), hoyUTC.getUTCDate())))) {
        return value;
      }
      return helpers.message("La fecha del aviso solo puede ser la fecha actual.");
    }),
  fechaExpiracion: Joi.when("categoria", {
    is: Joi.valid("urgente", "recordatorio"),
    then: Joi.date().required().custom((value, helpers) => {
      const hoy = new Date();
      const year = hoy.getUTCFullYear();
      const month = String(hoy.getUTCMonth() + 1).padStart(2, '0');
      const day = String(hoy.getUTCDate()).padStart(2, '0');
      const hoyStr = `${year}-${month}-${day}`;

      const fechaExp = new Date(value);
      const yearE = fechaExp.getFullYear();
      const monthE = String(fechaExp.getMonth() + 1).padStart(2, '0');
      const dayE = String(fechaExp.getDate()).padStart(2, '0');
      const fechaExpStr = `${yearE}-${monthE}-${dayE}`;

      const unAnioDespues = new Date(hoy);
      unAnioDespues.setFullYear(hoy.getFullYear() + 1);
      const yearA = unAnioDespues.getFullYear();
      const monthA = String(unAnioDespues.getMonth() + 1).padStart(2, '0');
      const dayA = String(unAnioDespues.getDate()).padStart(2, '0');
      const unAnioDespuesStr = `${yearA}-${monthA}-${dayA}`;

      if (fechaExpStr <= hoyStr) {
        return helpers.message("La fecha de expiración debe ser mayor a la fecha actual.");
      }
      if (fechaExpStr > unAnioDespuesStr) {
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