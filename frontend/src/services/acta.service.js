import axios from './root.service.js';

export async function subirActa(formData) {
    try {
        const response = await axios.post('/acta', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getActas() {
    try {
        const response = await axios.get('/acta');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function actualizarActa(id, formData) {
    try {
        const response = await axios.patch(`/acta/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function eliminarActa(id) {
    try {
        const response = await axios.delete(`/acta/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}