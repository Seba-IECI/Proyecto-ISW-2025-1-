import nodemailer from 'nodemailer';
import {emailConfig} from "../config/configEnv.js"

export const sendEmail = async (to, subject, text, html) => {
    try {
        const trasnporter = nodemailer.createTransport({
            service: emailConfig.service,
            auth: {
                user: emailConfig.user,
                pass: emailConfig.pass,
            },
        });

        const mailOptions = {
            from: `"Ingeneria de Software 2025 - 1" <${emailConfig.user}>`,
            to: to,
            subject: subject,
            text: text,
            html: html,
        };
        await trasnporter.sendMail(mailOptions);

        return mailOptions;
    } catch (error) {
        console.error("Error enviando el correo: %s", error.message);
        throw new Error("Error enviando el correo" + error.message);
    }
}