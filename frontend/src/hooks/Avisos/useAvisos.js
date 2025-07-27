import { useState, useEffect } from "react";
import { getAvisos } from "../../services/aviso.service";

export function useAvisos() {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAvisos = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAvisos();
      setAvisos(data);
    } catch (err) {
      setError("Error al cargar avisos");
      console.error("Error fetching avisos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvisos();
  }, []);

  return { avisos, loading, error, fetchAvisos };
}