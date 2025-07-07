import { useState } from "react";
import { deleteAviso } from "../../services/aviso.service";

export function useDeleteAviso(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async (id) => {
    setLoading(true);
    setError("");
    try {
      await deleteAviso(id);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Error al eliminar aviso");
    }
    setLoading(false);
  };

  return { handleDelete, loading, error };
}