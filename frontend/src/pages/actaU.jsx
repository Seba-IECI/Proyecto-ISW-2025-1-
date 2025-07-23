import useGetActa from '@hooks/acta/useGetActa';
import '@styles/asamblea.css';

const ActaU = () => {
    const { 
        actas,
        loading
    } = useGetActa();

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
                <h1 className="asamblea-title">Actas</h1>
                <p className="asamblea-subtitle">
                    Visualiza todas las actas de tu condominio
                </p>
            </div>

            <div className="asamblea-content">
                <div className="asambleas-list">
                    <h3>Todas las Actas</h3>
                    
                    {loading ? (
                        <div className="loading-spinner">
                            Cargando actas...
                        </div>
                    ) : actas.length === 0 ? (
                        <div className="empty-state">
                            <h3>No hay actas registradas</h3>
                            <p>No se encontraron actas</p>
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
                                {actas.map((acta) => (
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