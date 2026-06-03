import { useState, useEffect } from "react";
import api from "../api/axios";

export function useFetch(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    try {
      setLoading(true);

      const response = await api.get(endpoint);

      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
