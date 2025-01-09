import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // To hold admin status
  const [loading, setLoading] = useState<boolean>(true); // To handle loading state
  const [, setError] = useState<string | null>(null); // To hold error messages

  useEffect(() => {
    // Function to check if the user is an admin
    const checkAdminStatus = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setIsAdmin(false);
          return;
        }

        // Make an axios request to verify the admin status with the token
        const response = await axios.get('http://localhost:3000/admin/verify', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the Authorization header
          },
        });

        if (response.data.isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // console.error('Error checking admin status:', err);
        setError('Failed to verify admin status');
        setIsAdmin(false);
      } finally {
        setLoading(false); // Set loading to false once the request is complete
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <div className="min-h-screen bg-gray-50">{children}</div>;
};

export default AdminLayout;







