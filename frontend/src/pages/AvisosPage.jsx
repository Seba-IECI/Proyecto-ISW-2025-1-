import React, { useEffect, useState } from "react";
import styles from "../styles/AvisosPage.module.css"; 
import { useAuth } from "../context/AuthContext"; 
import { useAvisos } from "../hooks/Avisos/useAvisos";
import { useCreateAviso } from "../hooks/Avisos/useCreateAviso";
import { useUpdateAviso } from "../hooks/Avisos/useUpdateAviso";
import { useDeleteAviso } from "../hooks/Avisos/useDeleteAviso";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const categorias = [
  { value: "urgente", label: "Urgente" },
  { value: "general", label: "General" },
  { value: "recordatorio", label: "Recordatorio" },
];

function AvisosPage() {
  const { user } = useAuth();
  const { avisos, loading, error, fetchAvisos } = useAvisos();
  const { handleCreate, loading: loadingCreate, error: errorCreate } = useCreateAviso(fetchAvisos);
  const { handleUpdate, loading: loadingUpdate, error: errorUpdate } = useUpdateAviso(fetchAvisos);
  const { handleDelete, loading: loadingDelete, error: errorDelete } = useDeleteAviso(fetchAvisos);

  const [form, setForm] = useState({
    descripcion: "",
    categoria: "",
    fecha: "",
    fechaExpiracion: "",
    destinatario: "",
    archivoAdjunto: null,
  });
  const [editId, setEditId] = useState(null);
  const [loadingForm, setLoading] = useState(false);
  const [errorForm, setError] = useState("");

  // Cargar avisos
  useEffect(() => {
    fetchAvisos();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "archivoAdjunto") {
      setForm({ ...form, archivoAdjunto: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Validar campos antes de enviar
  const validateForm = () => {
    if (!form.descripcion || !form.categoria || !form.fecha) {
      setError("Descripción, categoría y fecha son obligatorios");
      return false;
    }
    if (
      (form.categoria === "urgente" || form.categoria === "recordatorio") &&
      !form.fechaExpiracion
    ) {
      setError("La fecha de expiración es obligatoria para esta categoría");
      return false;
    }
    if (
      form.destinatario &&
      form.categoria === "general"
    ) {
      setError("No puedes seleccionar destinatario para avisos generales");
      return false;
    }
    if (
      form.archivoAdjunto &&
      form.archivoAdjunto.size > 5 * 1024 * 1024
    ) {
      setError("El archivo adjunto no puede superar los 5MB");
      return false;
    }
    return true;
  };

  // Crear o modificar aviso
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      if (editId) {
        await handleUpdate(editId, formData);
      } else {
        await handleCreate(formData);
      }
      setForm({
        descripcion: "",
        categoria: "",
        fecha: "",
        fechaExpiracion: "",
        destinatario: "",
        archivoAdjunto: null,
      });
      setEditId(null);
      fetchAvisos();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al guardar el aviso"
      );
    }
    setLoading(false);
  };

  // Editar aviso
  const handleEdit = (aviso) => {
    setEditId(aviso.id);
    setForm({
      descripcion: aviso.descripcion,
      categoria: aviso.categoria,
      fecha: aviso.fecha?.slice(0, 10),
      fechaExpiracion: aviso.fechaExpiracion?.slice(0, 10) || "",
      destinatario: aviso.destinatario || "",
      archivoAdjunto: null,
    });
    window.scrollTo(0, 0);
  };

  // Eliminar aviso
  const handleDeleteAviso = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este aviso?")) return;
    setLoading(true);
    try {
      await handleDelete(id);
      fetchAvisos();
    } catch (err) {
      setError("Error al eliminar aviso");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Gestión de Avisos</h2>
      {(user?.rol === "admin" || user?.rol === "directiva") && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>{editId ? "Editar Aviso" : "Crear Aviso"}</h3>
          {error && <div className={styles.error}>{error}</div>}
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className={styles.input}
            required
          >
            <option value="">Selecciona categoría</option>
            {categorias.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className={styles.input}
            required
          />
          {(form.categoria === "urgente" || form.categoria === "recordatorio") && (
            <input
              type="date"
              name="fechaExpiracion"
              value={form.fechaExpiracion}
              onChange={handleChange}
              className={styles.input}
              required
            />
          )}
          {(form.categoria === "urgente" || form.categoria === "recordatorio") && (
            <input
              type="email"
              name="destinatario"
              placeholder="Destinatario (solo para avisos individuales)"
              value={form.destinatario}
              onChange={handleChange}
              className={styles.input}
            />
          )}
          <input
            type="file"
            name="archivoAdjunto"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
            className={styles.input}
          />
          <button className={styles.button} type="submit" disabled={loading || loadingCreate || loadingUpdate}>
            {editId ? "Actualizar" : "Crear"}
          </button>
          {editId && (
            <button
              type="button"
              className={styles.buttonCancel}
              onClick={() => {
                setEditId(null);
                setForm({
                  descripcion: "",
                  categoria: "",
                  fecha: "",
                  fechaExpiracion: "",
                  destinatario: "",
                  archivoAdjunto: null,
                });
              }}
            >
              Cancelar
            </button>
          )}
        </form>
      )}

      <div className={styles.list}>
        <h3>Listado de Avisos</h3>
        {loading ? (
          <div>Cargando...</div>
        ) : avisos.length === 0 ? (
          <div>No hay avisos registrados.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Fecha</th>
                <th>Expira</th>
                <th>Destinatario</th>
                <th>Adjunto</th>
                {(user?.rol === "admin" || user?.rol === "directiva") && (
                  <th>Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {avisos.map((aviso) => (
                <tr key={aviso.id}>
                  <td>{aviso.descripcion}</td>
                  <td>{aviso.categoria}</td>
                  <td>{aviso.fecha?.slice(0, 10)}</td>
                  <td>{aviso.fechaExpiracion?.slice(0, 10) || "-"}</td>
                  <td>{aviso.destinatario || "Todos"}</td>
                  <td>
                    {aviso.archivoAdjunto ? (
                      <a
                        href={`${API_URL.replace("/api", "")}/uploads/avisos/${aviso.archivoAdjunto}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Descargar
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  {(user?.rol === "admin" || user?.rol === "directiva") && (
                    <td>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleEdit(aviso)}
                      >
                        Editar
                      </button>
                      <button
                        className={styles.actionBtnDelete}
                        onClick={() => handleDeleteAviso(aviso.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AvisosPage;