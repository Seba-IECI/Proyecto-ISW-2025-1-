import { useState } from "react";
import { createAviso } from "../../services/aviso.service";

export function useCreateAviso(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (formData) => {
    setLoading(true);
    setError("");
    try {
      const result = await createAviso(formData);
      if (onSuccess) onSuccess();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear aviso");
      setLoading(false);
      return { error: err.response?.data?.message || "Error al crear aviso" };
    }
  };

  return { handleCreate, loading, error };
}