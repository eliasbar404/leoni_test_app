import { useState, useEffect } from 'react';
import axios from 'axios';

interface ProfileData {
    firstName: string;
    lastName: string;
    cin: string;
    matricule: string;
    image: string;
    address:string;
    phone:string;
    formateur:string;
}

export const useOperateurProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/operateur/profile', {
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
          address:response.data.user.address,
          phone:response.data.user.phone,
          formateur:response.data.user.formateur.firstName+" "+response.data.user.formateur.lastName,
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