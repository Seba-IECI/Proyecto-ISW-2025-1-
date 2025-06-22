import { sendEmail } from '../services/email.service.js';
import {
    handleErrorServer,
    handleSuccess,
}from "../handlers/responseHandlers.js";

export const sendCustomEmail = async (req, res) => {
    let { email, subject, message } = req.body;

    
    if (Array.isArray(email)) {
        email = email.join(','); 
    } else if (typeof email !== 'string') {
        return res.status(400).json({ message: 'El campo email debe ser un string o un array de strings' });
    }

    try {
        const info = await sendEmail(
            email,
            subject,
            message,
            `<p>${message}</p>`,
        );

        handleSuccess(res, 200,"Correo enviado con exito", info);
    } catch (error) {
        handleErrorServer(res, 500, "Error al enviar el correo", error.message);
    }
}
