import { useState } from "react";
import {updateAsamblea} from '@services/asamblea.service';

const useUpAsamblea = () => {
    const [asamblea, setAsamblea] = useState({});

    const fetchUpAsamblea = async (data, id) => {
        try {
            const response = await updateAsamblea(id, data);
            setAsamblea(response);
            return response; 
        } catch (error) {
            console.error("Error al actualizar la asamblea:", error);
            throw error; 
        }
    }

    return {
        fetchUpAsamblea,
        asamblea
    }
};

export default useUpAsamblea;