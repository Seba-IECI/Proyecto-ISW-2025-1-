import { useState } from 'react';
import { actualizarActa } from '@services/acta.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useUpActa = () => {
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingActa, setEditingActa] = useState(null);

    const handleClickEdit = (acta) => {
        setEditingActa(acta);
        setIsEditPopupOpen(true);
    };

    const handleUpdate = async (updatedActaData) => {
        if (!editingActa || !editingActa.id) {
            showErrorAlert("Error", "No hay acta seleccionada para actualizar");
            return { success: false, message: "No hay acta seleccionada" };
        }

        if (!updatedActaData || (!updatedActaData.nombre && !updatedActaData.archivo && updatedActaData.asambleaId === undefined)) {
            showErrorAlert("Error", "Debe proporcionar al menos un campo para actualizar");
            return { success: false, message: "Datos incompletos" };
        }

        try {
            setLoading(true);
            
            
            const formData = new FormData();
            
            if (updatedActaData.nombre) {
                formData.append('nombre', updatedActaData.nombre);
            }
            
            if (updatedActaData.archivo) {
                formData.append('archivo', updatedActaData.archivo);
            }

            if (updatedActaData.asambleaId !== undefined) {
                formData.append('asambleaId', updatedActaData.asambleaId || '');
            }

            const response = await actualizarActa(editingActa.id, formData);
            
            if (response.status === "Success") {
                showSuccessAlert("¡Éxito!", "Acta actualizada correctamente");
                setIsEditPopupOpen(false);
                setEditingActa(null);
                return { success: true, response }; 
            } else {
                showErrorAlert("Error", response.message || response.details || "Error al actualizar el acta");
                return { success: false, message: response.message || response.details };
            }
        } catch (error) {
            console.error("Error al actualizar el acta:", error);
            showErrorAlert("Error", "Error interno del servidor");
            return { success: false, message: "Error interno del servidor" };
        } finally {
            setLoading(false);
        }
    };

    const closeEditPopup = () => {
        setIsEditPopupOpen(false);
        setEditingActa(null);
    };

    return {
        handleClickEdit,
        handleUpdate,
        isEditPopupOpen,
        setIsEditPopupOpen,
        editingActa,
        setEditingActa,
        loading,
        closeEditPopup
    };
};

export default useUpActa;
