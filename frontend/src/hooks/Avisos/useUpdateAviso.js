import { useState } from "react";
import { updateAviso } from "../../services/aviso.service";

export function useUpdateAviso(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async (id, formData) => {
    setLoading(true);
    setError("");
    try {
      const result = await updateAviso(id, formData);
      if (onSuccess) {
        onSuccess();
      }
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al actualizar aviso";
      setError(errorMessage);
      setLoading(false);
      return { error: errorMessage };
    }
  };

  return { handleUpdate, loading, error };
}