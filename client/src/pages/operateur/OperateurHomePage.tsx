import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function OperateurHomePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    quizTitle: '',
    quizCode: '',
    cin: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.quizTitle || !formData.quizCode || !formData.cin) {
      setError("Please fill in all fields");
      return;
    }
  
    // setLoading(true); // Set loading state
  
    try {
      const response = await axios.post("http://localhost:3000/quiz/access", formData);
  
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(`/operateur/dashboard/test/${response.data.quizId}`);
        });
      } else if (response.status === 400 || response.status === 404) {
        Swal.fire({
          title: "Error!",
          text: response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error:", err);
    } finally {
      // setLoading(false); // Reset loading state
    }
  };
  
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.quizTitle || !formData.quizCode || !formData.matricule) {
  //     setError("Please fill in all fields");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post("http://localhost:3000/quiz/access", formData);

  //     // Handle different status codes from the backend

  //     if (response.status === 200) {
  //       // Success: Show success alert and navigate
  //       Swal.fire({
  //         title: "Success!",
  //         text: response.data.message,
  //         icon: "success",
  //         confirmButtonText: "OK",
  //       });

  //       // Navigate to quiz page
  //       navigate(`/operateur/dashboard/test/${response.data.quizId}`);
  //       console.log(response.data.message);
  //     } else if (response.status === 400) {
  //       // Show an error alert if quiz is not yet open or has already closed
  //       Swal.fire({
  //         title: "Error!",
  //         text: response.data.message,
  //         icon: "error",
  //         confirmButtonText: "OK",
  //       });
  //     } else if (response.status === 404) {
  //       // Show error alert for quiz or user not found
  //       Swal.fire({
  //         title: "Error!",
  //         text: response.data.message,
  //         icon: "error",
  //         confirmButtonText: "OK",
  //       });
  //     }
  //   } catch (err) {
  //     // Show error alert for unexpected errors
  //     Swal.fire({
  //       title: "Error!",
  //       text: "An error occurred. Please try again.",
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //     console.error("Error:", err);
  //   }
  // };
  // const handleSubmit = async(e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!formData.quizTitle || !formData.quizCode || !formData.matricule) {
  //     setError('Please fill in all fields');
  //     return;
  //   }

  //   // "/quiz/access"
  //   const respose = await axios.post('http://localhost:3000/quiz/access',formData);


  //   // Here you would typically navigate to the quiz page or start the quiz
  //   navigate(`/operateur/dashboard/test/${respose.data.quizId}`);
  //   console.log(respose.data.message);
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <BookOpen className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Commencez votre Test</h2>
          <p className="mt-2 text-sm text-gray-600">
          Entrez vos coordonnées ci-dessous pour commencer l'évaluation
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white py-8 px-6 shadow-2xl rounded-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="quizTitle" className="block text-sm font-medium text-gray-700">
              Titre du test
              </label>
              <input
                type="text"
                id="quizTitle"
                name="quizTitle"
                value={formData.quizTitle}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Entrez le titre du test"
              />
            </div>

            <div>
              <label htmlFor="quizCode" className="block text-sm font-medium text-gray-700">
                Code du test
              </label>
              <input
                type="text"
                id="quizCode"
                name="quizCode"
                value={formData.quizCode}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Entrez le code du test"
              />
            </div>

            <div>
              <label htmlFor="cin" className="block text-sm font-medium text-gray-700">
                CIN
              </label>
              <input
                type="text"
                id="cin"
                name="cin"
                value={formData.cin}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Entrez votre cin"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Démarrer le test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OperateurHomePage;