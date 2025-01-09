import React, { useState, useEffect } from 'react';
import axios from 'axios';



interface Formateur {
    id: number;
    firstName: string;
    lastName: string;
    role: 'FORMATEUR'; // Explicitly specify that this user has the role of 'FORMATEUR'
    cin: string;
    matricule: string;
    image?: string;
    address?: string;
    phone?: string;
    createdAt?: Date;
}


interface FormateurSelectProps {
    name: string;
    value: number | null; // Selected value as an integer or null
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }
  
  const FormateurSelect: React.FC<FormateurSelectProps> = ({ name, value, onChange }) => {
    const [formateurs, setFormateurs] = useState<Formateur[]>([]);
  
    useEffect(() => {
      const fetchFormateurs = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get<Formateur[]>('http://localhost:3000/formateurs', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.data) {
            setFormateurs(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch formateurs:', error);
        }
      };
  
      fetchFormateurs();
    }, []);
  
    return (
      <div className="w-full">
        <label htmlFor="formateur-select" className="block text-sm font-medium text-gray-700 mb-2">
          Assign Formateur
        </label>
        <select
          id="formateur-select"
          name={name} // Name prop for integration with the form
          value={value || ''} // Controlled value
          onChange={onChange} // Pass change event to parent
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        >
          <option value="">-- Select a Formateur --</option>
          {formateurs.map((formateur) => (
            <option key={formateur.id} value={formateur.id}>
              {formateur.firstName} {formateur.lastName}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default FormateurSelect;

