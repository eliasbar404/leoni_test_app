import React, { useState } from 'react';


interface LoginFormProps {
  onSubmit: (cin: string, password: string) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {

  const [formData, setFormData] = useState({
    cin: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData.cin, formData.password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (

    <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md mx-auto p-4 space-y-4">
  {/* CIN Field */}
  <input
    type="text"
    id="cin"
    name="cin"
    value={formData.cin}
    onChange={handleChange}
    placeholder="CIN"
    required
    className="w-full max-w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />

  {/* Password Field */}
  <input
    type="password"
    id="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    placeholder="Mot De Passe"
    required
    className="w-full max-w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full py-3 bg-blue-800 text-white font-bold text-lg rounded-md hover:bg-blue-700 transition duration-200"
  >
    Se Connecter
  </button>
</form>

  );
}
