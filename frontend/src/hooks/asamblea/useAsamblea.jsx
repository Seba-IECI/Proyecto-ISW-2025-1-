import { useState, useEffect } from 'react';
import { 
    subirasamblea, 
    getAsamblea, 
    updateAsamblea, 
    deleteAsamblea 
} from '@services/asamblea.service';
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert';

const useAsamblea = () => {
    const [asambleas, setAsambleas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentAsamblea, setCurrentAsamblea] = useState(null);

    // Cargar todas las asambleas
    const fetchAsambleas = async () => {
        setLoading(true);
        try {
            const response = await getAsamblea();
            if (response.status === "Success") {
                setAsambleas(response.data);
            } else {
                showErrorAlert("Error", response.message || "Error al cargar las asambleas");
            }
        } catch (error) {
            console.error("Error al cargar asambleas:", error);
            showErrorAlert("Error", "Error interno del servidor");
        } finally {
            setLoading(false);
        }
    };

    // Crear nueva asamblea
    const handleClickCreate = () => {
        setIsEditMode(false);
        setCurrentAsamblea(null);
        setIsPopupOpen(true);
    };

    // Crear asamblea
    const handleCreate = async (data) => {
        try {
            const response = await subirasamblea(data);
            if (response.status === "Success") {
                showSuccessAlert("¡Éxito!", "Asamblea creada correctamente");
                setIsPopupOpen(false);
                fetchAsambleas(); // Recargar la lista
            } else {
                showErrorAlert("Error", response.message || "Error al crear la asamblea");
            }
        } catch (error) {
            console.error("Error al crear la asamblea:", error);
            showErrorAlert("Error", "Error interno del servidor");
        }
    };

    // Editar asamblea
    const handleClickEdit = (asamblea) => {
        setIsEditMode(true);
        setCurrentAsamblea(asamblea);
        setIsPopupOpen(true);
    };

    // Actualizar asamblea
    const handleUpdate = async (data) => {
        try {
            const response = await updateAsamblea(currentAsamblea.id, data);
            if (response.status === "Success") {
                showSuccessAlert("¡Éxito!", "Asamblea actualizada correctamente");
                setIsPopupOpen(false);
                fetchAsambleas(); // Recargar la lista
            } else {
                showErrorAlert("Error", response.message || "Error al actualizar la asamblea");
            }
        } catch (error) {
            console.error("Error al actualizar la asamblea:", error);
            showErrorAlert("Error", "Error interno del servidor");
        }
    };

    // Eliminar asamblea
    const handleDelete = async (id) => {
        const result = await deleteDataAlert();
        if (result.isConfirmed) {
            try {
                const response = await deleteAsamblea(id);
                if (response.status === "Success") {
                    showSuccessAlert("¡Eliminado!", "Asamblea eliminada correctamente");
                    fetchAsambleas(); // Recargar la lista
                } else {
                    showErrorAlert("Error", response.message || "Error al eliminar la asamblea");
                }
            } catch (error) {
                console.error("Error al eliminar la asamblea:", error);
                showErrorAlert("Error", "Error interno del servidor");
            }
        }
    };

    // Formatear fecha para mostrar
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

    useEffect(() => {
        fetchAsambleas();
    }, []);

    return {
        asambleas,
        loading,
        isPopupOpen,
        setIsPopupOpen,
        isEditMode,
        currentAsamblea,
        handleClickCreate,
        handleCreate,
        handleClickEdit,
        handleUpdate,
        handleDelete,
        formatDate,
        fetchAsambleas
    };
};

export default useAsamblea;
