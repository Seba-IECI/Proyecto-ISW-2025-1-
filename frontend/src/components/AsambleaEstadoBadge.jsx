import React from 'react';
import useAsambleaEstado from '@hooks/asamblea/useAsambleaEstado';
import '@styles/asambleaEstado.css';

const AsambleaEstadoBadge = ({ asamblea, onEstadoChanged }) => {
    const { 
        isChangingEstado,
        confirmChangeEstado,
        getEstadoColor,
        getEstadoTexto,
        canChangeEstado
    } = useAsambleaEstado();

    const handleChangeToRealizada = async () => {
        if (!canChangeEstado(asamblea, 'realizada')) return;
        
        const result = await confirmChangeEstado(asamblea, 'realizada', onEstadoChanged);
        if (result.success && onEstadoChanged) {
            onEstadoChanged();
        }
    };

    const estadoColor = getEstadoColor(asamblea.estado);
    const estadoTexto = getEstadoTexto(asamblea.estado);
    const puedeMarcarRealizada = canChangeEstado(asamblea, 'realizada');

    return (
        <div className="asamblea-estado-container">
            <span 
                className="estado-badge" 
                style={{ 
                    backgroundColor: estadoColor,
                    color: 'white'
                }}
            >
                {estadoTexto}
            </span>
            
            {puedeMarcarRealizada && (
                <button
                    className="btn-cambiar-estado"
                    onClick={handleChangeToRealizada}
                    disabled={isChangingEstado}
                    title="Marcar como realizada"
                >
                    {isChangingEstado ? '⏳' : '✅'}
                </button>
            )}
        </div>
    );
};

export default AsambleaEstadoBadge;
