import { useState, useEffect } from 'react';
import axios from 'axios';

interface ProfileData {
  firstName: string;
  lastName: string;
  cin: string;
  matricule: string;
  image: string;
}

export const useProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/admin/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileData({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          cin: response.data.user.cin,
          matricule: response.data.user.matricule,
          image: response.data.user.image || '',
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profileData, loading, error };
};