import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      

      const response = await axios.post('http://localhost:3000/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return { handleLogout };
};