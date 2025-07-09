import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getAuthHeader() {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getAvisos = async () => {
  const res = await axios.get(`${API_URL}/aviso/obtenerAvisos`, {
    headers: getAuthHeader(),
  });
  return res.data.data || [];
};

export const createAviso = async (formData) => {
  const res = await axios.post(`${API_URL}/aviso/crearAviso`, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateAviso = async (id, formData) => {
  const res = await axios.patch(`${API_URL}/aviso/modificarAviso/${id}`, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteAviso = async (id) => {
  const res = await axios.delete(`${API_URL}/aviso/eliminarAviso/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};