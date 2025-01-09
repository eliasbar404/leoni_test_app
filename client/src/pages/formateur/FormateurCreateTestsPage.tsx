// import { useState } from "react";
// import axios from "axios";
// import { Question } from '../../types/quiz';
// import { PlusCircle, MinusCircle, Upload } from 'lucide-react';


// function FormateurCreateTestsPage() {
//   const [questionsCounter, setQuestionsCounter] = useState<number>(1);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [code, setCode] = useState("");
//   const [category, setCategory] = useState("");
//   const [difficulty, setDifficulty] = useState("EASY");
//   const [testPoints, setTestPoints] = useState<string>("1");
//   const [open_time,setOpen_time]  =  useState<string>("");
//   const [close_time,setClose_time]  =  useState<string>("");
//   const [timeLimit,setTimeLimit]  =  useState<string>("");


//   const [quizId, setQuizId] = useState<number | null>(null);

//   const [question, setQuestion] = useState<Question>({
//     text: "",
//     type: "ONE_SELECTE",
//     point: "1",
//     answers: [],
//     numberAnswers: []
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleQuizSubmit = async () => {
//     setError("");
//     setSuccess("");
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post("http://localhost:3000/formateur/quizzes", {
//         title,
//         description,
//         code,
//         category,
//         difficulty,
//         testPoints,
//         open_time,
//         close_time,
//         timeLimit,
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         }
//       });

//       if (response.data && response.data.id) {
//         setQuizId(response.data.id);
//         setSuccess("Quiz metadata submitted successfully! Now add questions.");
//       } else {
//         setError("Failed to retrieve quiz ID from the response.");
//       }
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (err: any) {
//       setError(err.response?.data?.error || "Failed to create quiz.");
//     }
//   };

//   const handleQuestionSubmit = async () => {
//     if (!quizId) {
//       setError("Quiz ID not found. Please submit quiz metadata first.");
//       return;
//     }

//     setError("");
//     setSuccess("");

//     const formData = new FormData();
//     formData.append("quizId", quizId.toString());
//     formData.append("text", question.text);
//     formData.append("type", question.type);
//     formData.append("point", question.point);

//     if (question.type === "IMAGE" && question.imageFile) {
//       formData.append("imageFile", question.imageFile);
//       formData.append("numberAnswers", JSON.stringify(question.numberAnswers));
//     } else {
//       formData.append("answers", JSON.stringify(question.answers));
//     }

//     try {
//       const token = localStorage.getItem("token");
//       await axios.post("http://localhost:3000/formateur/questions", formData, {
//         headers: { "Content-Type": "multipart/form-data"  ,Authorization: `Bearer ${token}`,},
//       });

//       setSuccess("Question submitted successfully! Add another.");
//       setQuestionsCounter(questionsCounter + 1);
//       setQuestion({ text: "", point: "1", type: "ONE_SELECTE", answers: [], numberAnswers: [] });
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (err: any) {
//       setError(err.response?.data?.error || "Failed to submit question.");
//     }
//   };

//   const addAnswer = () => {
//     setQuestion({
//       ...question,
//       answers: [...question.answers, { text: "", isCorrect: false }],
//     });
//   };

//   const updateAnswer = (index: number, text: string, isCorrect: boolean) => {
//     const updatedAnswers = [...question.answers];
//     updatedAnswers[index] = { text, isCorrect };
//     setQuestion({ ...question, answers: updatedAnswers });
//   };

//   const removeAnswer = (index: number) => {
//     setQuestion({
//       ...question,
//       answers: question.answers.filter((_, i) => i !== index),
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Créer Un Test</h1>
        
//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
//             <p className="text-red-700">{error}</p>
//           </div>
//         )}
        
//         {success && (
//           <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
//             <p className="text-green-700">{success}</p>
//           </div>
//         )}

//         {!quizId ? (
//           <QuizMetadataForm
//             title={title}
//             description={description}
//             testPoints={testPoints}
//             open_time={open_time}
//             close_time={close_time}
//             timeLimit={timeLimit}
//             category={category}
//             difficulty={difficulty}
//             code={code}
//             onSubmit={handleQuizSubmit}
//             onChange={{
//               setTitle,
//               setDescription,
//               setTestPoints,
//               setCategory,
//               setDifficulty,
//               setCode,
//               setOpen_time,
//               setClose_time,
//               setTimeLimit,
//             }}
//           />
//         ) : (
//           <QuestionForm
//             questionsCounter={questionsCounter}
//             question={question}
//             onQuestionChange={setQuestion}
//             onSubmit={handleQuestionSubmit}
//             onAddAnswer={addAnswer}
//             onUpdateAnswer={updateAnswer}
//             onRemoveAnswer={removeAnswer}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// export default FormateurCreateTestsPage;











// interface QuizMetadataFormProps {
//     title: string;
//     description: string;
//     testPoints: string;
//     category: string;
//     difficulty: string;
//     code: string;
//     open_time:string;
//     close_time:string;
//     timeLimit:string;
//     onSubmit: () => void;
//     onChange: {
//       setTitle: (value: string) => void;
//       setDescription: (value: string) => void;
//       setTestPoints: (value: string) => void;
//       setCategory: (value: string) => void;
//       setDifficulty: (value: string) => void;
//       setCode: (value: string) => void;
//       setOpen_time: (value:string) => void;
//       setClose_time : (value:string) => void;
//       setTimeLimit: (value:string) => void;
//     };
//   }
  
//   export function QuizMetadataForm({
//     title,
//     description,
//     testPoints,
//     category,
//     difficulty,
//     code,
//     open_time,
//     close_time,
//     timeLimit,
//     onSubmit,
//     onChange
//   }: QuizMetadataFormProps) {
//     return (
//       <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Titre
//             </label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => onChange.setTitle(e.target.value)}
//               placeholder="Entrez le titre"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
  
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Description
//             </label>
//             <textarea
//               value={description}
//               onChange={(e) => onChange.setDescription(e.target.value)}
//               placeholder="Entrez le description"
//               rows={4}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
  
//           <div className="flex flex-col">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Points du Test
//               </label>
//               <input
//                 type="text"
//                 value={testPoints}
//                 onChange={(e) => onChange.setTestPoints(e.target.value)}
//                 placeholder="Entrez le points du test"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
  
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Category
//               </label>
//               <input
//                 type="text"
//                 value={category}
//                 onChange={(e) => onChange.setCategory(e.target.value)}
//                 placeholder="Entrez le category"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           </div>
  
//           <div className="flex flex-col">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Difficulté
//               </label>
//               <select
//                 value={difficulty}
//                 onChange={(e) => onChange.setDifficulty(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               >
//                 <option value="EASY">FACILE</option>
//                 <option value="MEDIUM">MOYEN</option>
//                 <option value="HARD">DIFFICILE</option>
//               </select>
//             </div>
  
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Code de Test
//               </label>
//               <input
//                 type="text"
//                 value={code}
//                 onChange={(e) => onChange.setCode(e.target.value)}
//                 placeholder="Entrez unique Code de Test"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>

//             {/* Open Time */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Open Time
//               </label>
//               <input
//                 type="datetime-local"
//                 value={open_time}
//                 onChange={(e) => onChange.setOpen_time(e.target.value)}
//                 placeholder="Entrez unique Code de Test"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>

//             {/* Close Time */}

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Close Time
//               </label>
//               <input
//                 type="datetime-local"
//                 value={close_time}
//                 onChange={(e) => onChange.setClose_time(e.target.value)}
//                 placeholder="Entrez unique Code de Test"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>

//             {/* Time Limit */}

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Time Limit
//               </label>
//               <input
//                 type="number"
//                 value={timeLimit}
//                 onChange={(e) => onChange.setTimeLimit(e.target.value)}
//                 placeholder="Entrez unique Code de Test"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           </div>
          
          
//         </div>
  
//         <button
//           onClick={onSubmit}
//           className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
//         >
//           Soumettre Les Métadonnées du Test
//         </button>
//       </div>
//     );
//   }







// interface QuestionFormProps {
//   questionsCounter: number;
//   question: Question;
//   onQuestionChange: (question: Question) => void;
//   onSubmit: () => void;
//   onAddAnswer: () => void;
//   onUpdateAnswer: (index: number, text: string, isCorrect: boolean) => void;
//   onRemoveAnswer: (index: number) => void;
// }

// export function QuestionForm({
//   questionsCounter,
//   question,
//   onQuestionChange,
//   onSubmit,
//   onAddAnswer,
//   onUpdateAnswer,
//   onRemoveAnswer
// }: QuestionFormProps) {
//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
//       <h3 className="text-xl font-semibold text-gray-900">
//         Ajouter une question {questionsCounter}
//       </h3>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Texte de la Question
//           </label>
//           <input
//             type="text"
//             value={question.text}
//             onChange={(e) => onQuestionChange({ ...question, text: e.target.value })}
//             placeholder="Enter question text"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//         <div className="flex flex-col">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Point de la Question
//             </label>
//             <input
//               type="text"
//               value={question.point}
//               onChange={(e) => onQuestionChange({ ...question, point: e.target.value })}
//               placeholder="Enter question point"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Type de Questions
//             </label>
//             <select
//               value={question.type}
//               onChange={(e) => onQuestionChange({ ...question, type: e.target.value as Question["type"] })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="ONE_SELECTE">Single SELECTE</option>
//               <option value="MULTI_SELECTE">Multiple SELECTE</option>
//               <option value="IMAGE">Image-Based</option>
//             </select>
//           </div>
//         </div>

//         {(question.type === "ONE_SELECTE" || question.type === "MULTI_SELECTE" ) && (
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h4 className="text-lg font-medium text-gray-900">Réponses</h4>
//               <button
//                 onClick={onAddAnswer}
//                 className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
//               >
//                 <PlusCircle className="w-5 h-5 mr-1" />
//                 Ajouter une Réponse
//               </button>
//             </div>

//             <div className="space-y-3">
//               {question.answers.map((answer, index) => (
//                 <div key={index} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-md">
//                   <input
//                     type="text"
//                     value={answer.text}
//                     onChange={(e) => onUpdateAnswer(index, e.target.value, answer.isCorrect)}
//                     placeholder="Réponse text"
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                   <label className="flex items-center space-x-2">
//                     <input
//                       type={question.type === "ONE_SELECTE" ? "radio" : "checkbox"}
//                       name="correctAnswer"
//                       checked={answer.isCorrect}
//                       onChange={(e) => onUpdateAnswer(index, answer.text, e.target.checked)}
//                       className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
//                     />
//                     <span className="text-sm text-gray-600">Correct</span>
//                   </label>
//                   <button
//                     onClick={() => onRemoveAnswer(index)}
//                     className="text-red-600 hover:text-red-700"
//                   >
//                     <MinusCircle className="w-5 h-5" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {question.type === "IMAGE" && (
//           <div className="space-y-4">
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
//               <label className="flex flex-col items-center space-y-2 cursor-pointer">
//                 <Upload className="w-8 h-8 text-gray-400" />
//                 <span className="text-sm text-gray-600">Upload Image</span>
//                 <input
//                   type="file"
//                   className="hidden"
//                   onChange={(e) =>
//                     onQuestionChange({
//                       ...question,
//                       imageFile: e.target.files ? e.target.files[0] : undefined,
//                       imagePreviewUrl: e.target.files
//                         ? URL.createObjectURL(e.target.files[0])
//                         : undefined,
//                     })
//                   }
//                 />
//               </label>
//               {question.imagePreviewUrl && (
//                 <img
//                   src={question.imagePreviewUrl}
//                   alt="Preview"
//                   className="mt-4 max-w-full h-auto max-h-48 mx-auto rounded-lg"
//                 />
//               )}
//             </div>

//             <div className="space-y-3">
//               <h4 className="text-lg font-medium text-gray-900">Numbered Answers</h4>
//               {question.numberAnswers?.map((answer, index) => (
//                 <div key={index} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-md">
//                   <input
//                     type="number"
//                     value={answer.number}
//                     onChange={(e) =>
//                       onQuestionChange({
//                         ...question,
//                         numberAnswers: question.numberAnswers?.map((a, i) =>
//                           i === index
//                             ? { ...a, number: parseInt(e.target.value) }
//                             : a
//                         ),
//                       })
//                     }
//                     className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                   <input
//                     type="text"
//                     value={answer.text}
//                     onChange={(e) =>
//                       onQuestionChange({
//                         ...question,
//                         numberAnswers: question.numberAnswers?.map((a, i) =>
//                           i === index
//                             ? { ...a, text: e.target.value }
//                             : a
//                         ),
//                       })
//                     }
//                     placeholder="Answer text"
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                   <button
//                     onClick={() =>
//                       onQuestionChange({
//                         ...question,
//                         numberAnswers: question.numberAnswers?.filter(
//                           (_, i) => i !== index
//                         ),
//                       })
//                     }
//                     className="text-red-600 hover:text-red-700"
//                   >
//                     <MinusCircle className="w-5 h-5" />
//                   </button>
//                 </div>
//               ))}
//               <button
//                 onClick={() =>
//                   onQuestionChange({
//                     ...question,
//                     numberAnswers: [
//                       ...question.numberAnswers!,
//                       { number: 0, text: "" },
//                     ],
//                   })
//                 }
//                 className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
//               >
//                 <PlusCircle className="w-5 h-5 mr-1" />
//                 Add Numbered Answer
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <button
//         onClick={onSubmit}
//         className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
//       >
//         Submit Question
//       </button>
//     </div>
//   );
// }














import { useState } from "react";
import { PlusCircle, MinusCircle, Upload } from 'lucide-react';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  type: "ONE_SELECTE" | "MULTI_SELECTE" | "IMAGE_ONE_SELECTE"| "IMAGE_MULTI_SELECTE" | "CARD_ROUGE";
  point: string;
  answers: Answer[];
  imageFile?: File;
  imagePreviewUrl?: string;
}

function FormateurCreateTestPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [testPoints, setTestPoints] = useState("1");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState<Question[]>([{
    text: "",
    type: "ONE_SELECTE",
    point: "1",
    answers: []
  }]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    // Validate form data here
    if (!title || !description || !code || !category || !questions.length) {
      setError("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("code", code);
    formData.append("category", category);
    formData.append("difficulty", difficulty);
    formData.append("testPoints", testPoints);
    formData.append("openTime", openTime);
    formData.append("closeTime", closeTime);
    formData.append("timeLimit", timeLimit);
    formData.append("questions", JSON.stringify(questions.map(q => ({
      ...q,
      imageFile: undefined,
      imagePreviewUrl: undefined
    }))));

    // Append image files separately
    questions.forEach((question, index) => {
      if (question.imageFile) {
        formData.append(`questionImage_${index}`, question.imageFile);
      }
    });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/formateur/quizzes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }
      else{

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Soumis le test avec succès",
          showConfirmButton: false,
          timer: 1500
        }).then(()=>{
          navigate("/formateur/dashboard/tests")
        });
      }

      setSuccess("Quiz submitted successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setCode("");
      setCategory("");
      setDifficulty("EASY");
      setTestPoints("1");
      setOpenTime("");
      setCloseTime("");
      setTimeLimit("");
      setQuestions([{
        text: "",
        type: "ONE_SELECTE",
        point: "1",
        answers: []
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit quiz");
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      text: "",
      type: "ONE_SELECTE",
      point: "1",
      answers: []
    }]);
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addAnswer = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push({ text: "", isCorrect: false });
    setQuestions(newQuestions);
  };

  const updateAnswer = (questionIndex: number, answerIndex: number, text: string, isCorrect: boolean) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex] = { text, isCorrect };
    
    // For ONE_SELECTE type, ensure only one answer is correct
    if (newQuestions[questionIndex].type === "ONE_SELECTE" && isCorrect) {
      newQuestions[questionIndex].answers.forEach((answer, idx) => {
        if (idx !== answerIndex) {
          answer.isCorrect = false;
        }
      });
    }
    
    setQuestions(newQuestions);
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.filter((_, i) => i !== answerIndex);
    setQuestions(newQuestions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Créer Un Nouveau Test:</h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg p-6 space-y-6 mb-6">
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du Test"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Test Description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
              rows={4}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Test Code de l'accès"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="catégorie"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <div className="flex flex-col gap-2">
                <label htmlFor="difficulty" className="font-extrabold">Difficulté:</label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                    <option value="EASY">Facile</option>
                    <option value="MEDIUM">Moyen</option>
                    <option value="HARD">Difficile</option>
                  </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="testPoints" className="font-extrabold">Points de Test:</label>
                <input
                id="testPoints"
                type="number"
                value={testPoints}
                onChange={(e) => setTestPoints(e.target.value)}
                placeholder="Test Points"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="openTime" className="font-extrabold">Heure d'ouverture:</label>
                <input
                  id="openTime"
                  type="datetime-local"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="closeTime" className="font-extrabold">Fermer l'heure:</label>
                <input
                  id="closeTime"
                  type="datetime-local"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>


              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="Limite de temps (minutes)"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="bg-white shadow-lg rounded-lg p-6 space-y-6 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Question {questionIndex + 1}</h3>
              {questions.length > 1 && (
                <button
                  onClick={() => removeQuestion(questionIndex)}
                  className="text-red-600 hover:text-red-700"
                >
                  <MinusCircle className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={question.text}
                onChange={(e) => updateQuestion(questionIndex, { ...question, text: e.target.value })}
                placeholder="Question Text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(questionIndex, { ...question, type: e.target.value as Question["type"] })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="ONE_SELECTE">Question à une réponse</option>
                  <option value="MULTI_SELECTE">Question à réponses multiples</option>
                  <option value="IMAGE_ONE_SELECTE">Question (Image) à une réponse</option>
                  <option value="IMAGE_MULTI_SELECTE">Question (Image) à réponse multiple</option>
                </select>
                <input
                  type="number"
                  value={question.point}
                  onChange={(e) => updateQuestion(questionIndex, { ...question, point: e.target.value })}
                  placeholder="Points"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {(question.type === "IMAGE_ONE_SELECTE" || question.type === "IMAGE_MULTI_SELECTE") && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <label className="flex flex-col items-center space-y-2 cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            updateQuestion(questionIndex, {
                              ...question,
                              imageFile: file,
                              imagePreviewUrl: URL.createObjectURL(file)
                            });
                          }
                        }}
                      />
                    </label>
                    {question.imagePreviewUrl && (
                      <img
                        src={question.imagePreviewUrl}
                        alt="Preview"
                        className="mt-4 max-w-full h-auto max-h-48 mx-auto rounded-lg"
                      />
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">Réponses</h4>
                  <button
                    onClick={() => addAnswer(questionIndex)}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
                  >
                    <PlusCircle className="w-5 h-5 mr-1" />
                    Ajouter une réponse
                  </button>
                </div>

                {question.answers.map((answer, answerIndex) => (
                  <div key={answerIndex} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-md">
                    <input
                      type="text"
                      value={answer.text}
                      onChange={(e) => updateAnswer(questionIndex, answerIndex, e.target.value, answer.isCorrect)}
                      placeholder="Texte de réponse"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type={question.type === "ONE_SELECTE" || question.type === "IMAGE_ONE_SELECTE" ? "radio" : "checkbox"}
                        name={`correct_${questionIndex}`}
                        checked={answer.isCorrect}
                        onChange={(e) => updateAnswer(questionIndex, answerIndex, answer.text, e.target.checked)}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className="text-sm text-gray-600">Correct</span>
                    </label>
                    <button
                      onClick={() => removeAnswer(questionIndex, answerIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <MinusCircle className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between space-x-4">
          <button
            onClick={addQuestion}
            className="flex-1 bg-green-400 text-slate-100 font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            Ajouter une question
          </button>
          <button
            onClick={
              ()=>{
                                Swal.fire({
                                  title: "Êtes-vous sûr de vouloir soumettre ce test ?",
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
            className="flex-1 bg-indigo-600 text-white py-2 font-semibold px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Soumettre le Test
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormateurCreateTestPage;