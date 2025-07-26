import nodemailer from 'nodemailer';
import { emailConfig } from "../config/configEnv.js";

/**
 * Envía un correo electrónico con opción de adjuntar archivo y agregar enlace al adjunto.
 * @param {string|string[]} to - Destinatario(s)
 * @param {string} subject - Asunto
 * @param {string} text - Texto plano
 * @param {string} html - HTML del correo
 * @param {Object} [attachment] - Objeto { filename, path, url } para adjuntar archivo y agregar enlace
 */
export const sendEmail = async (to, subject, text, html, attachment = null) => {
    try {
        const transporter = nodemailer.createTransport({
            service: emailConfig.service,
            auth: {
                user: emailConfig.user,
                pass: emailConfig.pass,
            },
            // Timeout explícito para evitar cuelgues
            socketTimeout: 10000,
            connectionTimeout: 10000,
        });

        let mailOptions = {
            from: `"Ingeniería de Software 2025-1" <${emailConfig.user}>`,
            to,
            subject,
            text,
            html,
        };

        if (attachment && attachment.path && attachment.filename) {
            mailOptions.attachments = [
                {
                    filename: attachment.filename,
                    path: attachment.path,
                },
            ];
            if (attachment.url) {
                mailOptions.html += `<br/><br/>Descargar archivo adjunto: <a href="${attachment.url}">${attachment.filename}</a>`;
            }
        }

        // Logging antes de enviar
        console.log('[EMAIL SERVICE] Enviando correo:', { to, subject, text, html });
        const result = await transporter.sendMail(mailOptions);
        console.log('[EMAIL SERVICE] Correo enviado:', result);
        return mailOptions;
    } catch (error) {
        console.error("Error enviando el correo: %s", error.message);
        // No lanzar error, solo loguear y continuar para evitar cuelgue
        return null;
    }
};