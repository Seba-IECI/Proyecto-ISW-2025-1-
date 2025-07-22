import { useState } from "react";
import {deleteAsamblea} from '@services/asamblea.service';

const useDelAsamblea = () => {
    const [asamblea, setAsamblea] = useState({});

    const fetchDelAsamblea = async (id) => {
        try {
            const response = await deleteAsamblea(id);
            setAsamblea(response);
            return response; 
        } catch (error) {
            console.error("Error al eliminar la asamblea:", error);
            throw error; 
        }
    };

    return {
        fetchDelAsamblea,
        asamblea
    };   
};

export default useDelAsamblea;