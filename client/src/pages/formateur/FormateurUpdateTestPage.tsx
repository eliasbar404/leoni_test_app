import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlusCircle, MinusCircle, Upload } from 'lucide-react';
import Swal from "sweetalert2";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  type: "ONE_SELECTE" | "MULTI_SELECTE" | "IMAGE_ONE_SELECTE" | "IMAGE_MULTI_SELECTE" | "CARD_ROUGE";
  point: string;
  answers: Answer[];
  imageFile?: File;
  imagePreviewUrl?: string;
  imageUrl?:string;
}

const FormateurUpdateTestPage = ()=> {
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
  const [status,setStatus]        = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        console.log(data)
        
        // Pre-populate form data
        setTitle(data.title || "");
        setDescription(data.description || "");
        setCode(data.code || "");
        setCategory(data.category || "");
        setDifficulty(data.difficulty || "EASY");
        setTestPoints(data.testPoints?.toString() || "1");
        setStatus(data.status || "CLOSE")
        setOpenTime(data.openTime || "");
        setCloseTime(data.closeTime || "");
        setTimeLimit(data.timeLimit?.toString() || "");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setQuestions(data.questions?.map((q: any) => ({
          ...q,
          point: q.point?.toString() || "1",
          answers: q.answers || []
        })) || []);
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
    formData.append("status", status);
    
    // Clean questions data before sending
    const cleanQuestions = questions.map(q => ({
      ...q,
      imageFile: undefined,
      imagePreviewUrl: undefined
    }));
    formData.append("questions", JSON.stringify(cleanQuestions));

    // Append images separately
    questions.forEach((question, index) => {
      if (question.imageFile) {
        formData.append(`questionImage_${index}`, question.imageFile);
      }
    });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/formateur/quizzes/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) throw new Error("Failed to update quiz");
      else{
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Mise à jour du test avec succès",
            showConfirmButton: false,
            timer: 1500
          }).then(()=>{
            setTimeout(() => navigate("/formateur/dashboard/tests"), 500);
          });

        

      }

      setSuccess("Test mis à jour avec succès!");
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update quiz");
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
    
    // For single select questions, ensure only one answer is correct
    if ((newQuestions[questionIndex].type === "ONE_SELECTE" || 
         newQuestions[questionIndex].type === "IMAGE_ONE_SELECTE") && isCorrect) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Modifier le Test</h1>

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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du Test"
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Code d'accès"
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Catégorie"
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Difficulté</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="EASY">Facile</option>
                  <option value="MEDIUM">Moyen</option>
                  <option value="HARD">Difficile</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Points du Test</label>
                <input
                  type="number"
                  value={testPoints}
                  onChange={(e) => setTestPoints(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Heure d'ouverture</label>
                <input
                  type="datetime-local"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Heure de fermeture</label>
                <input
                  type="datetime-local"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Limite de temps (minutes)</label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select name="" id="" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="CLOSE">CLOSE</option>
                    <option value="OPEN">OPEN</option>
                </select>

              </div>
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
                placeholder="Texte de la question"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Type de question</label>
                  <select
                    value={question.type}
                    onChange={(e) => updateQuestion(questionIndex, { 
                      ...question, 
                      type: e.target.value as Question["type"]
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ONE_SELECTE">Question à une réponse</option>
                    <option value="MULTI_SELECTE">Question à réponses multiples</option>
                    <option value="IMAGE_ONE_SELECTE">Question (Image) à une réponse</option>
                    <option value="IMAGE_MULTI_SELECTE">Question (Image) à réponses multiples</option>
                    <option value="CARD_ROUGE">Carte Rouge</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Points</label>
                  <input
                    type="number"
                    value={question.point}
                    onChange={(e) => updateQuestion(questionIndex, { ...question, point: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {(question.type === "IMAGE_ONE_SELECTE" || question.type === "IMAGE_MULTI_SELECTE") && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <label className="flex flex-col items-center space-y-2 cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">Télécharger une image</span>
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
                    {question.imagePreviewUrl ? (
                      <img
                        src={question.imagePreviewUrl}
                        alt="Aperçu"
                        className="mt-4 max-w-full h-auto max-h-48 mx-auto rounded-lg"
                      />
                    ) : (

                        <img
                        src={question.imageUrl}
                        alt="Aperçu"
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type={question.type === "ONE_SELECTE" || question.type === "IMAGE_ONE_SELECTE" ? "radio" : "checkbox"}
                        name={`correct_${questionIndex}`}
                        checked={answer.isCorrect}
                        onChange={(e) => updateAnswer(questionIndex, answerIndex, answer.text, e.target.checked)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-600">Correcte</span>
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
            className="flex-1 bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200"
          >
            Ajouter une question
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Mettre à jour le test
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormateurUpdateTestPage;
