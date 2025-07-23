import useGetActa from '@hooks/acta/useGetActa';
import '@styles/asamblea.css';
import { useState } from 'react';

const ActaU = () => {
    const { 
        actas,
        loading
    } = useGetActa();

    
    const [filterNombre, setFilterNombre] = useState('');
    const [filterFecha, setFilterFecha] = useState('');

    
    const handleNombreFilterChange = (e) => {
        setFilterNombre(e.target.value);
    };

    const handleFechaFilterChange = (e) => {
        setFilterFecha(e.target.value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

   
    const filteredActas = actas.filter(acta => {
        const matchesNombre = acta.nombre.toLowerCase().includes(filterNombre.toLowerCase());
        const matchesFecha = filterFecha === '' || 
            formatDate(acta.createdAt).toLowerCase().includes(filterFecha.toLowerCase());
        return matchesNombre && matchesFecha;
    });

    return (
        <div className="asamblea-container">
            <div className="asamblea-header">
                <h1 className="asamblea-title">Actas</h1>
                <p className="asamblea-subtitle">
                    Visualiza todas las actas de tu condominio
                </p>
            </div>

            <div className="asamblea-content">
                <div className="asambleas-list">
                    <h3>Todas las Actas</h3>
                    
                    
                    <div className="filter-actions">
                        <input
                            type="text"
                            placeholder="Filtrar por nombre"
                            value={filterNombre}
                            onChange={handleNombreFilterChange}
                            className="search-input"
                        />
                        <input
                            type="text"
                            placeholder="Filtrar por fecha"
                            value={filterFecha}
                            onChange={handleFechaFilterChange}
                            className="search-input"
                        />
                    </div>
                    
                    {loading ? (
                        <div className="loading-spinner">
                            Cargando actas...
                        </div>
                    ) : filteredActas.length === 0 ? (
                        <div className="empty-state">
                            <h3>No hay actas que coincidan con los filtros</h3>
                            <p>Intenta ajustar los criterios de búsqueda</p>
                        </div>
                    ) : (
                        <table className="asambleas-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Subido Por</th>
                                    <th>Fecha de Creación</th>
                                    <th>Archivo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredActas.map((acta) => (
                                    <tr key={acta.id}>
                                        <td>{acta.nombre}</td>
                                        <td>{acta.subidoPor || 'No especificado'}</td>
                                        <td>{formatDate(acta.createdAt)}</td>
                                        <td>
                                            <a 
                                                href={acta.archivo} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="archivo-link"
                                            >
                                                Ver PDF
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="info-cards">
                    <div className="info-card">
                        <div className="info-card-icon">📋</div>
                        <h3>Todas las Actas</h3>
                        <p>Aquí se muestran todas las actas registradas en el sistema.</p>
                    </div>
                    <div className="info-card">
                        <div className="info-card-icon">📁</div>
                        <h3>Archivos</h3>
                        <p>Puedes ver cada acta haciendo clic en "Ver PDF".</p>
                    </div>
                    <div className="info-card">
                        <div className="info-card-icon">📅</div>
                        <h3>Fechas</h3>
                        <p>Se muestra la fecha de creación de cada acta.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActaU;