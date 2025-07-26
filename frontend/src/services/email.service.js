import axios from './root.service.js'

export async function sendEmail(emailData) {
    try {
        const response = await axios.post('/email/send', emailData);
        return response.data;
    } catch (error) {
        return error.response.data
    }
}