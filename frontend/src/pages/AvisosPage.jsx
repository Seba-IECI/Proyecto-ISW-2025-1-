import React, { useEffect, useState } from "react";
import { showSuccessAlert, showErrorAlert, deleteDataAlert } from "../helpers/sweetAlert";
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

function formatDateDMY(dateStr) {
  if (!dateStr) return "";
  const match = dateStr.match(/^\d{4}-\d{2}-\d{2}/);
  if (!match) return dateStr;
  const [year, month, day] = match[0].split('-');
  const dateUTC = new Date(Date.UTC(Number(year), Number(month) , Number(day)));
  const dayUTC = String(dateUTC.getUTCDate()).padStart(2, '0');
  const monthUTC = String(dateUTC.getUTCMonth()).padStart(2, '0');
  const yearUTC = dateUTC.getUTCFullYear();
  return `${dayUTC}-${monthUTC}-${yearUTC}`;
}

function AvisosPage() {
  const [avisosLocal, setAvisosLocal] = useState([]);
  const AVISOS_POR_PAGINA = 5;
  const [pagina, setPagina] = useState(1);
  const { user } = useAuth();
  const { avisos, loading, error, fetchAvisos } = useAvisos();
  const { handleCreate, loading: loadingCreate, error: errorCreate } = useCreateAviso(fetchAvisos);
  const { handleUpdate, loading: loadingUpdate, error: errorUpdate } = useUpdateAviso(fetchAvisos);
  const { handleDelete, loading: loadingDelete, error: errorDelete } = useDeleteAviso(fetchAvisos);

  const todayStr = (() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  })();

  const [form, setForm] = useState({
    descripcion: "",
    categoria: "",
    fecha: todayStr,
    fechaExpiracion: "",
    destinatario: "",
    archivoAdjunto: null,
  });
  const [editId, setEditId] = useState(null);
  const [loadingForm, setLoading] = useState(false);
  const [errorForm, setError] = useState("");

  useEffect(() => {
    fetchAvisos();
  }, []);

  useEffect(() => {
    if (Array.isArray(avisos) && avisosLocal.length === 0) {
      setAvisosLocal(avisos);
    }
  }, [avisos]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "archivoAdjunto") {
      setForm({ ...form, archivoAdjunto: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "fecha") {
        // Al crear, siempre enviar todayStr; al editar, enviar el valor del aviso
        formData.append(key, editId ? value : todayStr);
      } else if (key === "fechaExpiracion") {
        formData.append(key, value);
      } else if (key === "archivoAdjunto") {
        if (value) {
          formData.append(key, value);
        }
      } else {
        formData.append(key, value ?? "");
      }
    });

    try {
      let result;
      if (editId) {
        result = await handleUpdate(editId, formData);
        if (result && !result.error) {
          showSuccessAlert("Aviso modificado correctamente", "El aviso fue modificado exitosamente.");
          setForm({
            descripcion: "",
            categoria: "",
            fecha: todayStr,
            fechaExpiracion: "",
            destinatario: "",
            archivoAdjunto: null,
          });
          setEditId(null);
          setAvisosLocal(prev => prev.map(aviso => aviso.id === editId ? result : aviso));
          fetchAvisos();
        }
        
      } else {
        result = await handleCreate(formData);
        if (result && !result.error) {
          showSuccessAlert("Aviso creado", "El aviso fue creado exitosamente.");
          setForm({
            descripcion: "",
            categoria: "",
            fecha: todayStr,
            fechaExpiracion: "",
            destinatario: "",
            archivoAdjunto: null,
          });
          setEditId(null);
          fetchAvisos();
        } else {
          setError(result?.error || "Error al crear aviso");
          showErrorAlert("Error", result?.error || "Error al crear aviso");
        }
      }
    } catch (err) {
      console.error("Error al crear/modificar aviso:", err);
      if (editId) {
        showErrorAlert("Error al modificar el aviso", err.response?.data?.message || "Error al modificar el aviso");
      } else {
        showErrorAlert("Error", err.response?.data?.message || "Error al crear aviso");
      }
      setError(
        err.response?.data?.message ||
          (editId ? "Error al modificar el aviso" : "Error al crear aviso")
      );
    }
    setLoading(false);
  };

  const handleEdit = (aviso) => {
    setEditId(aviso.id);
    setForm({
      descripcion: aviso.descripcion || "",
      categoria: aviso.categoria || "",
      fecha: aviso.fecha || todayStr,
      fechaExpiracion: aviso.fechaExpiracion || "",
      destinatario: aviso.destinatario || "",
      archivoAdjunto: null
    });
function formatFechaInput(dateStr) {
  const match = dateStr.match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : "";
}
  };

  const handleDeleteAviso = async (id) => {
    const confirmed = await deleteDataAlert("¿Estás seguro de eliminar este aviso?");
    if (!confirmed.isConfirmed) return;
    try {
      const response = await handleDelete(id);
      if (!response || response.error) {
        showErrorAlert("Error", "Error al eliminar el aviso");
function formatFechaInput(dateStr) {
  if (!dateStr) return "";
  // Si ya está en formato yyyy-mm-dd, retorna tal cual
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  // Si viene con hora, extrae solo la parte de fecha
  const match = dateStr.match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : "";
}
        return;
      }
      showSuccessAlert("Aviso eliminado", "El aviso fue eliminado exitosamente.");
      setAvisosLocal(prev => prev.filter(aviso => aviso.id !== id));
    } catch (err) {
      console.error("Error al eliminar aviso:", err);
      showErrorAlert("Error", "Error al eliminar el aviso");
    }
  };
  return (
    <div className={styles.avisosContainer}>
      <div className={styles.avisosHeader}>
        <h1 className={styles.avisosTitle}>Gestión de Avisos</h1>
        <p className={styles.avisosSubtitle}>
          Administra y consulta los avisos importantes de tu condominio. Descarga archivos adjuntos y mantente informado.
        </p>
      </div>

      <div className={styles.avisosContent}>
        <div className={styles.createSection}>
          <h2>{editId ? "Editar Aviso" : "Crear Aviso"}</h2>
          <p>Completa el formulario para crear o editar un aviso.</p>
          {(user?.rol === "admin" || user?.rol === "directiva" || user?.rol === "administrador") && (
            <form className={styles.avisosForm} onSubmit={handleSubmit}>
              {error && <div className={styles.error}>{error}</div>}
              <div className={styles.formGroup}>
                <label htmlFor="descripcion">Descripción *</label>
                <input
                  id="descripcion"
                  type="text"
                  name="descripcion"
                  placeholder="Descripción"
                  value={form.descripcion}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="categoria">Categoría *</label>
                <select
                  id="categoria"
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
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="fecha">Fecha *</label>
                <input
                  id="fecha"
                  type="date"
                  name="fecha"
                  value={editId ? form.fecha : todayStr}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  readOnly={!editId}
                  placeholder="dd-mm-yyyy"
                />
              </div>
              {(form.categoria === "urgente" || form.categoria === "recordatorio") && (
                <div className={styles.formGroup}>
                  <label htmlFor="fechaExpiracion">Fecha de Expiración *</label>
                  <input
                    id="fechaExpiracion"
                    type="date"
                    name="fechaExpiracion"
                    value={form.fechaExpiracion}
                    onChange={handleChange}
                    className={styles.input}
                    required
                    min={form.fecha}
                    placeholder="dd-mm-yyyy"
                  />
                </div>
              )}
              {(form.categoria === "urgente" || form.categoria === "recordatorio") && (
                <div className={styles.formGroup}>
                  <label htmlFor="destinatario">Destinatario</label>
                  <input
                    id="destinatario"
                    type="email"
                    name="destinatario"
                    placeholder="Destinatario (solo para avisos individuales)"
                    value={form.destinatario}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              )}
              <div className={styles.formGroup}>
                <label htmlFor="archivoAdjunto">Archivo Adjunto</label>
                <input
                  id="archivoAdjunto"
                  type="file"
                  name="archivoAdjunto"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              <button className={styles.btnCreateAviso} type="submit" disabled={loading || loadingCreate || loadingUpdate}>
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
        </div>

        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>📋</div>
            <h3>Descripción</h3>
            <p>Agrega detalles claros y precisos sobre el aviso.</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>📅</div>
            <h3>Fechas</h3>
            <p>Define la vigencia y expiración del aviso.</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>📎</div>
            <h3>Adjuntos</h3>
            <p>Incluye archivos relevantes para los residentes.</p>
          </div>
        </div>

        <div className={styles.list}>
        <h3>Listado de Avisos</h3>
        {loading ? (
          <div>Cargando...</div>
        ) : avisos.length === 0 ? (
          <div>No hay avisos registrados.</div>
        ) : (
          <div style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #e0e0e0", borderRadius: "8px" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {(user?.rol === "admin" || user?.rol === "directiva" || user?.rol === "administrador") && (
                    <th>Acciones</th>
                  )}
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>Fecha</th>
                  <th>Expira</th>
                  <th>Destinatario</th>
                  <th>Adjunto</th>
                </tr>
              </thead>
              <tbody>
                {avisosLocal.map((aviso) => (
                  <tr key={aviso.id}>
                    {(user?.rol === "admin" || user?.rol === "directiva" || user?.rol === "administrador") && (
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
                    <td>{aviso.descripcion}</td>
                    <td>{aviso.categoria}</td>
                    <td>{formatDateDMY(aviso.fecha)}</td>
                    <td>{aviso.fechaExpiracion ? formatDateDMY(aviso.fechaExpiracion) : "-"}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default AvisosPage;