


import { useState, useEffect } from "react";
import axios from "axios";
import { useParams ,useNavigate} from "react-router-dom";
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import Swal from "sweetalert2";
import TestLayout from "../../layouts/TestLayout";

// Types
interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  text: string;
  type: "ONE_SELECTE" | "MULTI_SELECTE" | "IMAGE_ONE_SELECTE" | "IMAGE_MULTI_SELECTE";
  point: number;
  answers: Answer[];
  imageUrl?: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

// Internal Components
const QuizProgress = ({ currentIndex, total }: { currentIndex: number; total: number }) => {
  const progress = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Question {currentIndex + 1} of {total}</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const QuestionImage = ({ imageUrl }: { imageUrl: string }) => (
  <div className="mb-4">
    <img
      src={imageUrl}
      alt="Question"
      className="w-full h-64 object-cover rounded-lg"
    />
  </div>
);

const AnswerOption = ({
  answer,
  isSelected,
  type,
  onSelect,
}: {
  answer: Answer;
  isSelected: boolean;
  type: Question["type"];
  onSelect: (answerId: number) => void;
}) => {
  const isRadio = type.includes("ONE_SELECTE");

  return (
    <button
      onClick={() => onSelect(answer.id)}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
        isSelected ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-center">
        <div
          className={`w-5 h-5 border-2 ${
            isRadio ? "rounded-full" : "rounded-md"
          } mr-3 ${
            isSelected
              ? "border-indigo-600 bg-indigo-600"
              : "border-gray-300"
          }`}
        />
        <span className="text-gray-800">{answer.text}</span>
      </div>
    </button>
  );
};

const NavigationButtons = ({
  currentIndex,
  totalQuestions,
  isAnswered,
  onPrevious,
  onNext,
  onSubmit,
}: {
  currentIndex: number;
  totalQuestions: number;
  isAnswered: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) => (
  <div className="flex justify-between items-center">
    <button
      onClick={onPrevious}
      disabled={currentIndex === 0}
      className={`flex items-center px-4 py-2 rounded-md ${
        currentIndex === 0
          ? "text-gray-400 cursor-not-allowed"
          : "text-indigo-600 hover:bg-indigo-50"
      }`}
    >
      <ChevronLeft className="w-5 h-5 mr-1" />
      Previous
    </button>

    {currentIndex === totalQuestions - 1 ? (
      <button
        onClick={onSubmit}
        disabled={!isAnswered}
        className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5 mr-2" />
        Submit Quiz
      </button>
    ) : (
      <button
        onClick={onNext}
        disabled={!isAnswered}
        className={`flex items-center px-4 py-2 rounded-md ${
          !isAnswered
            ? "text-gray-400 cursor-not-allowed"
            : "text-indigo-600 hover:bg-indigo-50"
        }`}
      >
        Next
        <ChevronRight className="w-5 h-5 ml-1" />
      </button>
    )}
  </div>
);

// Main Component
function TestPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const quizId = id ;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number[] }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId ) {
      setError("Invalid quiz ID.");
      setLoading(false);
      return;
    }

    const fetchQuiz = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://localhost:3000/quiz/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuiz(response.data);
        setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch quiz data. Please try again later.");
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const totalQuestions = quiz?.questions.length || 0;

 

  // const handleAnswerSelect = (answerId: number) => {
  //   if (!currentQuestion) return;
  
  //   const isOneSelect = currentQuestion.type.includes("ONE_SELECTE");
  
  //   setUserAnswers(prev => {
  //     const currentAnswers = prev[currentQuestion.id] || [];
  
  //     if (isOneSelect) {
  //       return {
  //         ...prev,
  //         [currentQuestion.id]: [String(answerId)], // Convert to string
  //       };
  //     }
  
  //     return {
  //       ...prev,
  //       [currentQuestion.id]: currentAnswers.includes(answerId)
  //         ? currentAnswers.filter(id => id !== answerId)
  //         : [...currentAnswers, answerId],
  //     };
  //   });
  // };
  const handleAnswerSelect = (answerId: number) => {
    if (!currentQuestion) return;
  
    const isOneSelect = currentQuestion.type.includes("ONE_SELECT");
  
    setUserAnswers(prev => {
      const currentAnswers = prev[currentQuestion.id] || [];
  
      if (isOneSelect) {
        return {
          ...prev,
          [currentQuestion.id]: [answerId],
        };
      }
  
      return {
        ...prev,
        [currentQuestion.id]: currentAnswers.includes(answerId)
          ? currentAnswers.filter(id => id !== answerId)
          : [...currentAnswers, answerId],
      };
    });
  };
  


  const handleSubmit = async () => {
    if (!quiz) return;
  
    try {
      const attemptData = {
        userId: 1, // Replace with actual user ID from auth context (e.g., from context or token)
        quizId: quiz.id,
        answers: Object.entries(userAnswers).map(([questionId, selectedAnswers]) => ({
          questionId: questionId,  // Keep the questionId as a string if it's UUID
          selectedAnswerIds: selectedAnswers,
        })),
      };
      
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:3000/quiz-attempts", attemptData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizSubmitted(true);
            // Show SweetAlert2 alert with the score and navigate to home page after confirmation
      const { score, correctAnswers } = response.data.quizAttempt;


      Swal.fire({
        title: 'Quiz Submitted!',
        text: `You scored ${score} out of ${quiz.questions.length} with ${correctAnswers} correct answers.`,
        icon: 'success',
        confirmButtonText: 'Go to Home',
      }).then(() => {
        navigate("/operateur/dashboard"); // Navigate to the homepage
      });
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      setError("Failed to submit quiz. Please try again.");
    }
  };
  

  if (loading) return <div className="text-center mt-12">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-12">{error}</div>;
  if (!quiz) return <div className="text-center mt-12">No quiz data available.</div>;
  if (quizSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Submitted!</h2>
            <p className="text-gray-600">Thank you for completing the quiz.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TestLayout>
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <QuizProgress
            currentIndex={currentQuestionIndex}
            total={totalQuestions}
          />

          {currentQuestion && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentQuestion.text}
              </h2>
              
              {currentQuestion.imageUrl && (
                <QuestionImage imageUrl={currentQuestion.imageUrl} />
              )}

              <div className="space-y-3">
                {currentQuestion.answers.map((answer) => (
                  <AnswerOption
                    key={answer.id}
                    answer={answer}
                    isSelected={userAnswers[currentQuestion.id]?.includes(answer.id)}
                    type={currentQuestion.type}
                    onSelect={handleAnswerSelect}
                  />
                ))}
              </div>
            </div>
          )}

          <NavigationButtons
            currentIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            isAnswered={!!userAnswers[currentQuestion?.id ?? -1]?.length}
            onPrevious={() => setCurrentQuestionIndex(prev => prev - 1)}
            onNext={() => setCurrentQuestionIndex(prev => prev + 1)}
            onSubmit={

              ()=>{
                Swal.fire({
                  title: "Etes-vous sûr de soumettre vos réponses ?",
                  showCancelButton: true,
                  confirmButtonText: "OUI",
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    handleSubmit()
                  }
                });
              }
             
            
            }
          />
        </div>
      </div>
    </div>
    </TestLayout>
  );
}

export default TestPage;



