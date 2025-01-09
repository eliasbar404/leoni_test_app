import React, { useEffect, useState } from "react";
import { useParams, Link} from "react-router-dom";
import axios from "axios";
// import Swal from "sweetalert2";
import { XCircle } from 'lucide-react';

// Main Layout Component
const TestLayout = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams<{ id: string }>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [quiz, setQuiz] = useState<any>(null);

  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const checkTestAccess = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post("http://localhost:3000/quiz-check", { quizId: id }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          // Test is open and user can attempt
          fetchQuizData();
        } else {
          setError(response.data.error);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to check test access.");
      }
    };

    const fetchQuizData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/quiz/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuiz(response.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch quiz data.");
      }
    };

    checkTestAccess();
  }, [id]);

  if (error) {
    return <ErrorPage/>;
  }

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
};

export default TestLayout;






function ErrorPage() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="animate-bounce">
              <XCircle className="w-20 h-20 text-red-500" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800">
              Test Not Passed
            </h1>
            
            <div className="h-1 w-20 bg-red-500 rounded-full"></div>
            
            <p className="text-gray-600 text-lg">
              Unfortunately, you didn't meet the required criteria to pass this test.
            </p>
            
            <div className="bg-red-50 p-4 rounded-lg w-full">
              <h2 className="font-semibold text-red-700 mb-2">What's Next?</h2>
              <ul className="text-red-600 text-sm text-left space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Review your study materials
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Practice more with sample questions
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Try again when you feel ready
                </li>
              </ul>
            </div>
            
            <button 
              className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold
                       hover:bg-red-600 transform hover:-translate-y-1 transition-all
                       duration-200 shadow-md hover:shadow-lg"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>

            <Link to="/operateur/dashboard">Back to home page</Link>
          </div>
        </div>
      </div>
    );
  }