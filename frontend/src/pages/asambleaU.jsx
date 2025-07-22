import useGetAsamblea from '@hooks/asamblea/useGetAsamblea';
import '@styles/asamblea.css';

const AsambleaU = () => {
    const { 
        asamblea: asambleas,
        loading
    } = useGetAsamblea();

    
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
                    
                    {loading ? (
                        <div className="loading-spinner">
                            Cargando asambleas...
                        </div>
                    ) : asambleas.length === 0 ? (
                        <div className="empty-state">
                            <h3>No hay asambleas registradas</h3>
                            <p>No se encontraron asambleas</p>
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
                                {asambleas.map((asamblea) => (
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

