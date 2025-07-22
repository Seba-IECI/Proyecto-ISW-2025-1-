import { useState } from 'react';
import { subirasamblea } from '@services/asamblea.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';

const useSubirAsamblea = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataAsamblea, setDataAsamblea] = useState({
        tema: '',
        lugar: '',
        fecha: ''
    });

    const handleClickCreate = () => {
        setIsPopupOpen(true);
    };

    const handleCreate = async (newAsambleaData) => {
        if (newAsambleaData) {
            try {
                const response = await subirasamblea(newAsambleaData);
                if (response.status === "Success") {
                    showSuccessAlert("¡Éxito!", "Asamblea creada correctamente");
                    setIsPopupOpen(false);
                    setDataAsamblea({
                        tema: '',
                        lugar: '',
                        fecha: ''
                    });
                    return { success: true, response }; 
                } else {
                    showErrorAlert("Error", response.message || "Error al crear la asamblea");
                    return { success: false, message: response.message };
                }
            } catch (error) {
                console.error("Error al crear la asamblea:", error);
                showErrorAlert("Error", "Error interno del servidor");
                return { success: false, message: "Error interno del servidor" };
            }
        }
        return { success: false, message: "No se proporcionaron datos" };
    };

    return{
        handleClickCreate,
        handleCreate,
        isPopupOpen,
        setIsPopupOpen,
        dataAsamblea,
        setDataAsamblea
    };
};

export default useSubirAsamblea;