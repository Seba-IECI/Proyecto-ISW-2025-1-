import axios from './root.service.js';

export async function subirasamblea (data){
    try {
        const response = await axios.post('/asamblea/crearAsamblea',data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getAsamblea() {
    try {
        const response = await axios.get('/asamblea/getAsamblea');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getAsambleaById(id) {
    try {
        const response = await axios.get(`/asamblea/getAsamblea/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateAsamblea(id, data) {
    try {
        const response = await axios.patch(`/asamblea/updateAsamblea/${id}`, data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function deleteAsamblea(id) {
    try {
        const response = await axios.delete(`/asamblea/deleteAsamblea/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}