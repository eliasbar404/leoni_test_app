import { useState, useEffect } from 'react';
import axios from 'axios';

const useFormateurStatistics = () => {
  const [statistics, setStatistics] = useState<{
    operateurs: number;
    groupes: number;
    tests: number;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:3000/formateur/statistics',{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        setStatistics({
          operateurs: response.data.operateurs,
          tests: response.data.tests,
          groupes: response.data.groupes,
        });
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once on mount

  return { statistics, loading, error };
};

export default useFormateurStatistics;