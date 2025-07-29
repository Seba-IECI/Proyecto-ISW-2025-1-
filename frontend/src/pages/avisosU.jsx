import React, { useState } from "react";
import styles from "../styles/AvisosPage.module.css"; 
import { useAuth } from "../context/AuthContext"; 
import { useAvisos } from "../hooks/Avisos/useAvisos";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function formatDateDMY(dateStr) {
  if (!dateStr) return "";
  const match = dateStr.match(/^\d{4}-\d{2}-\d{2}/);
  if (!match) return dateStr;
  const [year, month, day] = match[0].split('-');
  const dateUTC = new Date(Date.UTC(Number(year), Number(month), Number(day)));
  const dayUTC = String(dateUTC.getUTCDate()).padStart(2, '0');
  const monthUTC = String(dateUTC.getUTCMonth()).padStart(2, '0');
  const yearUTC = dateUTC.getUTCFullYear();
  return `${dayUTC}-${monthUTC}-${yearUTC}`;
}

function AvisosU() {
  const AVISOS_POR_PAGINA = 5;
  const [pagina, setPagina] = useState(1);
  const { user } = useAuth();
  const { avisos, loading, error } = useAvisos();

  // Filtrar avisos vigentes (no expirados)
  const avisosVigentes = Array.isArray(avisos) ? avisos.filter(aviso => {
    if (!aviso.fechaExpiracion) return true;
    const fechaExpiracion = new Date(aviso.fechaExpiracion);
    const hoy = new Date();
    return fechaExpiracion >= hoy;
  }) : [];

  // Filtrar avisos por categoría si es necesario
  const [filtroCategoria, setFiltroCategoria] = useState('');
  
  const avisosFiltrados = filtroCategoria 
    ? avisosVigentes.filter(aviso => aviso.categoria === filtroCategoria)
    : avisosVigentes;

  // Paginación
  const inicioIndice = (pagina - 1) * AVISOS_POR_PAGINA;
  const finIndice = inicioIndice + AVISOS_POR_PAGINA;
  const avisosPagina = avisosFiltrados.slice(inicioIndice, finIndice);
  const totalPaginas = Math.ceil(avisosFiltrados.length / AVISOS_POR_PAGINA);

  const handlePaginaAnterior = () => {
    if (pagina > 1) setPagina(pagina - 1);
  };

  const handlePaginaSiguiente = () => {
    if (pagina < totalPaginas) setPagina(pagina + 1);
  };

  return (
    <div className={styles.avisosContainer}>
      <div className={styles.avisosHeader}>
        <h1 className={styles.avisosTitle}>Avisos del Condominio</h1>
        <p className={styles.avisosSubtitle}>
          Consulta los avisos importantes de tu condominio. Descarga archivos adjuntos y mantente informado.
        </p>
      </div>

      <div className={styles.avisosContent}>
        {/* Sección de información */}
        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>📢</div>
            <h3>Avisos Importantes</h3>
            <p>Mantente al día con las comunicaciones oficiales del condominio.</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>📅</div>
            <h3>Fechas de Vigencia</h3>
            <p>Revisa las fechas de expiración de cada aviso.</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>📎</div>
            <h3>Documentos Adjuntos</h3>
            <p>Descarga los archivos relacionados con cada aviso.</p>
          </div>
        </div>

        {/* Filtros */}
        <div className={styles.filtersSection}>
          <div className={styles.formGroup}>
            <label htmlFor="filtroCategoria">Filtrar por Categoría:</label>
            <select
              id="filtroCategoria"
              value={filtroCategoria}
              onChange={(e) => {
                setFiltroCategoria(e.target.value);
                setPagina(1); // Resetear a la primera página al filtrar
              }}
              className={styles.input}
            >
              <option value="">Todas las categorías</option>
              <option value="urgente">Urgente</option>
              <option value="general">General</option>
              <option value="recordatorio">Recordatorio</option>
            </select>
          </div>
        </div>

        {/* Lista de avisos */}
        <div className={styles.list}>
          <div className={styles.listHeader}>
            <h3>Avisos Vigentes</h3>
            <p>Total de avisos: {avisosFiltrados.length}</p>
          </div>
          
          {loading ? (
            <div className={styles.loadingMessage}>Cargando avisos...</div>
          ) : error ? (
            <div className={styles.errorMessage}>Error al cargar los avisos: {error}</div>
          ) : avisosFiltrados.length === 0 ? (
            <div className={styles.emptyMessage}>
              {filtroCategoria 
                ? `No hay avisos vigentes en la categoría "${filtroCategoria}".`
                : "No hay avisos vigentes en este momento."
              }
            </div>
          ) : (
            <>
              <div style={{ maxHeight: "500px", overflowY: "auto", border: "1px solid #e0e0e0", borderRadius: "8px" }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Descripción</th>
                      <th>Categoría</th>
                      <th>Fecha de Publicación</th>
                      <th>Fecha de Expiración</th>
                      <th>Destinatario</th>
                      <th>Archivo Adjunto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {avisosPagina.map((aviso) => (
                      <tr key={aviso.id}>
                        <td>
                          <div className={styles.avisoDescripcion}>
                            {aviso.descripcion}
                            {aviso.categoria === 'urgente' && (
                              <span className={styles.urgentBadge}>¡URGENTE!</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.categoriaBadge} ${styles[aviso.categoria]}`}>
                            {aviso.categoria.charAt(0).toUpperCase() + aviso.categoria.slice(1)}
                          </span>
                        </td>
                        <td>{formatDateDMY(aviso.fecha)}</td>
                        <td>
                          {aviso.fechaExpiracion ? (
                            <span className={styles.fechaExpiracion}>
                              {formatDateDMY(aviso.fechaExpiracion)}
                            </span>
                          ) : (
                            <span className={styles.sinExpiracion}>Sin expiración</span>
                          )}
                        </td>
                        <td>
                          {aviso.destinatario ? (
                            <span className={styles.destinatarioEspecifico}>
                              {aviso.destinatario === user?.email ? "Para ti" : "Específico"}
                            </span>
                          ) : (
                            <span className={styles.destinatarioGeneral}>Todos</span>
                          )}
                        </td>
                        <td>
                          {aviso.archivoAdjunto ? (
                            <a
                              href={`${API_URL.replace("/api", "")}/uploads/avisos/${aviso.archivoAdjunto}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.downloadLink}
                            >
                              📎 Descargar
                            </a>
                          ) : (
                            <span className={styles.noAdjunto}>-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className={styles.pagination}>
                  <button 
                    onClick={handlePaginaAnterior} 
                    disabled={pagina === 1}
                    className={styles.paginationBtn}
                  >
                    ← Anterior
                  </button>
                  <span className={styles.paginationInfo}>
                    Página {pagina} de {totalPaginas}
                  </span>
                  <button 
                    onClick={handlePaginaSiguiente} 
                    disabled={pagina === totalPaginas}
                    className={styles.paginationBtn}
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AvisosU;
