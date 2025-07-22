import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useSubirAsamblea from '@hooks/asamblea/useSubirAsamblea';
import useGetAsamblea from '@hooks/asamblea/useGetAsamblea';
import useUpAsamblea from '@hooks/asamblea/useUpAsamblea';
import useDelAsamblea from '@hooks/asamblea/useDelAsamblea';
import AsambleaEstadoBadge from '@components/AsambleaEstadoBadge';
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert';
import '@styles/asamblea.css';

const Asamblea = () => {
    
    const { 
        handleClickCreate,
        handleCreate,
        isPopupOpen,
        setIsPopupOpen
    } = useSubirAsamblea();
    
    const { 
        asamblea: asambleas,
        loading,
        fetchGetAsamblea: fetchAsambleas
    } = useGetAsamblea();
    
    const { fetchUpAsamblea } = useUpAsamblea();
    const { fetchDelAsamblea } = useDelAsamblea();
    
   
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentAsamblea, setCurrentAsamblea] = useState(null);
    
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    
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

    const handleClickEdit = (asamblea) => {
        setIsEditMode(true);
        setCurrentAsamblea(asamblea);
        setIsPopupOpen(true);
    };

    const handleUpdate = async (data) => {
        try {
            const response = await fetchUpAsamblea(data, currentAsamblea.id);
            if (response && response.status === "Success") {
                showSuccessAlert("¡Éxito!", "Asamblea actualizada correctamente");
                setIsPopupOpen(false);
                await fetchAsambleas(); 
                return { success: true };
            } else {
                showErrorAlert("Error", response?.message || "Error al actualizar la asamblea");
                return { success: false, message: response?.message };
            }
        } catch (error) {
            console.error("Error al actualizar la asamblea:", error);
            showErrorAlert("Error", "Error interno del servidor");
            return { success: false, message: "Error interno del servidor" };
        }
    };

    const handleDelete = async (id) => {
        const result = await deleteDataAlert();
        if (result.isConfirmed) {
            try {
                const response = await fetchDelAsamblea(id);
                if (response && response.status === "Success") {
                    showSuccessAlert("¡Eliminado!", "Asamblea eliminada correctamente");
                    await fetchAsambleas(); // Recargar la lista
                } else {
                    showErrorAlert("Error", response?.message || "Error al eliminar la asamblea");
                }
            } catch (error) {
                console.error("Error al eliminar la asamblea:", error);
                showErrorAlert("Error", "Error interno del servidor");
            }
        }
    };

    useEffect(() => {
        if (!isPopupOpen) {
            reset();
        }
    }, [isPopupOpen, reset]);

    
    useEffect(() => {
        if (isEditMode && currentAsamblea) {
            
            setValue('lugar', currentAsamblea.lugar);
            setValue('temasATratar', currentAsamblea.temasATratar || '');
            
            const date = new Date(currentAsamblea.fecha);
            
            const timeOffset = date.getTimezoneOffset() * 60000;
            const localDate = new Date(date.getTime() - timeOffset);
            const formattedDate = localDate.toISOString().slice(0, 16);
            setValue('fecha', formattedDate);
        }
    }, [isEditMode, currentAsamblea, setValue]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            let result;
            if (isEditMode) {
                // Para actualizar, quitamos el tema del data ya que no se puede modificar
                const { tema, ...updateData } = data;
                result = await handleUpdate(updateData);
            } else {
                result = await handleCreate(data);
            }
            
            // Si cualquier operación fue exitosa, actualizar la lista y limpiar formulario
            if (result && result.success) {
                await fetchAsambleas(); // Actualizar la lista de asambleas
                reset();
            }
        } catch (error) {
            console.error('Error al procesar asamblea:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setIsEditMode(false);
        setCurrentAsamblea(null);
        reset();
    };

    return (
        <div className="asamblea-container">
            <div className="asamblea-header">
                <h1 className="asamblea-title">Asambleas</h1>
                <p className="asamblea-subtitle">
                    Administra las asambleas de tu condominio
                </p>
            </div>

            <div className="asamblea-content">
                <div className="create-section">
                    <h2>Nueva Asamblea</h2>
                    <p>
                        Crea una nueva asamblea definiendo el tema, lugar y fecha.
                    </p>
                    <button 
                        className="btn-create-asamblea" 
                        onClick={handleClickCreate}
                    >
                        Crear Asamblea
                    </button>
                </div>

                
                <div className="asambleas-list">
                    <h3>Asambleas Registradas</h3>
                    
                    {loading ? (
                        <div className="loading-spinner">
                            Cargando asambleas...
                        </div>
                    ) : asambleas.length === 0 ? (
                        <div className="empty-state">
                            <h3>No hay asambleas registradas</h3>
                            <p>Crea tu primera asamblea para comenzar</p>
                        </div>
                    ) : (
                        <table className="asambleas-table">
                            <thead>
                                <tr>
                                    <th>Tema</th>
                                    <th>Lugar</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Temas a Tratar</th>
                                    <th>Creador</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {asambleas.map((asamblea) => (
                                    <tr key={asamblea.id}>
                                        <td>{asamblea.tema}</td>
                                        <td>{asamblea.lugar}</td>
                                        <td>{formatDate(asamblea.fecha)}</td>
                                        <td>
                                            <AsambleaEstadoBadge 
                                                asamblea={asamblea} 
                                                onEstadoChanged={fetchAsambleas}
                                            />
                                        </td>
                                        <td className="temas-cell">
                                            {asamblea.temasATratar ? (
                                                <div className="temas-content">
                                                    {asamblea.temasATratar.length > 100 
                                                        ? `${asamblea.temasATratar.substring(0, 100)}...` 
                                                        : asamblea.temasATratar}
                                                </div>
                                            ) : (
                                                <span className="no-temas">Sin temas definidos</span>
                                            )}
                                        </td>
                                        <td>{asamblea.creador || 'N/A'}</td>
                                        <td className="actions-cell">
                                            <button 
                                                className="btn-edit"
                                                onClick={() => handleClickEdit(asamblea)}
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                onClick={() => handleDelete(asamblea.id)}
                                            >
                                                Eliminar
                                            </button>
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
                        <h3>Tema</h3>
                        <p>Define el tema principal de la asamblea.</p>
                    </div>
                    <div className="info-card">
                        <div className="info-card-icon">📍</div>
                        <h3>Lugar</h3>
                        <p>Especifica dónde se realizará la asamblea.</p>
                    </div>
                    <div className="info-card">
                        <div className="info-card-icon">📅</div>
                        <h3>Fecha</h3>
                        <p>Establece la fecha y hora de la asamblea.</p>
                    </div>
                    <div className="info-card">
                        <div className="info-card-icon">⚠️</div>
                        <h3>Estado</h3>
                        <p>Controla el estado: Pendiente, Realizada o No Realizada.</p>
                    </div>
                    <div className="info-card">
                        <div className="info-card-icon">📝</div>
                        <h3>Temas a Tratar</h3>
                        <p>Detalla los puntos específicos que se discutirán.</p>
                    </div>
                </div>
            </div>

            
            {isPopupOpen && (
                <div className="bg">
                    <div className="asamblea-popup">
                        <div className="asamblea-popup-header">
                            <h2>{isEditMode ? 'Editar Asamblea' : 'Nueva Asamblea'}</h2>
                            <button 
                                className="close-btn" 
                                onClick={handleClosePopup}
                                type="button"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit(onSubmit)} className="asamblea-form">
                            <div className="form-group">
                                <label htmlFor="tema">Tema *</label>
                                <input
                                    id="tema"
                                    type="text"
                                    placeholder="Tema de la asamblea"
                                    className={errors.tema ? 'field-error' : ''}
                                    disabled={isEditMode}
                                    {...register('tema', {
                                        required: isEditMode ? false : 'El tema es obligatorio',
                                        minLength: isEditMode ? undefined : {
                                            value: 3,
                                            message: 'Mínimo 3 caracteres'
                                        },
                                        maxLength: isEditMode ? undefined : {
                                            value: 90,
                                            message: 'Máximo 90 caracteres'
                                        },
                                        pattern: isEditMode ? undefined : {
                                            value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s]+$/,
                                            message: 'Solo letras, números, espacios, ñ y tildes'
                                        }
                                    })}
                                    value={isEditMode ? currentAsamblea?.tema : undefined}
                                />
                                {isEditMode && (
                                    <small className="info-message">
                                        El tema no puede ser modificado una vez creada la asamblea
                                    </small>
                                )}
                                {errors.tema && (
                                    <span className="error-message">{errors.tema.message}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="lugar">Lugar *</label>
                                <input
                                    id="lugar"
                                    type="text"
                                    placeholder="Lugar de la asamblea"
                                    className={errors.lugar ? 'field-error' : ''}
                                    {...register('lugar', {
                                        required: 'El lugar es obligatorio',
                                        minLength: {
                                            value: 3,
                                            message: 'Mínimo 3 caracteres'
                                        },
                                        maxLength: {
                                            value: 90,
                                            message: 'Máximo 90 caracteres'
                                        },
                                        pattern: {
                                            value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s]+$/,
                                            message: 'Solo letras, números, espacios, ñ y tildes'
                                        }
                                    })}
                                />
                                {errors.lugar && (
                                    <span className="error-message">{errors.lugar.message}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="fecha">Fecha y Hora *</label>
                                <input
                                    id="fecha"
                                    type="datetime-local"
                                    min={new Date().toISOString().slice(0, 16)}
                                    className={errors.fecha ? 'field-error' : ''}
                                    {...register('fecha', {
                                        required: 'La fecha es obligatoria',
                                        validate: (value) => {
                                            const selectedDate = new Date(value);
                                            const currentDate = new Date();
                                            return selectedDate > currentDate || 'Debe ser fecha futura';
                                        }
                                    })}
                                />
                                {errors.fecha && (
                                    <span className="error-message">{errors.fecha.message}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="temasATratar">Temas a Tratar</label>
                                <textarea
                                    id="temasATratar"
                                    rows="4"
                                    placeholder="Describe los temas que se tratarán en la asamblea..."
                                    className={errors.temasATratar ? 'field-error' : ''}
                                    {...register('temasATratar', {
                                        maxLength: {
                                            value: 1000,
                                            message: 'Máximo 1000 caracteres'
                                        },
                                        pattern: {
                                            value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s.,;:()¿?¡!\-]*$/,
                                            message: 'Solo letras, números, espacios, signos de puntuación, ñ y tildes'
                                        }
                                    })}
                                />
                                <small className="char-counter">
                                    Opcional - Máximo 1000 caracteres
                                </small>
                                {errors.temasATratar && (
                                    <span className="error-message">{errors.temasATratar.message}</span>
                                )}
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn-secondary"
                                    onClick={handleClosePopup}
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Procesando...' : (isEditMode ? 'Actualizar' : 'Crear')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Asamblea;