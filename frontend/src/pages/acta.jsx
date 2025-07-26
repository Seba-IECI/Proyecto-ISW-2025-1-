import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from '@context/AuthContext';
import useSubirActa from '@hooks/acta/useSubirActa';
import useUpActa from '@hooks/acta/useUpActa';
import useGetActa from '@hooks/acta/useGetActa';
import useDelActa from '@hooks/acta/useDelActa';
import useGetAsamblea from '@hooks/asamblea/useGetAsamblea';
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert';
import '@styles/users.css'; 
import '@styles/acta.css'; 

const Acta = () => {
    
    const { user, isAuthenticated } = useAuth();
    
    
    const { actas, loading, fetchActas } = useGetActa();
    const { asamblea: asambleas, loading: loadingAsambleas } = useGetAsamblea();
    const { 
        handleCreate, 
        isPopupOpen: isCreatePopupOpen, 
        setIsPopupOpen: setIsCreatePopupOpen,
        loading: isCreating 
    } = useSubirActa();
    const { 
        handleUpdate, 
        handleClickEdit,
        isEditPopupOpen, 
        setIsEditPopupOpen,
        editingActa,
        closeEditPopup,
        loading: isUpdating 
    } = useUpActa();
    const { handleDeleteById } = useDelActa(fetchActas);

    
    const [selectedActa, setSelectedActa] = useState([]);
    const [filterNombre, setFilterNombre] = useState('');
    const [filterSubidoPor, setFilterSubidoPor] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    
    
    const [formData, setFormData] = useState({
        nombre: '',
        archivo: null,
        asambleaId: ''
    });

   
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        console.log("Cambio en input:", { name, value, files }); 
        
        if (name === "archivo") {
            const file = files[0];
            console.log("Archivo seleccionado:", file); 
            setFormData({ ...formData, archivo: file });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    
    const validateForm = () => {
        console.log("Validando formulario:", formData); 
        
        if (!formData.nombre.trim()) {
            showErrorAlert("Error", "El nombre del acta es obligatorio");
            return false;
        }
        if (!isEditMode && !formData.archivo) {
            showErrorAlert("Error", "Debe seleccionar un archivo PDF");
            return false;
        }
        if (formData.archivo && formData.archivo.type !== "application/pdf") {
            showErrorAlert("Error", "Solo se permiten archivos PDF");
            return false;
        }
        if (formData.archivo && formData.archivo.size > 5 * 1024 * 1024) {
            showErrorAlert("Error", "El archivo no puede superar los 5MB");
            return false;
        }
        return true;
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            console.log("Datos del formulario:", formData); 
            let result;
            if (isEditMode) {
                result = await handleUpdate(formData);
            } else {
                result = await handleCreate(formData);
            }

            console.log("Resultado:", result); 

            if (result && result.success) {
                await fetchActas(); 
                resetForm();
                setIsCreatePopupOpen(false);
                setIsEditPopupOpen(false);
                setIsEditMode(false);
            }
        } catch (error) {
            console.error("Error en el envío:", error);
            showErrorAlert("Error", "Error interno del servidor");
        }
    };

   
    const resetForm = () => {
        setFormData({
            nombre: '',
            archivo: null,
            asambleaId: ''
        });
    };

   
    const handleNombreFilterChange = (e) => {
        setFilterNombre(e.target.value);
    };

    const handleSubidoPorFilterChange = (e) => {
        setFilterSubidoPor(e.target.value);
    };

   
    const handleSelectionChange = (selectedActas) => {
        setSelectedActa(selectedActas);
    };

    
    const handleClickCreate = () => {
        console.log("Usuario autenticado:", user); 
        console.log("Está autenticado:", isAuthenticated); 
        
        if (!isAuthenticated) {
            showErrorAlert("Error", "Debe estar autenticado para crear actas");
            return;
        }
        
        if (user && user.rol !== 'administrador' && user.rol !== 'directiva') {
            showErrorAlert("Error", "No tiene permisos para crear actas. Solo administradores y directiva pueden realizar esta acción.");
            return;
        }
        
        setIsEditMode(false);
        resetForm();
        setIsCreatePopupOpen(true);
    };

    
    const handleEditClick = (acta) => {
        if (!isAuthenticated) {
            showErrorAlert("Error", "Debe estar autenticado para editar actas");
            return;
        }
        
        if (user && user.rol !== 'administrador' && user.rol !== 'directiva') {
            showErrorAlert("Error", "No tiene permisos para editar actas. Solo administradores y directiva pueden realizar esta acción.");
            return;
        }
        
        setIsEditMode(true);
        setFormData({
            nombre: acta.nombre,
            archivo: null,
            asambleaId: acta.asambleaId || ''
        });
        handleClickEdit(acta);
        setIsEditPopupOpen(true);
    };

    
    const handleDelete = async (acta) => {
        if (!isAuthenticated) {
            showErrorAlert("Error", "Debe estar autenticado para eliminar actas");
            return;
        }
        
        if (user && user.rol !== 'administrador' && user.rol !== 'directiva') {
            showErrorAlert("Error", "No tiene permisos para eliminar actas. Solo administradores y directiva pueden realizar esta acción.");
            return;
        }
        
        await handleDeleteById(acta.id);
    };

    
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

    
    const filteredActas = actas.filter(acta => 
        acta.nombre.toLowerCase().includes(filterNombre.toLowerCase()) &&
        (acta.subidoPor || '').toLowerCase().includes(filterSubidoPor.toLowerCase())
    );

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Gestión de Actas</h1>
                    <div className='filter-actions'>
                        <input
                            type="text"
                            placeholder="Filtrar por nombre"
                            value={filterNombre}
                            onChange={handleNombreFilterChange}
                            className="search-input"
                        />
                        <input
                            type="text"
                            placeholder="Filtrar por quien subió"
                            value={filterSubidoPor}
                            onChange={handleSubidoPorFilterChange}
                            className="search-input"
                        />
                        <button 
                            onClick={handleClickCreate}
                            className="create-button"
                            disabled={isCreating}
                        >
                            {isCreating ? 'Creando...' : 'Crear Acta'}
                        </button>
                    </div>
                </div>

               
                <div className="actas-list">
                    {loading ? (
                        <p>Cargando actas...</p>
                    ) : filteredActas.length === 0 ? (
                        <p>No se encontraron actas</p>
                    ) : (
                        <table className="actas-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Asamblea</th>
                                    <th>Subido Por</th>
                                    <th>Fecha de Creación</th>
                                    <th>Archivo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredActas.map((acta) => (
                                    <tr key={acta.id}>
                                        <td>{acta.nombre}</td>
                                        <td>
                                            {acta.asamblea ? (
                                                <span>
                                                    {acta.asamblea.tema}
                                                    <br />
                                                    <small>{new Date(acta.asamblea.fecha).toLocaleDateString('es-ES')}</small>
                                                </span>
                                            ) : (
                                                <span className="no-asamblea">Sin asamblea</span>
                                            )}
                                        </td>
                                        <td>{acta.subidoPor || 'No especificado'}</td>
                                        <td>{formatDate(acta.createdAt)}</td>
                                        <td>
                                            <a 
                                                href={acta.archivo} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="archivo-link"
                                            >
                                                Ver PDF
                                            </a>
                                        </td>
                                        <td className="actions">
                                            <button 
                                                onClick={() => handleEditClick(acta)}
                                                className="edit-button"
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? 'Editando...' : 'Editar'}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(acta)}
                                                className="delete-button"
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
                        <h3>Gestión de Actas</h3>
                        <p>Administra todas las actas del sistema. Crea, edita y elimina actas según sea necesario.</p>
                    </div>
                    <div className="info-card">
                        <div className="info-card-icon">📁</div>
                        <h3>Archivos PDF</h3>
                        <p>Puedes ver y descargar los archivos PDF haciendo clic en "Ver PDF".</p>
                    </div>
                    <div className="info-card">
                        <div className="info-card-icon">📅</div>
                        <h3>Fechas y Control</h3>
                        <p>Visualiza las fechas de creación y controla quién subió cada acta al sistema.</p>
                    </div>
                </div>
            </div>

           
            {isCreatePopupOpen && (
                <div className="popup-overlay">
                    <div className="popup">
                        <div className="popup-header">
                            <h2>Crear Nueva Acta</h2>
                            <button 
                                onClick={() => {
                                    setIsCreatePopupOpen(false);
                                    resetForm();
                                }}
                                className="close-button"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="popup-form">
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre del Acta:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ingrese el nombre del acta"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="asambleaId">Asamblea (opcional):</label>
                                <select
                                    id="asambleaId"
                                    name="asambleaId"
                                    value={formData.asambleaId}
                                    onChange={handleChange}
                                >
                                    <option value="">Sin asamblea asociada</option>
                                    {asambleas && asambleas.map((asamblea) => (
                                        <option key={asamblea.id} value={asamblea.id}>
                                            {asamblea.tema} - {new Date(asamblea.fecha).toLocaleDateString('es-ES')}
                                        </option>
                                    ))}
                                </select>
                                {loadingAsambleas && <small>Cargando asambleas...</small>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="archivo">Archivo PDF:</label>
                                <input
                                    type="file"
                                    id="archivo"
                                    name="archivo"
                                    accept=".pdf"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="popup-actions">
                                <button 
                                    type="submit" 
                                    disabled={isCreating}
                                    className="submit-button"
                                >
                                    {isCreating ? 'Creando...' : 'Crear Acta'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsCreatePopupOpen(false);
                                        resetForm();
                                    }}
                                    className="cancel-button"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            
            {isEditPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup">
                        <div className="popup-header">
                            <h2>Editar Acta</h2>
                            <button 
                                onClick={closeEditPopup}
                                className="close-button"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="popup-form">
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre del Acta:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ingrese el nombre del acta"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="asambleaId">Asamblea (opcional):</label>
                                <select
                                    id="asambleaId"
                                    name="asambleaId"
                                    value={formData.asambleaId}
                                    onChange={handleChange}
                                >
                                    <option value="">Sin asamblea asociada</option>
                                    {asambleas && asambleas.map((asamblea) => (
                                        <option key={asamblea.id} value={asamblea.id}>
                                            {asamblea.tema} - {new Date(asamblea.fecha).toLocaleDateString('es-ES')}
                                        </option>
                                    ))}
                                </select>
                                {loadingAsambleas && <small>Cargando asambleas...</small>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="subidoPor">Subido Por:</label>
                                <input
                                    type="text"
                                    id="subidoPor"
                                    name="subidoPor"
                                    value={editingActa?.subidoPor || 'No especificado'}
                                    readOnly
                                    className="readonly-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="archivo">Archivo PDF (opcional):</label>
                                <input
                                    type="file"
                                    id="archivo"
                                    name="archivo"
                                    accept=".pdf"
                                    onChange={handleChange}
                                />
                                <small>Deje vacío si no desea cambiar el archivo</small>
                            </div>
                            <div className="popup-actions">
                                <button 
                                    type="submit" 
                                    disabled={isUpdating}
                                    className="submit-button"
                                >
                                    {isUpdating ? 'Actualizando...' : 'Actualizar Acta'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={closeEditPopup}
                                    className="cancel-button"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Acta;
