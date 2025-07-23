import useGetAsamblea from '@hooks/asamblea/useGetAsamblea';
import '@styles/asamblea.css';
import { useState } from 'react';

const AsambleaU = () => {
    const { 
        asamblea: asambleas,
        loading
    } = useGetAsamblea();


    const [filterTema, setFilterTema] = useState('');
    const [filterFecha, setFilterFecha] = useState('');

    
    const handleTemaFilterChange = (e) => {
        setFilterTema(e.target.value);
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

   
    const filteredAsambleas = asambleas.filter(asamblea => {
        const matchesTema = asamblea.tema.toLowerCase().includes(filterTema.toLowerCase());
        const matchesFecha = filterFecha === '' || 
            formatDate(asamblea.fecha).toLowerCase().includes(filterFecha.toLowerCase());
        return matchesTema && matchesFecha;
    });

    return (
        <div className="asamblea-container">
            <div className="asamblea-header">
                <h1 className="asamblea-title">Asambleas</h1>
                <p className="asamblea-subtitle">
                    Visualiza todas las asambleas de tu condominio
                </p>
            </div>

            <div className="asamblea-content">
                <div className="asambleas-list">
                    <h3>Todas las Asambleas</h3>
                    
                    
                    <div className="filter-actions">
                        <input
                            type="text"
                            placeholder="Filtrar por tema"
                            value={filterTema}
                            onChange={handleTemaFilterChange}
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
                            Cargando asambleas...
                        </div>
                    ) : filteredAsambleas.length === 0 ? (
                        <div className="empty-state">
                            <h3>No hay asambleas que coincidan con los filtros</h3>
                            <p>Intenta ajustar los criterios de búsqueda</p>
                        </div>
                    ) : (
                        <table className="asambleas-table">
                            <thead>
                                <tr>
                                    <th>Tema</th>
                                    <th>Lugar</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Creador</th>
                                    <th>Fecha de Creación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAsambleas.map((asamblea) => (
                                    <tr key={asamblea.id}>
                                        <td>{asamblea.tema}</td>
                                        <td>{asamblea.lugar}</td>
                                        <td>{formatDate(asamblea.fecha)}</td>                        <td>
                            <span className={`estado-badge estado-${asamblea.estado?.toLowerCase()}`}>
                                {asamblea.estado}
                            </span>
                        </td>
                                        <td>{asamblea.creador || 'N/A'}</td>
                                        <td>{formatDate(asamblea.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="info-cards">
                    <div className="info-card">
                        <div className="info-card-icon">📋</div>
                        <h3>Todas las Asambleas</h3>
                        <p>Aquí se muestran todas las asambleas registradas en el sistema.</p>
                    </div>
                    <div className="info-card">
                        <div className="info-card-icon">⚠️</div>
                        <h3>Estados</h3>
                        <p>Puedes ver el estado actual de cada asamblea: pendiente, creada o finalizada.</p>
                    </div>
                    <div className="info-card">
                        <div className="info-card-icon">📅</div>
                        <h3>Fechas</h3>
                        <p>Se muestra tanto la fecha programada para la asamblea como la fecha de creación.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AsambleaU;

