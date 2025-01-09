import { useState, useEffect } from 'react';
import axios from 'axios';

const useAdminStatistics = () => {
  const [statistics, setStatistics] = useState<{
    formaters: number;
    operateurs: number;
    quizzes: number;
    quizAttempt: number;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:3000/admin/statistics',{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStatistics({
          formaters: response.data.formaters,
          operateurs: response.data.operateurs,
          quizzes: response.data.quizzes,
          quizAttempt: response.data.quizAttempt,
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

export default useAdminStatistics;
