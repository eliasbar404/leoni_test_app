import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const FormateurLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [isFormateur, setIsFormateur] = useState<boolean | null>(null); // To hold admin status
  const [loading, setLoading] = useState<boolean>(true); // To handle loading state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setError] = useState<string | null>(null); // To hold error messages

  useEffect(() => {
    // Function to check if the user is an admin
    const checkAdminStatus = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setIsFormateur(false);
          return;
        }

        // Make an axios request to verify the admin status with the token
        const response = await axios.get('http://localhost:3000/formateur/verify', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the Authorization header
          },
        });

        if (response.data.isFormateur) {
          setIsFormateur(true);
        } else {
          setIsFormateur(false);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // console.error('Error checking admin status:', err);
        setError('Failed to verify admin status');
        setIsFormateur(false);
      } finally {
        setLoading(false); // Set loading to false once the request is complete
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

//   if (error) {
//     return (
//       <div>
//         <p>{error}</p>
//         <button onClick={() => window.location.reload()}>Retry</button>
//       </div>
//     );
//   }

  // If the user is not an admin, redirect to home ("/")
  if (!isFormateur) {
    return <Navigate to="/" />;
  }

  return <div>{children}</div>;
};

export default FormateurLayout;