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


export const sendNewAsambleaNotification = async (usuarios, asamblea) => {
    try {
        const emails = usuarios.map(user => user.email);
        
        if (emails.length === 0) {
            console.log("No hay usuarios para notificar");
            return;
        }

        const fechaFormateada = new Date(asamblea.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const subject = `Nueva Asamblea Convocada: ${asamblea.tema}`;
        
        const textContent = `
Se ha convocado una nueva asamblea:

Tema: ${asamblea.tema}
Lugar: ${asamblea.lugar}
Fecha y Hora: ${fechaFormateada}
Creado por: ${asamblea.creador}

Temas a tratar:
${asamblea.temasATratar}

Por favor, asegúrese de asistir puntualmente.

Saludos,
Sistema de Gestión de Condominio
        `;

        const htmlContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
        Nueva Asamblea Convocada
    </h2>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2980b9; margin-top: 0;">${asamblea.tema}</h3>
        
        <div style="margin: 15px 0;">
            <strong style="color: #34495e;">📍 Lugar:</strong> ${asamblea.lugar}
        </div>
        
        <div style="margin: 15px 0;">
            <strong style="color: #34495e;">📅 Fecha y Hora:</strong> ${fechaFormateada}
        </div>
        
        <div style="margin: 15px 0;">
            <strong style="color: #34495e;">👤 Convocado por:</strong> ${asamblea.creador}
        </div>
    </div>
    
    <div style="margin: 20px 0;">
        <h4 style="color: #2980b9;">📋 Temas a tratar:</h4>
        <div style="background-color: #ecf0f1; padding: 15px; border-radius: 5px; white-space: pre-line;">
${asamblea.temasATratar}
        </div>
    </div>
    
    <div style="background-color: #e8f6ff; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
        <p style="margin: 0; color: #2c3e50;">
            <strong>Importante:</strong> Por favor, asegúrese de asistir puntualmente a la asamblea.
        </p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #7f8c8d;">
        <p>Sistema de Gestión de Condominio</p>
        <p style="font-size: 12px;">Este es un mensaje automático, por favor no responder.</p>
    </div>
</div>
        `;

        const transporter = nodemailer.createTransport({
            service: emailConfig.service,
            auth: {
                user: emailConfig.user,
                pass: emailConfig.pass,
            },
        });

        await transporter.sendMail({
            from: `"Sistema de Gestión de Condominio" <${emailConfig.user}>`,
            to: emails,
            subject,
            text: textContent,
            html: htmlContent,
        });
        
        console.log(`Notificación de asamblea enviada a ${emails.length} usuarios`);
        
    } catch (error) {
        console.error("Error enviando notificación de asamblea:", error);
        throw new Error("Error enviando notificación de asamblea: " + error.message);
    }
};