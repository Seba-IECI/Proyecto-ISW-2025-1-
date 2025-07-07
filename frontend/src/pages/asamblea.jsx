import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useAsamblea from '@hooks/asamblea/useAsamblea';
import '@styles/asamblea.css';

const Asamblea = () => {
    const { 
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
        formatDate
    } = useAsamblea();
    
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isPopupOpen) {
            reset();
        }
    }, [isPopupOpen, reset]);

    // Llenar formulario cuando se edita
    useEffect(() => {
        if (isEditMode && currentAsamblea) {
            // NO se permite editar el tema en modo edición
            setValue('lugar', currentAsamblea.lugar);
            // Formatear fecha para input datetime-local
            const date = new Date(currentAsamblea.fecha);
            const formattedDate = date.toISOString().slice(0, 16);
            setValue('fecha', formattedDate);
        }
    }, [isEditMode, currentAsamblea, setValue]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            if (isEditMode) {
                // En modo edición, no se envía el tema
                const { tema, ...updateData } = data;
                await handleUpdate(updateData);
            } else {
                await handleCreate(data);
            }
            reset();
        } catch (error) {
            console.error('Error al procesar asamblea:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
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
                                            value: /^[a-zA-Z0-9\s]+$/,
                                            message: 'Solo letras, números y espacios'
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
                                            value: /^[a-zA-Z0-9\s]+$/,
                                            message: 'Solo letras, números y espacios'
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