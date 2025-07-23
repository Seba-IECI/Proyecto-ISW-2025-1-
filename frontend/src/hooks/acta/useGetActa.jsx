import { useState, useEffect } from 'react';
import { getActas } from '@services/acta.service.js';

const useGetActa = () => {
    const [actas, setActas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchActas = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getActas();
            
            if (response.status === 'Success') {
                const formattedData = response.data?.map(acta => ({
                    id: acta.id,
                    nombre: acta.nombre,
                    archivo: acta.archivo,
                    subidoPor: acta.subidoPor,
                    createdAt: acta.createdAt,
                    updatedAt: acta.updatedAt
                })) || [];
                setActas(formattedData);
            } else {
                setError(response.message || 'Error al obtener las actas');
                setActas([]);
            }
        } catch (error) {
            console.error("Error al obtener actas:", error);
            setError('Error interno del servidor');
            setActas([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActas();
    }, []);

    return { 
        actas, 
        loading, 
        error, 
        fetchActas, 
        setActas 
    };
};

export default useGetActa;
