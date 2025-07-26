import { useState } from 'react';
import { changeAsambleaEstado } from '@services/asamblea.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';
import Swal from 'sweetalert2';

const useAsambleaEstado = () => {
    const [isChangingEstado, setIsChangingEstado] = useState(false);

    
    const handleChangeEstado = async (asambleaId, nuevoEstado, onSuccess) => {
        setIsChangingEstado(true);
        try {
            const response = await changeAsambleaEstado(asambleaId, nuevoEstado);
            if (response.status === "Success") {
                showSuccessAlert("¡Éxito!", `Estado cambiado a "${nuevoEstado}" exitosamente`);
                if (onSuccess) onSuccess();
                return { success: true };
            } else {
                showErrorAlert("Error", response.message || "Error al cambiar el estado");
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error("Error al cambiar el estado:", error);
            showErrorAlert("Error", "Error interno del servidor");
            return { success: false, message: "Error interno del servidor" };
        } finally {
            setIsChangingEstado(false);
        }
    };

    
    const confirmChangeEstado = async (asamblea, nuevoEstado, onSuccess) => {
        const estadoTexto = {
            'pendiente': 'Pendiente',
            'realizada': 'Realizada',
            'no realizada': 'No Realizada'
        };

        const result = await Swal.fire({
            title: '¿Cambiar estado?',
            html: `
                <div style="text-align: left; margin: 20px 0;">
                    <p><strong>Asamblea:</strong> ${asamblea.tema}</p>
                    <p><strong>Fecha:</strong> ${new Date(asamblea.fecha).toLocaleDateString('es-ES')}</p>
                    <p><strong>Estado actual:</strong> ${estadoTexto[asamblea.estado]}</p>
                    <p><strong>Nuevo estado:</strong> ${estadoTexto[nuevoEstado]}</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 15px;">
                    <p style="margin: 0; font-size: 14px; color: #6c757d;">
                        ${nuevoEstado === 'realizada' 
                            ? '⚠️ Una vez marcada como realizada, no se puede deshacer esta acción.' 
                            : '¿Estás seguro de que quieres cambiar el estado?'}
                    </p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, cambiar estado',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',
            focusConfirm: false
        });

        if (result.isConfirmed) {
            return await handleChangeEstado(asamblea.id, nuevoEstado, onSuccess);
        }
        return { success: false, cancelled: true };
    };

    
    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'pendiente':
                return '#ffc107'; 
            case 'realizada':
                return '#28a745'; 
            case 'no realizada':
                return '#dc3545'; 
            default:
                return '#6c757d'; 
        }
    };

    
    const getEstadoTexto = (estado) => {
        switch (estado) {
            case 'pendiente':
                return 'Pendiente';
            case 'realizada':
                return 'Realizada';
            case 'no realizada':
                return 'No Realizada';
            default:
                return estado;
        }
    };

    
    const canChangeEstado = (asamblea, nuevoEstado) => {
        const fechaActual = new Date();
        const fechaAsamblea = new Date(asamblea.fecha);
        fechaAsamblea.setHours(23, 59, 59, 999);

        
        if (nuevoEstado === 'realizada') {
            return asamblea.estado === 'pendiente' && fechaActual <= fechaAsamblea;
        }

        
        if (asamblea.estado === 'realizada' || asamblea.estado === 'no realizada') {
            return false;
        }

        return true;
    };

    return {
        isChangingEstado,
        handleChangeEstado,
        confirmChangeEstado,
        getEstadoColor,
        getEstadoTexto,
        canChangeEstado
    };
};

export default useAsambleaEstado;
