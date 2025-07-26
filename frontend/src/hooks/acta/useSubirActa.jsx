import { useState } from 'react';
import { subirActa } from '@services/acta.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useSubirActa = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataActa, setDataActa] = useState({
        nombre: '',
        archivo: null,
        asambleaId: ''
    });

    const handleClickCreate = () => {
        setIsPopupOpen(true);
    };

    const handleCreate = async (newActaData) => {
        if (!newActaData || !newActaData.nombre || !newActaData.archivo) {
            showErrorAlert("Error", "Debe proporcionar un nombre y un archivo para el acta");
            return { success: false, message: "Datos incompletos" };
        }

        try {
            setLoading(true);
            
            
            const formData = new FormData();
            formData.append('nombre', newActaData.nombre);
            formData.append('archivo', newActaData.archivo);
            if (newActaData.asambleaId && newActaData.asambleaId !== '') {
                formData.append('asambleaId', newActaData.asambleaId);
            }

            console.log("Datos enviados al backend:", {
                nombre: newActaData.nombre,
                asambleaId: newActaData.asambleaId,
                hasFile: !!newActaData.archivo
            });

            const response = await subirActa(formData);
            
            if (response.status === "Success") {
                showSuccessAlert("¡Éxito!", "Acta subida correctamente");
                setIsPopupOpen(false);
                setDataActa({
                    nombre: '',
                    archivo: null,
                    asambleaId: ''
                });
                return { success: true, response }; 
            } else {
                showErrorAlert("Error", response.message || response.details || "Error al subir el acta");
                return { success: false, message: response.message || response.details };
            }
        } catch (error) {
            console.error("Error al subir el acta:", error);
            showErrorAlert("Error", "Error interno del servidor");
            return { success: false, message: "Error interno del servidor" };
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setDataActa({
            nombre: '',
            archivo: null,
            asambleaId: ''
        });
    };

    return {
        handleClickCreate,
        handleCreate,
        isPopupOpen,
        setIsPopupOpen,
        dataActa,
        setDataActa,
        loading,
        resetForm
    };
};

export default useSubirActa;
