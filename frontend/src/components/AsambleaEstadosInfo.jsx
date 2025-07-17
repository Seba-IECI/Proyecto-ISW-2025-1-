import React from 'react';
import '@styles/asambleaEstadosInfo.css';

const AsambleaEstadosInfo = () => {
    return (
        <div className="estados-info-container">
            <div className="estados-info-header">
                <h2>Estados de Asamblea</h2>
                <p>Información sobre los diferentes estados que puede tener una asamblea</p>
            </div>

            <div className="estados-grid">
                <div className="estado-info-card pendiente">
                    <div className="estado-icon">⏳</div>
                    <h3>Pendiente</h3>
                    <div className="estado-badge" style={{ backgroundColor: '#ffc107', color: '#212529' }}>
                        PENDIENTE
                    </div>
                    <p>
                        Estado inicial cuando se crea una asamblea. Indica que la asamblea 
                        está programada pero aún no se ha realizado.
                    </p>
                    <div className="estado-actions">
                        <h4>Acciones disponibles:</h4>
                        <ul>
                            <li>✅ Marcar como realizada (antes de la fecha)</li>
                            <li>📝 Editar detalles</li>
                            <li>🗑️ Eliminar</li>
                        </ul>
                    </div>
                </div>

                <div className="estado-info-card realizada">
                    <div className="estado-icon">✅</div>
                    <h3>Realizada</h3>
                    <div className="estado-badge" style={{ backgroundColor: '#28a745', color: 'white' }}>
                        REALIZADA
                    </div>
                    <p>
                        Estado que indica que la asamblea se llevó a cabo exitosamente. 
                        Solo se puede cambiar manualmente desde "Pendiente".
                    </p>
                    <div className="estado-actions">
                        <h4>Características:</h4>
                        <ul>
                            <li>🔒 Estado final - No se puede cambiar</li>
                            <li>📅 Debe marcarse antes de la fecha programada</li>
                            <li>👥 Indica participación exitosa</li>
                        </ul>
                    </div>
                </div>

                <div className="estado-info-card no-realizada">
                    <div className="estado-icon">❌</div>
                    <h3>No Realizada</h3>
                    <div className="estado-badge" style={{ backgroundColor: '#dc3545', color: 'white' }}>
                        NO REALIZADA
                    </div>
                    <p>
                        Estado automático que se asigna cuando una asamblea "Pendiente" 
                        no se marca como realizada antes de su fecha programada.
                    </p>
                    <div className="estado-actions">
                        <h4>Características:</h4>
                        <ul>
                            <li>🔄 Cambio automático al final del día</li>
                            <li>🔒 Estado final - No se puede cambiar</li>
                            <li>📊 Indica asamblea no completada</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="estados-flow">
                <h3>Flujo de Estados</h3>
                <div className="flow-diagram">
                    <div className="flow-step">
                        <div className="flow-state pendiente">Pendiente</div>
                        <div className="flow-description">Estado inicial</div>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="flow-state realizada">Realizada</div>
                        <div className="flow-description">Manual (antes de fecha)</div>
                    </div>
                </div>
                <div className="flow-diagram">
                    <div className="flow-step">
                        <div className="flow-state pendiente">Pendiente</div>
                        <div className="flow-description">Si no se marca</div>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="flow-state no-realizada">No Realizada</div>
                        <div className="flow-description">Automático (después de fecha)</div>
                    </div>
                </div>
            </div>

            <div className="estados-rules">
                <h3>Reglas Importantes</h3>
                <div className="rules-grid">
                    <div className="rule-card">
                        <h4>⏰ Límite de Tiempo</h4>
                        <p>
                            Solo se puede marcar como "Realizada" antes de que termine 
                            el día de la fecha programada (hasta las 23:59:59).
                        </p>
                    </div>
                    <div className="rule-card">
                        <h4>🔄 Cambio Automático</h4>
                        <p>
                            El sistema cambia automáticamente las asambleas "Pendientes" 
                            a "No Realizada" cuando se consulta la lista después de la fecha.
                        </p>
                    </div>
                    <div className="rule-card">
                        <h4>🔒 Estados Finales</h4>
                        <p>
                            Los estados "Realizada" y "No Realizada" son finales y 
                            no se pueden cambiar una vez asignados.
                        </p>
                    </div>
                    <div className="rule-card">
                        <h4>👥 Permisos</h4>
                        <p>
                            Solo usuarios con rol de Administrador o Directiva pueden 
                            cambiar el estado de las asambleas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AsambleaEstadosInfo;
