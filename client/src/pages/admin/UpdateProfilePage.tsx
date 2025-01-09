// import { useState, useEffect, ChangeEvent } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { ProfileData, PasswordData } from '../../types/Profile';
// import { ProfileHeader } from '../../components/ProfileHeader';
// import { ProfileImage } from '../../components/ProfileImage';
// import { InputField } from '../../components/InputField';

// export default function UpdateProfilePage() {
//   const navigate = useNavigate();
//   const [profileData, setProfileData] = useState<ProfileData | null>(null);
//   const [passwordData, setPasswordData] = useState<PasswordData>({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:3000/admin/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setProfileData({
//           firstName: response.data.user.firstName,
//           lastName: response.data.user.lastName,
//           cin: response.data.user.cin,
//           matricule: response.data.user.matricule,
//           image: response.data.user.image || '',
//         });
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       } catch (err) {
//         setError('Failed to load profile');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setProfileData((prev) => prev ? { ...prev, [name]: value } : null);
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileData((prev) =>
//           prev ? { ...prev, image: reader.result as string } : null
//         );
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setPasswordData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleProfileSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!profileData) return;

//     try {
//       const token = localStorage.getItem('token');
//       const formData = new FormData();
//       formData.append('firstName', profileData.firstName);
//       formData.append('lastName', profileData.lastName);
//       formData.append('cin', profileData.cin);
//       formData.append('matricule', profileData.matricule);

//       const imageInput = document.querySelector<HTMLInputElement>('input[type="file"]');
//       if (imageInput?.files?.[0]) {
//         formData.append('image', imageInput.files[0]);
//       }

//       await axios.put('http://localhost:3000/admin/profile/update', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       Swal.fire({
//         text: "Profile updated successfully!",
//         icon: "success"
//       });
//       navigate('/admin/dashboard/profile');
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Failed to update profile. Please try again!",
//       });
//     }
//   };

//   const handlePasswordSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       setError('New password and confirmation do not match');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         'http://localhost:3000/admin/password/update',
//         {
//           currentPassword: passwordData.currentPassword,
//           newPassword: passwordData.newPassword,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       Swal.fire({
//         text: "Password updated successfully",
//         icon: "success"
//       });
//       navigate('/profile');
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Failed to update password. Please try again!",
//       });
//     }
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//     </div>
//   );

//   if (error) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="text-red-500">{error}</div>
//     </div>
//   );

//   if (!profileData) return null;

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         <ProfileHeader />
        
//         <div className="space-y-8">
//           {/* Profile Section */}
//           <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
//             <h2 className="text-xl font-semibold mb-6">Informations Personnelles</h2>
//             <form onSubmit={handleProfileSubmit}>
//               <ProfileImage image={profileData.image} onImageChange={handleImageChange} />
              
//               <div className="grid md:grid-cols-2 gap-6">
//                 <InputField
//                   label="Prénom"
//                   name="firstName"
//                   value={profileData.firstName}
//                   onChange={handleProfileChange}
//                   placeholder="Entrez le prénom"
//                 />
//                 <InputField
//                   label="Nom"
//                   name="lastName"
//                   value={profileData.lastName}
//                   onChange={handleProfileChange}
//                   placeholder="Entrez le nom"
//                 />
//                 <InputField
//                   label="CIN"
//                   name="cin"
//                   value={profileData.cin}
//                   onChange={handleProfileChange}
//                   placeholder="Entrez le CIN"
//                 />
//                 <InputField
//                   label="Matricule"
//                   name="matricule"
//                   value={profileData.matricule}
//                   onChange={handleProfileChange}
//                   placeholder="Entrez le matricule"
//                 />
//               </div>

//               <div className="mt-6">
//                 <button
//                   type="submit"
//                   className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Mettre à jour le profil
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Password Section */}
//           <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
//             <h2 className="text-xl font-semibold mb-6">Changer le mot de passe</h2>
//             <form onSubmit={handlePasswordSubmit}>
//               <div className="space-y-4">
//                 <InputField
//                   label="Mot de passe actuel"
//                   name="currentPassword"
//                   type="password"
//                   value={passwordData.currentPassword}
//                   onChange={handlePasswordChange}
//                   placeholder="Entrez le mot de passe actuel"
//                 />
//                 <InputField
//                   label="Nouveau mot de passe"
//                   name="newPassword"
//                   type="password"
//                   value={passwordData.newPassword}
//                   onChange={handlePasswordChange}
//                   placeholder="Entrez le nouveau mot de passe"
//                 />
//                 <InputField
//                   label="Confirmer le nouveau mot de passe"
//                   name="confirmPassword"
//                   type="password"
//                   value={passwordData.confirmPassword}
//                   onChange={handlePasswordChange}
//                   placeholder="Confirmez le nouveau mot de passe"
//                 />
//               </div>

//               <div className="mt-6">
//                 <button
//                   type="submit"
//                   className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Mettre à jour le mot de passe
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Camera } from 'lucide-react';
import { ProfileData, PasswordData } from '../../types/Profile';
import { ProfileHeader } from '../../components/ProfileHeader';
// import { ProfileImageUpload } from '../components/ProfileImageUpload';
// import { ProfileForm } from '../components/forms/ProfileForm';
// import { PasswordForm } from '../components/forms/PasswordForm';


import { InputField } from '../../components/InputField';

export default function UpdateProfilePage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/admin/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfileData({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          cin: response.data.user.cin,
          matricule: response.data.user.matricule,
          image: response.data.user.image || '',
          role:'',
          address:'',
          phone:'',
          formateur:'',
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

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) =>
          prev ? { ...prev, image: reader.result as string } : null
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData) return;

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('firstName', profileData.firstName);
      formData.append('lastName', profileData.lastName);
      formData.append('cin', profileData.cin);
      formData.append('matricule', profileData.matricule);

      const imageInput = document.querySelector<HTMLInputElement>('input[type="file"]');
      if (imageInput?.files?.[0]) {
        formData.append('image', imageInput.files[0]);
      }

      await axios.put('http://localhost:3000/admin/profile/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire({
        text: "Profile updated successfully!",
        icon: "success"
      });
      navigate('/admin/dashboard/profile');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update profile. Please try again!",
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:3000/admin/password/update',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        text: "Password updated successfully",
        icon: "success"
      });
      navigate('/admin/dashboard/profile');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update password. Please try again!",
      });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  if (error && !profileData) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500">{error}</div>
    </div>
  );

  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ProfileHeader />
        
        <div className="space-y-8 mt-8">
          {/* Profile Update Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6">Informations Personnelles</h2>
            <ProfileImageUpload
              image={profileData.image??""}
              onImageChange={handleImageChange}
            />
            <ProfileForm
              profileData={profileData}
              onSubmit={handleProfileSubmit}
              onChange={handleProfileChange}
            />
          </div>

          {/* Password Update Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6">Changer le mot de passe</h2>
            <PasswordForm
              passwordData={passwordData}
              onSubmit={handlePasswordSubmit}
              onChange={handlePasswordChange}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}






interface ProfileFormProps {
  profileData: ProfileData;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function ProfileForm({ profileData, onSubmit, onChange }: ProfileFormProps) {
  return (

    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-col">
        <InputField
          label="Prénom"
          name="firstName"
          value={profileData.firstName}
          onChange={onChange}
          placeholder="Entrez le prénom"
        />
        <InputField
          label="Nom"
          name="lastName"
          value={profileData.lastName}
          onChange={onChange}
          placeholder="Entrez le nom"
        />
        <InputField
          label="CIN"
          name="cin"
          value={profileData.cin}
          onChange={onChange}
          placeholder="Entrez le CIN"
        />
        <InputField
          label="Matricule"
          name="matricule"
          value={profileData.matricule}
          onChange={onChange}
          placeholder="Entrez le matricule"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Mettre à jour le profil
        </button>
      </div>
    </form>
  );
}






interface PasswordFormProps {
  passwordData: PasswordData;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
}

function PasswordForm({ passwordData, onSubmit, onChange, error }: PasswordFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <InputField
          label="Mot de passe actuel"
          name="currentPassword"
          type="password"
          value={passwordData.currentPassword??""}
          onChange={onChange}
          placeholder="Entrez le mot de passe actuel"
        />
        <InputField
          label="Nouveau mot de passe"
          name="newPassword"
          type="password"
          value={passwordData.newPassword}
          onChange={onChange}
          placeholder="Entrez le nouveau mot de passe"
        />
        <InputField
          label="Confirmer le nouveau mot de passe"
          name="confirmPassword"
          type="password"
          value={passwordData.confirmPassword}
          onChange={onChange}
          placeholder="Confirmez le nouveau mot de passe"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Mettre à jour le mot de passe
        </button>
      </div>
    </form>
  );
}








interface ProfileImageUploadProps {
  image: string;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileImageUpload({ image, onImageChange }: ProfileImageUploadProps) {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      <img
        src={image || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop'}
        alt="Profile"
        className="w-full h-full object-cover rounded-full ring-4 ring-white shadow-lg"
      />
      <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
        <Camera size={20} className="text-white" />
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
        />
      </label>
    </div>
  );
}