import { useState } from "react";
import { createAviso } from "../../services/aviso.service";

export function useCreateAviso(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (formData) => {
    setLoading(true);
    setError("");
    try {
      await createAviso(formData);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear aviso");
    }
    setLoading(false);
  };

  return { handleCreate, loading, error };
}