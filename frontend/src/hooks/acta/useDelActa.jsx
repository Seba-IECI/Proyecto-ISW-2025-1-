import { useState } from 'react';
import { eliminarActa } from '@services/acta.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDelActa = (fetchActas, setDataActa) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async (dataActa) => {
        if (!dataActa || dataActa.length === 0) {
            showErrorAlert('Error', 'No hay acta seleccionada para eliminar');
            return;
        }

        try {
            const result = await deleteDataAlert();
            
            if (result.isConfirmed) {
                setLoading(true);
                const actaId = dataActa[0].id;
                
                const response = await eliminarActa(actaId);
                
                if (response.status === 'Success') {
                    showSuccessAlert('¡Eliminado!', 'El acta ha sido eliminada correctamente.');
                    await fetchActas(); 
                    setDataActa([]); 
                } else {
                    showErrorAlert('Error', response.message || response.details || 'Error al eliminar el acta');
                }
            } else {
                showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
            }
        } catch (error) {
            console.error('Error al eliminar el acta:', error);
            showErrorAlert('Error', 'Ocurrió un error al eliminar el acta.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteById = async (actaId) => {
        if (!actaId) {
            showErrorAlert('Error', 'ID de acta inválido');
            return;
        }

        try {
            const result = await deleteDataAlert();
            
            if (result.isConfirmed) {
                setLoading(true);
                
                const response = await eliminarActa(actaId);
                
                if (response.status === 'Success') {
                    showSuccessAlert('¡Eliminado!', 'El acta ha sido eliminada correctamente.');
                    if (fetchActas) await fetchActas(); 
                    return { success: true };
                } else {
                    showErrorAlert('Error', response.message || response.details || 'Error al eliminar el acta');
                    return { success: false, message: response.message || response.details };
                }
            } else {
                showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
                return { success: false, message: 'Operación cancelada' };
            }
        } catch (error) {
            console.error('Error al eliminar el acta:', error);
            showErrorAlert('Error', 'Ocurrió un error al eliminar el acta.');
            return { success: false, message: 'Error interno del servidor' };
        } finally {
            setLoading(false);
        }
    };

    return {
        handleDelete,
        handleDeleteById,
        loading
    };
};

export default useDelActa;
