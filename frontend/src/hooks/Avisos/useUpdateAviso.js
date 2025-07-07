import { useState } from "react";
import { updateAviso } from "../../services/aviso.service";

export function useUpdateAviso(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async (id, formData) => {
    setLoading(true);
    setError("");
    try {
      await updateAviso(id, formData);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar aviso");
    }
    setLoading(false);
  };

  return { handleUpdate, loading, error };
}