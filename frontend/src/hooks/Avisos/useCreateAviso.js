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
      if (onSuccess) {
        onSuccess();
      }
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al crear aviso";
      setError(errorMessage);
      setLoading(false);
      return { error: errorMessage };
    }
  };

  return { handleCreate, loading, error };
}