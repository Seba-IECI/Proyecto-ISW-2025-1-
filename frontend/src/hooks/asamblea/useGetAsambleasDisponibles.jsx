import { useState, useEffect, useCallback } from "react";
import { getAsambleasDisponibles } from '@services/asamblea.service';

const useGetAsambleasDisponibles = () => {
    const [asambleasDisponibles, setAsambleasDisponibles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAsambleasDisponibles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAsambleasDisponibles();
            setAsambleasDisponibles(response.data || []);
        } catch (error) {
            setError(error.message || "Error al obtener las asambleas disponibles");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAsambleasDisponibles();
    }, [fetchAsambleasDisponibles]);

    return {
        fetchAsambleasDisponibles,
        asambleasDisponibles,
        loading,
        error,
    };
};

export default useGetAsambleasDisponibles;
