import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Upload, X } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { UserFormData } from '../../types/form';

import FormateurSelect from '../../components/FormateurSelect';






const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const userService = {
  getUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to fetch users'
      };
    }
  },

  createUser: async (formData: FormData) => {
    
    try {
      await api.post('/admin/users/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to create user'
      };
    }
  },

  deleteUser: async (id: string) => {
    try {
      await api.delete(`/admin/user/${id}`);
      return { error: null };
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Failed to delete user'
      };
    }
  }
};










const initialFormState: UserFormData = {
  firstName: '',
  lastName: '',
  cin: '',
  matricule: '',
  password: '',
  role: 'FORMATEUR',
  image: '',
  address: '',
  phone: '',
  gender:'FEMALE',
  groupeId: null,
  formateurId:null
};

const CreateUsersPage: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>(initialFormState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setFormData(prev => ({
      ...prev,
      [name]: name === 'formateurId' ? value : value, // Parse as an integer if formateurId
    }));
  };

  const handleImageChange = (file: File) => {
    if (!file.size) {
      setFormData(prev => ({ ...prev, image: '' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleFormSubmit(formData, userService);
    if (success) {
      setFormData(initialFormState);
    }
    // console.log(formData)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8">
          <UserPlus className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Créer Un Nouvel Utilisateur
          </h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <ImageUpload
            imageUrl={formData.image}
            onImageChange={handleImageChange}
          />

          <div className="flex flex-col gap-4">
            <FormInput
              label="Prénom"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Entrez le prénom"
              required
            />

            <FormInput
              label="Nom"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Entrez le nom"
              required
            />
          </div>

          <div className="flex flex-col gap-4">
            <FormInput
              label="CIN"
              name="cin"
              value={formData.cin}
              onChange={handleInputChange}
              placeholder="Entrez le CIN"
              required
            />

            <FormInput
              label="Matricule"
              name="matricule"
              value={formData.matricule}
              onChange={handleInputChange}
              placeholder="Entrez le matricule"
              required
            />
          </div>

          <div className="flex flex-col gap-4">
            <FormInput
              label="Adresse"
              name="address"
              value={formData.address||''}
              onChange={handleInputChange}
              placeholder="Entrez le Adresse"
            />

            <FormInput
              label="Numéro de Téléphone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              placeholder="Entrez le numéro de téléphone"
            />
          </div>

          <div className="flex flex-col gap-4">
            <FormInput
              label="Mot de Passe"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Entrez le mot de passe"
              required
            />

            <label htmlFor="gender">Genre</label>
            <select name="gender" id="gender" value={formData.gender} onChange={handleInputChange}>
              <option value="MALE">Homme</option>
              <option value="FEMALE">Femme</option>
            </select>

            <RoleSelect
              value={formData.role}
              onChange={handleInputChange}
            />

            {formData.role === "OPERATEUR" && <FormateurSelect
  name="formateurId" // The key in formData
  value={formData.formateurId ? Number(formData.formateurId) : null}

  onChange={handleInputChange} // Parent change handler
/>}




          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-colors font-medium"
          >
            Créer L'utilisateur
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUsersPage;






interface ImageUploadProps {
  imageUrl: string;
  onImageChange: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ imageUrl, onImageChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-center">
        <div className="relative">
          {imageUrl ? (
            <div className="relative w-32 h-32">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
              <button
                onClick={() => onImageChange(new File([], ''))}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-dashed border-gray-200 cursor-pointer hover:border-blue-500 transition-colors">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">Upload Photo</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};





interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </div>
  );
};





interface RoleSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const RoleSelect: React.FC<RoleSelectProps> = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
        Role
      </label>
      <select
        id="role"
        name="role"
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <option value="FORMATEUR">FORMATEUR</option>
        <option value="OPERATEUR">OPERATEUR</option>
      </select>
    </div>
  );
};






const handleFormSubmit = async (
  formData: UserFormData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userService: { getUsers?: () => Promise<{ data: any; error: null; } | { data: null; error: string; }>; createUser: any; deleteUser?: (id: string) => Promise<{ error: null; } | { error: string; }>; }
): Promise<boolean> => {
  try {
    const formDataToSend = new FormData();
    
    for (const [key, value] of Object.entries(formData)) {
      if (key === 'image' && value) {
        const response = await fetch(value);
        const blob = await response.blob();
        formDataToSend.append('image', blob, 'image.png');
      } else {
        formDataToSend.append(key, value);
      }
    }

    const { error } = await userService.createUser(formDataToSend);
    
    if (error) {
      throw new Error(error);
    }

    await Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: 'Utilisateur créé avec succès',
    });

    return true;
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: error instanceof Error ? error.message : 'Une erreur est survenue',
    });
    return false;
  }
};

