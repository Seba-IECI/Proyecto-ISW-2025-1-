import { useState } from "react";
import { deleteAviso } from "../../services/aviso.service";

export function useDeleteAviso(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async (id) => {
    setLoading(true);
    setError("");
    try {
      const res = await deleteAviso(id);
      if (onSuccess) {
        onSuccess();
      }
      setLoading(false);
      return res;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al eliminar aviso";
      setError(errorMessage);
      setLoading(false);
      return { error: true, message: errorMessage };
    }
  };

  return { handleDelete, loading, error };
}