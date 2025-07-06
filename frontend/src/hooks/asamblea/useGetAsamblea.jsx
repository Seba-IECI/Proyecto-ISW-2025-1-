import { useState, useEffect, useCallback } from "react";
import { getAsamblea } from '@services/asamblea.service';

const useGetAsamblea = () => {
    const [asamblea, setAsamblea] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAsamblea = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAsamblea();
            setAsamblea(response.data || []);
            } catch (error) {
                setError(error.message || "Error al obtener la asamblea");
            }finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        fetchAsamblea();
    }, [fetchAsamblea]);

    return {
        fetchGetAsamblea: fetchAsamblea,
        asamblea,
        loading,
        error,
    };
};

export default useGetAsamblea;