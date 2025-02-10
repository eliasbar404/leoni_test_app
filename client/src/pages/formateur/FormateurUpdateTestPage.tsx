// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { PlusCircle, MinusCircle, Upload, Printer } from 'lucide-react';
// import Swal from "sweetalert2";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";

// interface Answer {
//   text: string;
//   isCorrect: boolean;
//   answerNumber?: number | null;
//   id?: string;
// }

// interface Question {
//   id?: string;
//   text: string;
//   type: "ONE_SELECTE" | "MULTI_SELECTE" | "IMAGE_ONE_SELECTE" | "IMAGE_MULTI_SELECTE" | "CARD_ROUGE";
//   point: string;
//   answers: Answer[];
//   imageFile?: File;
//   imagePreviewUrl?: string;
//   imageUrl?: string;
// }

// const FormateurUpdateTestPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [code, setCode] = useState("");
//   const [category, setCategory] = useState("");
//   const [difficulty, setDifficulty] = useState("EASY");
//   const [testPoints, setTestPoints] = useState("1");
//   const [openTime, setOpenTime] = useState("");
//   const [closeTime, setCloseTime] = useState("");
//   const [status, setStatus] = useState("CLOSE");
//   const [timeLimit, setTimeLimit] = useState("");
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);

//   const formatQuestionType = (type: string): string => {
//     switch (type) {
//       case 'ONE_SELECTE':
//         return 'Question à choix unique';
//       case 'MULTI_SELECTE':
//         return 'Question à choix multiples';
//       case 'IMAGE_ONE_SELECTE':
//         return 'Question à choix unique avec image';
//       case 'IMAGE_MULTI_SELECTE':
//         return 'Question à choix multiples avec image';
//       case 'CARD_ROUGE':
//         return 'Carte Rouge';
//       default:
//         return type;
//     }
//   };

//   const generatePDF = () => {
//     const doc = new jsPDF();
    
//     // Set default font styles and margins
//     doc.setFont("helvetica");
//     const pageWidth = doc.internal.pageSize.width;
//     const margin = 20;
//     const contentWidth = pageWidth - (margin * 2);
    
//     // Add header with professional styling
//     doc.setFillColor(0, 32, 96); // Dark blue header
//     doc.rect(0, 0, pageWidth, 35, "F");
    
//     // Add header text
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(24);
//     doc.setFont("helvetica", "bold");
//     doc.text("Test d'Évaluation", pageWidth / 2, 25, { align: "center" });
    
//     // Reset text color for main content
//     doc.setTextColor(0, 0, 0);
    
//     // Add metadata section
//     let yPos = 50;
//     doc.setFontSize(16);
//     doc.setFont("helvetica", "bold");
//     doc.text("Informations Générales", margin, yPos);
    
//     // Add separator line
//     yPos += 5;
//     doc.setDrawColor(0, 32, 96);
//     doc.setLineWidth(0.5);
//     doc.line(margin, yPos, pageWidth - margin, yPos);
    
//     // Add test details in a structured format
//     yPos += 15;
//     doc.setFontSize(11);
//     doc.setFont("helvetica", "normal");
    
//     const testInfo = [
//       { label: "Titre", value: title },
//       { label: "Code", value: code },
//       { label: "Catégorie", value: category },
//       { label: "Niveau de Difficulté", value: difficulty === "EASY" ? "Facile" : difficulty === "MEDIUM" ? "Moyen" : "Difficile" },
//       { label: "Points Totaux", value: `${testPoints} points` },
//       { label: "Durée", value: `${timeLimit} minutes` }
//     ];
    
//     testInfo.forEach(info => {
//       doc.setFont("helvetica", "bold");
//       doc.text(`${info.label}:`, margin, yPos);
//       doc.setFont("helvetica", "normal");
//       doc.text(info.value, margin + 50, yPos);
//       yPos += 8;
//     });
    
//     // Add description section
//     yPos += 10;
//     doc.setFontSize(16);
//     doc.setFont("helvetica", "bold");
//     doc.text("Description", margin, yPos);
    
//     yPos += 5;
//     doc.line(margin, yPos, pageWidth - margin, yPos);
    
//     yPos += 10;
//     doc.setFontSize(11);
//     doc.setFont("helvetica", "normal");
//     const splitDescription = doc.splitTextToSize(description, contentWidth);
//     doc.text(splitDescription, margin, yPos);
    
//     yPos += (splitDescription.length * 7) + 15;
    
//     // Questions section
//     doc.setFontSize(16);
//     doc.setFont("helvetica", "bold");
//     doc.text("Questions", margin, yPos);
    
//     yPos += 5;
//     doc.line(margin, yPos, pageWidth - margin, yPos);
//     yPos += 15;
    
//     // Add each question
//     questions.forEach((question, index) => {
//       // Check if we need a new page
//       if (yPos > 250) {
//         doc.addPage();
//         yPos = 30;
//       }
      
//       // Question header with background
//       doc.setFillColor(240, 240, 240);
//       doc.rect(margin - 5, yPos - 5, contentWidth + 10, 12, "F");
      
//       doc.setFontSize(12);
//       doc.setFont("helvetica", "bold");
//       doc.text(`Question ${index + 1} (${question.point} points)`, margin, yPos);
      
//       yPos += 15;
      
//       // Question text
//       doc.setFontSize(11);
//       doc.setFont("helvetica", "normal");
//       const splitQuestion = doc.splitTextToSize(question.text, contentWidth - 10);
//       doc.text(splitQuestion, margin + 5, yPos);
      
//       yPos += (splitQuestion.length * 7) + 5;
      
//       // Question type
//       doc.setFont("helvetica", "italic");
//       doc.text(`Type: ${formatQuestionType(question.type)}`, margin + 5, yPos);
      
//       yPos += 10;
      
//       // Answers
//       question.answers.forEach((answer, answerIndex) => {
//         if (yPos > 270) {
//           doc.addPage();
//           yPos = 30;
//         }
        
//         // Answer box with light background for visual separation
//         doc.setFillColor(248, 249, 250);
//         doc.rect(margin + 5, yPos - 5, contentWidth - 15, 10, "F");
        
//         // Answer text with bullet point
//         doc.setFont("helvetica", "normal");
//         const bulletPoint = `${String.fromCharCode(65 + answerIndex)}.`;
//         doc.text(bulletPoint, margin + 10, yPos);
        
//         // Checkmark for correct answers
//         if (answer.isCorrect) {
//           doc.setFont("helvetica", "bold");
//           doc.text("✓", margin + 20, yPos);
//         }
        
//         doc.setFont("helvetica", "normal");
//         doc.text(answer.text, margin + 30, yPos);
        
//         yPos += 12;
//       });
      
//       yPos += 10;
//     });
    
//     // Add footer with page numbers
//     const pageCount = doc.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//       doc.setPage(i);
//       doc.setFontSize(10);
//       doc.setFont("helvetica", "normal");
//       doc.setTextColor(128, 128, 128);
//       doc.text(
//         `Page ${i} sur ${pageCount}`,
//         pageWidth / 2,
//         doc.internal.pageSize.height - 10,
//         { align: "center" }
//       );
//     }
    
//     // Save the PDF
//     doc.save(`test-${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
//   };

//   useEffect(() => {
//     const fetchTestData = async () => {
//       if (!id) return;

//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(`http://localhost:3000/formateur/test/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) throw new Error("Failed to fetch test data");

//         const data = await response.json();
        
//         const formatDate = (dateStr: string) => {
//           if (!dateStr) return "";
//           const date = new Date(dateStr);
//           return date.toISOString().slice(0, 16);
//         };

//         setTitle(data.title || "");
//         setDescription(data.description || "");
//         setCode(data.code || "");
//         setCategory(data.category || "");
//         setDifficulty(data.difficulty || "EASY");
//         setTestPoints(data.testPoints?.toString() || "1");
//         setStatus(data.status || "CLOSE");
//         setOpenTime(formatDate(data.open_time));
//         setCloseTime(formatDate(data.close_time));
//         setTimeLimit(data.timeLimit?.toString() || "");
        
//         const mappedQuestions = data.questions?.map((q: any) => ({
//           id: q.id,
//           text: q.text,
//           type: q.type,
//           point: q.point?.toString() || "1",
//           answers: q.answers?.map((a: any, index: number) => ({
//             id: a.id,
//             text: a.text,
//             isCorrect: a.isCorrect,
//             answerNumber: q.type.includes('IMAGE') ? index : null,
//           })) || [],
//           imageUrl: q.imageUrl || undefined,
//         })) || [];

//         setQuestions(mappedQuestions);
//         setOriginalQuestions(JSON.parse(JSON.stringify(mappedQuestions)));
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to fetch test data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTestData();
//   }, [id]);

//   const handleSubmit = async () => {
//     setError("");
//     setSuccess("");

//     if (!title || !description || !code || !category || !questions.length) {
//       setError("Veuillez remplir tous les champs obligatoires");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
      
//       const hasOnlyStatusChanged = 
//         title === originalQuestions.title &&
//         description === originalQuestions.description &&
//         code === originalQuestions.code &&
//         category === originalQuestions.category &&
//         difficulty === originalQuestions.difficulty &&
//         testPoints === originalQuestions.testPoints &&
//         openTime === originalQuestions.openTime &&
//         closeTime === originalQuestions.closeTime &&
//         timeLimit === originalQuestions.timeLimit &&
//         JSON.stringify(questions) === JSON.stringify(originalQuestions);

//       if (hasOnlyStatusChanged) {
//         const response = await fetch(`http://localhost:3000/formateur/quizzes/${id}/status`, {
//           method: "PATCH",
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ status })
//         });

//         if (!response.ok) throw new Error("Failed to update quiz status");
//       } else {
//         const formData = new FormData();
        
//         formData.append("title", title);
//         formData.append("description", description);
//         formData.append("code", code);
//         formData.append("category", category);
//         formData.append("difficulty", difficulty);
//         formData.append("testPoints", testPoints);
//         formData.append("status", status);
        
//         if (openTime) formData.append("openTime", openTime);
//         if (closeTime) formData.append("closeTime", closeTime);
//         if (timeLimit) formData.append("timeLimit", timeLimit);

//         const questionsData = questions.map(q => ({
//           id: q.id,
//           text: q.text,
//           type: q.type,
//           point: q.point,
//           answers: q.answers.map(a => ({
//             id: a.id,
//             text: a.text,
//             isCorrect: a.isCorrect,
//             answerNumber: q.type.includes('IMAGE') ? a.answerNumber : null,
//           })),
//           imageUrl: q.imageFile ? undefined : q.imageUrl
//         }));

//         formData.append("questions", JSON.stringify(questionsData));

//         questions.forEach((question, index) => {
//           if (question.imageFile) {
//             formData.append(`questionImage_${index}`, question.imageFile);
//           }
//         });

//         const response = await fetch(`http://localhost:3000/formateur/quizzes/${id}`, {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData
//         });

//         if (!response.ok) throw new Error("Failed to update quiz");
//       }

//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Mise à jour du test avec succès",
//         showConfirmButton: false,
//         timer: 1500
//       }).then(() => {
//         setTimeout(() => navigate("/formateur/dashboard/tests"), 500);
//       });

//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to update quiz");
//     }
//   };

//   const addQuestion = () => {
//     const newQuestion: Question = {
//       text: "",
//       type: "ONE_SELECTE",
//       point: "1",
//       answers: [{ text: "", isCorrect: false }]
//     };
//     setQuestions([...questions, newQuestion]);
//   };

//   const removeQuestion = (index: number) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions.splice(index, 1);
//     setQuestions(updatedQuestions);
//   };

//   const addAnswer = (questionIndex: number) => {
//     const updatedQuestions = [...questions];
//     const currentQuestion = updatedQuestions[questionIndex];
    
//     if (currentQuestion.type.includes('IMAGE')) {
//       currentQuestion.answers.push({
//         text: "",
//         isCorrect: false,
//         answerNumber: currentQuestion.answers.length
//       });
//     } else {
//       currentQuestion.answers.push({
//         text: "",
//         isCorrect: false
//       });
//     }
    
//     setQuestions(updatedQuestions);
//   };

//   const removeAnswer = (questionIndex: number, answerIndex: number) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[questionIndex].answers.splice(answerIndex, 1);
//     setQuestions(updatedQuestions);
//   };

//   const handleImageUpload = (questionIndex: number, file: File) => {
//     const updatedQuestions = [...questions];
//     const reader = new FileReader();
    
//     reader.onloadend = () => {
//       updatedQuestions[questionIndex].imageFile = file;
//       updatedQuestions[questionIndex].imagePreviewUrl = reader.result as string;
//       setQuestions(updatedQuestions);
//     };
    
//     reader.readAsDataURL(file);
//   };

//   const removeImage = (questionIndex: number) => {
//     const updatedQuestions = [...questions];
//     delete updatedQuestions[questionIndex].imageFile;
//     delete updatedQuestions[questionIndex].imagePreviewUrl;
//     setQuestions(updatedQuestions);
//   };

//   if (isLoading) {
//     return <div>Chargement...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Modifier le Test</h1>
//           <button
//             onClick={generatePDF}
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             <Printer className="w-5 h-5 mr-2" />
//             Exporter PDF
//           </button>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//             {error}
//           </div>
//         )}

//         <div className="bg-white shadow-md rounded-lg p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Titre du Test</label>
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 placeholder="Entrez le titre du test"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Code du Test</label>
//               <input
//                 type="text"
//                 value={code}
//                 onChange={(e) => setCode(e.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 placeholder="Entrez le code du test"
//               />
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Description</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows={3}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//               placeholder="Entrez la description du test"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Catégorie</label>
//               <input
//                 type="text"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 placeholder="Catégorie"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Difficulté</label>
//               <select
//                 value={difficulty}
//                 onChange={(e) => setDifficulty(e.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//               >
//                 <option value="EASY">Facile</option>
//                 <option value="MEDIUM">Moyen</option>
//                 <option value="HARD">Difficile</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Points du Test</label>
//               <input
//                 type="number"
//                 value={testPoints}
//                 onChange={(e) => setTestPoints(e.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 placeholder="Points"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Ouverture du Test</label>
//               <input
//                 type="datetime-local"
//                 value={openTime}
//                 onChange={(e) => setOpenTime(e.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Fermeture du Test</label>
//               <input
//                 type="datetime-local"
//                 value={closeTime}
//                 onChange={(e) => setCloseTime(e.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Limite de Temps (minutes)</label>
//               <input
//                 type="number"
//                 value={timeLimit}
//                 onChange={(e) => setTimeLimit(e.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 placeholder="Limite de temps"
//               />
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Statut du Test</label>
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             >
//               <option value="CLOSE">Fermé</option>
//               <option value="OPEN">Ouvert</option>
//             </select>
//           </div>

//           <div className="mb-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
//               <button
//                 onClick={addQuestion}
//                 className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//               >
//                 <PlusCircle className="w-5 h-5 mr-2" />
//                 Ajouter Question
//               </button>
//             </div>

//             {questions.map((question, questionIndex) => (
//               <div key={questionIndex} className="bg-gray-50 p-4 rounded-lg mb-4">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-medium text-gray-900">Question {questionIndex + 1}</h3>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => removeQuestion(questionIndex)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <MinusCircle className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Texte de la Question</label>
//                     <input
//                       type="text"
//                       value={question.text}
//                       onChange={(e) => {
//                         const updatedQuestions = [...questions];
//                         updatedQuestions[questionIndex].text = e.target.value;
//                         setQuestions(updatedQuestions);
//                       }}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                       placeholder="Entrez le texte de la question"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Type de Question</label>
//                     <select
//                       value={question.type}
//                       onChange={(e) => {
//                         const updatedQuestions = [...questions];
//                         updatedQuestions[questionIndex].type = e.target.value as Question['type'];
//                         updatedQuestions[questionIndex].answers = [{ text: "", isCorrect: false }];
//                         setQuestions(updatedQuestions);
//                       }}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                     >
//                       <option value="ONE_SELECTE">Sélection Unique</option>
//                       <option value="MULTI_SELECTE">Sélection Multiple</option>
//                       <option value="IMAGE_ONE_SELECTE">Image - Sélection Unique</option>
//                       <option value="IMAGE_MULTI_SELECTE">Image - Sélection Multiple</option>
//                       <option value="CARD_ROUGE">Carte Rouge</option>
//                     </select>
//                   </div>
//                 </div>

//                 {question.type.includes('IMAGE') && (
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700">Image de la Question</label>
//                     <div className="flex items-center space-x-4">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => {
//                           if (e.target.files && e.target.files[0]) {
//                             handleImageUpload(questionIndex, e.target.files[0]);
//                           }
//                         }}
//                         className="hidden"
//                         id={`image-upload-${questionIndex}`}
//                       />
//                       <label
//                         htmlFor={`image-upload-${questionIndex}`}
//                         className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
//                       >
//                         <Upload className="w-5 h-5 mr-2" />
//                         Télécharger
//                       </label>
//                       {(question.imagePreviewUrl || question.imageUrl) && (
//                         <div className="flex items-center space-x-2">
//                           <img
//                             src={question.imagePreviewUrl || question.imageUrl}
//                             alt="Question preview"
//                             className="w-20 h-20 object-cover rounded"
//                           />
//                           <button
//                             onClick={() => removeImage(questionIndex)}
//                             className="text-red-600 hover:text-red-800"
//                           >
//                             <MinusCircle className="w-5 h-5" />
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 <div className="mb-4">
//                   <div className="flex justify-between items-center mb-2">
//                     <label className="block text-sm font-medium text-gray-700">Points de la Question</label>
//                     <button
//                       onClick={() => addAnswer(questionIndex)}
//                       className="inline-flex items-center text-green-600 hover:text-green-800"
//                     >
//                       <PlusCircle className="w-5 h-5 mr-2" />
//                       Ajouter Réponse
//                     </button>
//                   </div>
//                   <input
//                     type="number"
//                     value={question.point}
//                     onChange={(e) => {
//                       const updatedQuestions = [...questions];
//                       updatedQuestions[questionIndex].point = e.target.value;
//                       setQuestions(updatedQuestions);
//                     }}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                     placeholder="Points"
//                   />
//                 </div>

//                 {question.answers.map((answer, answerIndex) => (
//                   <div key={answerIndex} className="bg-white p-3 rounded-lg mb-2 flex items-center space-x-2">
//                     <input
//                       type={question.type.includes('MULTI') ? 'checkbox' : 'radio'}
//                       name={`correct-${questionIndex}`}
//                       checked={answer.isCorrect}
//                       onChange={() => {
//                         const updatedQuestions = [...questions];
//                         const currentQuestion = updatedQuestions[questionIndex];
                        
//                         if (question.type.includes('MULTI')) {
//                           currentQuestion.answers[answerIndex].isCorrect = !answer.isCorrect;
//                         } else {
//                           currentQuestion.answers.forEach((a, idx) => {
//                             a.isCorrect = idx === answerIndex;
//                           });
//                         }
                        
//                         setQuestions(updatedQuestions);
//                       }}
//                       className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                     />
//                     <input
//                       type="text"
//                       value={answer.text}
//                       onChange={(e) => {
//                         const updatedQuestions = [...questions];
//                         updatedQuestions[questionIndex].answers[answerIndex].text = e.target.value;
//                         setQuestions(updatedQuestions);
//                       }}
//                       className="flex-grow block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                       placeholder={`Réponse ${answerIndex + 1}`}
//                      />
//                     <button
//                       onClick={() => removeAnswer(questionIndex, answerIndex)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <MinusCircle className="w-5 h-5" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end space-x-4">
//             <button
//               onClick={() => navigate("/formateur/dashboard/tests")}
//               className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
//             >
//               Annuler
//             </button>
//             <button
//               onClick={handleSubmit}
//               className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Enregistrer
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FormateurUpdateTestPage;




import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlusCircle, MinusCircle, Upload, Printer, ImageOff } from 'lucide-react';
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface Answer {
  text: string;
  isCorrect: boolean;
  answerNumber?: number | null;
  id?: string;
}

interface Question {
  id?: string;
  text: string;
  type: "ONE_SELECTE" | "MULTI_SELECTE" | "IMAGE_ONE_SELECTE" | "IMAGE_MULTI_SELECTE" | "CARD_ROUGE";
  point: string;
  answers: Answer[];
  imageFile?: File;
  imagePreviewUrl?: string;
  imageUrl?: string;
}

const FormateurUpdateTestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [testPoints, setTestPoints] = useState("1");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [status, setStatus] = useState("CLOSE");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);

  const formatQuestionType = (type: string): string => {
    switch (type) {
      case 'ONE_SELECTE':
        return 'Question à choix unique';
      case 'MULTI_SELECTE':
        return 'Question à choix multiples';
      case 'IMAGE_ONE_SELECTE':
        return 'Question à choix unique avec image';
      case 'IMAGE_MULTI_SELECTE':
        return 'Question à choix multiples avec image';
      case 'CARD_ROUGE':
        return 'Carte Rouge';
      default:
        return type;
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Set default font styles and margins
    doc.setFont("helvetica");
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Add header with professional styling
    doc.setFillColor(0, 32, 96); // Dark blue header
    doc.rect(0, 0, pageWidth, 35, "F");
    
    // Add header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Test d'Évaluation", pageWidth / 2, 25, { align: "center" });
    
    // Reset text color for main content
    doc.setTextColor(0, 0, 0);
    
    // Add metadata section
    let yPos = 50;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Informations Générales", margin, yPos);
    
    // Add separator line
    yPos += 5;
    doc.setDrawColor(0, 32, 96);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    
    // Add test details in a structured format
    yPos += 15;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    const testInfo = [
      { label: "Titre", value: title },
      { label: "Code", value: code },
      { label: "Catégorie", value: category },
      { label: "Niveau de Difficulté", value: difficulty === "EASY" ? "Facile" : difficulty === "MEDIUM" ? "Moyen" : "Difficile" },
      { label: "Points Totaux", value: `${testPoints} points` },
      { label: "Durée", value: `${timeLimit} minutes` }
    ];
    
    testInfo.forEach(info => {
      doc.setFont("helvetica", "bold");
      doc.text(`${info.label}:`, margin, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(info.value, margin + 50, yPos);
      yPos += 8;
    });
    
    // Add description section
    yPos += 10;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Description", margin, yPos);
    
    yPos += 5;
    doc.line(margin, yPos, pageWidth - margin, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const splitDescription = doc.splitTextToSize(description, contentWidth);
    doc.text(splitDescription, margin, yPos);
    
    yPos += (splitDescription.length * 7) + 15;
    
    // Questions section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Questions", margin, yPos);
    
    yPos += 5;
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;
    
    // Add each question
    questions.forEach((question, index) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 30;
      }
      
      // Question header with background
      doc.setFillColor(240, 240, 240);
      doc.rect(margin - 5, yPos - 5, contentWidth + 10, 12, "F");
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Question ${index + 1} (${question.point} points)`, margin, yPos);
      
      yPos += 15;
      
      // Question text
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const splitQuestion = doc.splitTextToSize(question.text, contentWidth - 10);
      doc.text(splitQuestion, margin + 5, yPos);
      
      yPos += (splitQuestion.length * 7) + 5;
      
      // Question type
      doc.setFont("helvetica", "italic");
      doc.text(`Type: ${formatQuestionType(question.type)}`, margin + 5, yPos);
      
      yPos += 10;
      
      // Answers
      question.answers.forEach((answer, answerIndex) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 30;
        }
        
        // Answer box with light background for visual separation
        doc.setFillColor(248, 249, 250);
        doc.rect(margin + 5, yPos - 5, contentWidth - 15, 10, "F");
        
        // Answer text with bullet point
        doc.setFont("helvetica", "normal");
        const bulletPoint = `${String.fromCharCode(65 + answerIndex)}.`;
        doc.text(bulletPoint, margin + 10, yPos);
        
        // Checkmark for correct answers
        if (answer.isCorrect) {
          doc.setFont("helvetica", "bold");
          doc.text("✓", margin + 20, yPos);
        }
        
        doc.setFont("helvetica", "normal");
        doc.text(answer.text, margin + 30, yPos);
        
        yPos += 12;
      });
      
      yPos += 10;
    });
    
    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} sur ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }
    
    // Save the PDF
    doc.save(`test-${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  useEffect(() => {
    const fetchTestData = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/formateur/test/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch test data");

        const data = await response.json();
        
        const formatDate = (dateStr: string) => {
          if (!dateStr) return "";
          const date = new Date(dateStr);
          return date.toISOString().slice(0, 16);
        };

        setTitle(data.title || "");
        setDescription(data.description || "");
        setCode(data.code || "");
        setCategory(data.category || "");
        setDifficulty(data.difficulty || "EASY");
        setTestPoints(data.testPoints?.toString() || "1");
        setStatus(data.status || "CLOSE");
        setOpenTime(formatDate(data.open_time));
        setCloseTime(formatDate(data.close_time));
        setTimeLimit(data.timeLimit?.toString() || "");
        
        const mappedQuestions = data.questions?.map((q: any) => ({
          id: q.id,
          text: q.text,
          type: q.type,
          point: q.point?.toString() || "1",
          answers: q.answers?.map((a: any, index: number) => ({
            id: a.id,
            text: a.text,
            isCorrect: a.isCorrect,
            answerNumber: q.type.includes('IMAGE') ? index : null,
          })) || [],
          imageUrl: q.imageUrl || undefined,
        })) || [];

        setQuestions(mappedQuestions);
        setOriginalQuestions(JSON.parse(JSON.stringify(mappedQuestions)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch test data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestData();
  }, [id]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!title || !description || !code || !category || !questions.length) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const hasOnlyStatusChanged = 
        title === originalQuestions.title &&
        description === originalQuestions.description &&
        code === originalQuestions.code &&
        category === originalQuestions.category &&
        difficulty === originalQuestions.difficulty &&
        testPoints === originalQuestions.testPoints &&
        openTime === originalQuestions.openTime &&
        closeTime === originalQuestions.closeTime &&
        timeLimit === originalQuestions.timeLimit &&
        JSON.stringify(questions) === JSON.stringify(originalQuestions);

      if (hasOnlyStatusChanged) {
        const response = await fetch(`http://localhost:3000/formateur/quizzes/${id}/status`, {
          method: "PATCH",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        });

        if (!response.ok) throw new Error("Failed to update quiz status");
      } else {
        const formData = new FormData();
        
        formData.append("title", title);
        formData.append("description", description);
        formData.append("code", code);
        formData.append("category", category);
        formData.append("difficulty", difficulty);
        formData.append("testPoints", testPoints);
        formData.append("status", status);
        
        if (openTime) formData.append("openTime", openTime);
        if (closeTime) formData.append("closeTime", closeTime);
        if (timeLimit) formData.append("timeLimit", timeLimit);

        const questionsData = questions.map(q => ({
          id: q.id,
          text: q.text,
          type: q.type,
          point: q.point,
          answers: q.answers.map(a => ({
            id: a.id,
            text: a.text,
            isCorrect: a.isCorrect,
            answerNumber: q.type.includes('IMAGE') ? a.answerNumber : null,
          })),
          imageUrl: q.imageFile ? undefined : q.imageUrl
        }));

        formData.append("questions", JSON.stringify(questionsData));

        questions.forEach((question, index) => {
          if (question.imageFile) {
            formData.append(`questionImage_${index}`, question.imageFile);
          }
        });

        const response = await fetch(`http://localhost:3000/formateur/quizzes/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData
        });

        if (!response.ok) throw new Error("Failed to update quiz");
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Mise à jour du test avec succès",
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        setTimeout(() => navigate("/formateur/dashboard/tests"), 500);
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update quiz");
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      text: "",
      type: "ONE_SELECTE",
      point: "1",
      answers: [{ text: "", isCorrect: false }]
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const addAnswer = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const currentQuestion = updatedQuestions[questionIndex];
    
    if (currentQuestion.type.includes('IMAGE')) {
      currentQuestion.answers.push({
        text: "",
        isCorrect: false,
        answerNumber: currentQuestion.answers.length
      });
    } else {
      currentQuestion.answers.push({
        text: "",
        isCorrect: false
      });
    }
    
    setQuestions(updatedQuestions);
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers.splice(answerIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleImageUpload = (questionIndex: number, file: File) => {
    // Add file size validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      setError("L'image est trop grande. La taille maximale est de 5MB.");
      return;
    }

    // Add file type validation
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError("Format d'image non valide. Utilisez JPG, PNG ou GIF.");
      return;
    }

    const updatedQuestions = [...questions];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      updatedQuestions[questionIndex].imageFile = file;
      updatedQuestions[questionIndex].imagePreviewUrl = reader.result as string;
      setQuestions(updatedQuestions);
    };

    reader.onerror = () => {
      setError("Erreur lors du chargement de l'image. Veuillez réessayer.");
    };
    
    reader.readAsDataURL(file);
  };

  const handleImageError = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].imageUrl = undefined;
    updatedQuestions[questionIndex].imagePreviewUrl = undefined;
    setQuestions(updatedQuestions);
    setError("Une ou plusieurs images n'ont pas pu être chargées.");
  };

  const removeImage = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    delete updatedQuestions[questionIndex].imageFile;
    delete updatedQuestions[questionIndex].imagePreviewUrl;
    delete updatedQuestions[questionIndex].imageUrl;
    setQuestions(updatedQuestions);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Modifier le Test</h1>
          <button
            onClick={generatePDF}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Printer className="w-5 h-5 mr-2" />
            Exporter PDF
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Titre du Test</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Entrez le titre du test"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Code du Test</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Entrez le code du test"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Entrez la description du test"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Catégorie</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Catégorie"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulté</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="EASY">Facile</option>
                <option value="MEDIUM">Moyen</option>
                <option value="HARD">Difficile</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Points du Test</label>
              <input
                type="number"
                value={testPoints}
                onChange={(e) => setTestPoints(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Points"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ouverture du Test</label>
              <input
                type="datetime-local"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fermeture du Test</label>
              <input
                type="datetime-local"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Limite de Temps (minutes)</label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Limite de temps"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Statut du Test</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="CLOSE">Fermé</option>
              <option value="OPEN">Ouvert</option>
            </select>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
              <button
                onClick={addQuestion}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Ajouter Question
              </button>
            </div>

            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Question {questionIndex + 1}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <MinusCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Texte de la Question</label>
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[questionIndex].text = e.target.value;
                        setQuestions(updatedQuestions);
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="Entrez le texte de la question"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type de Question</label>
                    <select
                      value={question.type}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[questionIndex].type = e.target.value as Question['type'];
                        updatedQuestions[questionIndex].answers = [{ text: "", isCorrect: false }];
                        setQuestions(updatedQuestions);
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="ONE_SELECTE">Sélection Unique</option>
                      <option value="MULTI_SELECTE">Sélection Multiple</option>
                      <option value="IMAGE_ONE_SELECTE">Image - Sélection Unique</option>
                      <option value="IMAGE_MULTI_SELECTE">Image - Sélection Multiple</option>
                      <option value="CARD_ROUGE">Carte Rouge</option>
                    </select>
                  </div>
                </div>

                {question.type.includes('IMAGE') && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Image de la Question</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageUpload(questionIndex, e.target.files[0]);
                          }
                        }}
                        className="hidden"
                        id={`image-upload-${questionIndex}`}
                      />
                      <label
                        htmlFor={`image-upload-${questionIndex}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Télécharger
                      </label>
                      {(question.imagePreviewUrl || question.imageUrl) ? (
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <img
                              src={question.imagePreviewUrl || question.imageUrl}
                              alt="Question preview"
                              className="w-20 h-20 object-cover rounded"
                              onError={() => handleImageError(questionIndex)}
                            />
                            <button
                              onClick={() => removeImage(questionIndex)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-500">
                          <ImageOff className="w-5 h-5" />
                          <span className="text-sm">Aucune image</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Points de la Question</label>
                    <button
                      onClick={() => addAnswer(questionIndex)}
                      className="inline-flex items-center text-green-600 hover:text-green-800"
                    >
                      <PlusCircle className="w-5 h-5 mr-2" />
                      Ajouter Réponse
                    </button>
                  </div>
                  <input
                    type="number"
                    value={question.point}
                    onChange={(e) => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[questionIndex].point = e.target.value;
                      setQuestions(updatedQuestions);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Points"
                  />
                </div>

                {question.answers.map((answer , answerIndex) => (
                  <div key={answerIndex} className="bg-white p-3 rounded-lg mb-2 flex items-center space-x-2">
                    <input
                      type={question.type.includes('MULTI') ? 'checkbox' : 'radio'}
                      name={`correct-${questionIndex}`}
                      checked={answer.isCorrect}
                      onChange={() => {
                        const updatedQuestions = [...questions];
                        const currentQuestion = updatedQuestions[questionIndex];
                        
                        if (question.type.includes('MULTI')) {
                          currentQuestion.answers[answerIndex].isCorrect = !answer.isCorrect;
                        } else {
                          currentQuestion.answers.forEach((a, idx) => {
                            a.isCorrect = idx === answerIndex;
                          });
                        }
                        
                        setQuestions(updatedQuestions);
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={answer.text}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[questionIndex].answers[answerIndex].text = e.target.value;
                        setQuestions(updatedQuestions);
                      }}
                      className="flex-grow block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder={`Réponse ${answerIndex + 1}`}
                    />
                    <button
                      onClick={() => removeAnswer(questionIndex, answerIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <MinusCircle className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate("/formateur/dashboard/tests")}
              className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormateurUpdateTestPage;













