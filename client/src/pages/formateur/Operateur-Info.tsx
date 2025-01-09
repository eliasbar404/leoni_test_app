// import { useEffect, useState, useRef } from 'react';
// import { User, BadgeCheck, Phone, MapPin, Award, BookOpen, Edit2, Save, X, Download, Pencil, Mail, Building, Clock } from 'lucide-react';
// import { jsPDF } from 'jspdf';
// import toast, { Toaster } from 'react-hot-toast';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// interface TestAttempt {
//   id:string;
//   title: string;
//   date: string;
//   score: number;
//   testPoints: number;
// }

// interface OperatorData {
//   id: string;
//   firstName: string;
//   lastName: string;
//   cin: string;
//   matricule: string;
//   role: string;
//   image: string | null;
//   address: string;
//   phone: string;
//   email: string;
//   department: string;
//   createdAt: string;
//   formateurName: string | null;
//   groupName: string | null;
//   testAttempts: TestAttempt[];
// }

// function OperateurInfo() {
//   const { id } = useParams<{ id: string }>();
//   const [operator, setOperator] = useState<OperatorData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [editingAttempt, setEditingAttempt] = useState<number | null>(null);
//   const [editScore, setEditScore] = useState<number>(0);
//   const [showSignatureModal, setShowSignatureModal] = useState(false);
//   const [signature, setSignature] = useState<string | null>(null);
//   const [pdfPreview, setPdfPreview] = useState<string | null>(null);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [downloadReady, setDownloadReady] = useState(false);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const isDrawing = useRef(false);



//   const EditScore = async (id: string) => {
//     const data = {
//       new_score: editScore, // Assuming `editScore` is a variable holding the score
//     };
    
//     const token = localStorage.getItem("token");
  
//     try {
//       const res = await axios.put(`http://localhost:3000/test-attempt/${id}`, data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//       if (res.status === 200) {
//         Swal.fire({
//           title: "Good job!",
//           text: "The score was updated successfully.",
//           icon: "success",
//         });
//       } else {
//         // Handle non-200 responses
//         Swal.fire({
//           title: "Error!",
//           text: "There was an issue updating the score.",
//           icon: "error",
//         });
//       }
//     } catch (error) {
//       // Catch any errors during the request
//       console.error("Error updating score:", error);
//       Swal.fire({
//         title: "Error!",
//         text: "Failed to update the score. Please try again.",
//         icon: "error",
//       });
//     }
//   };
  



//   useEffect(() => {
//     const fetchOperator = async () => {
//       try {
//         const response = await fetch(`http://localhost:3000/operateur/${id}/info`);
//         if (!response.ok) throw new Error('Failed to fetch operator data');
//         const data = await response.json();
//         setOperator(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An error occurred');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOperator();
//   }, [id]);

//   // Canvas signature handlers
//   const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     isDrawing.current = true;
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (!ctx || !canvas) return;

//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//   };

//   const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!isDrawing.current) return;
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (!ctx || !canvas) return;

//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   const stopDrawing = () => {
//     isDrawing.current = false;
//     const canvas = canvasRef.current;
//     if (canvas) {
//       setSignature(canvas.toDataURL());
//     }
//   };

//   const clearSignature = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (!ctx || !canvas) return;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     setSignature(null);
//   };

//   // PDF generation
//   const generatePDF = (withSignature = false) => {
//     if (!operator) return;

//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
    
//     // Header with gradient
//     doc.setFillColor(63, 81, 181);
//     doc.rect(0, 0, pageWidth, 40, 'F');
//     doc.setFillColor(92, 107, 192);
//     doc.rect(0, 40, pageWidth, 5, 'F');
    
//     // Title
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(24);
//     doc.text('Operator Certification Report', pageWidth / 2, 25, { align: 'center' });
    
//     let yPos = 60;
    
//     // Personal Information
//     doc.setTextColor(0, 0, 0);
//     doc.setFontSize(16);
//     doc.text('Personal Information', 15, yPos);
//     yPos += 10;
//     doc.setFontSize(12);
//     doc.text(`Name: ${operator.firstName} ${operator.lastName}`, 15, yPos);
//     doc.text(`Role: ${operator.role}`, pageWidth / 2, yPos);
//     yPos += 8;
//     doc.text(`CIN: ${operator.cin}`, 15, yPos);
//     doc.text(`Matricule: ${operator.matricule}`, pageWidth / 2, yPos);
    
//     yPos += 20;
    
//     // Contact Information
//     doc.setFontSize(16);
//     doc.text('Contact Information', 15, yPos);
//     yPos += 10;
//     doc.setFontSize(12);
//     doc.text(`Phone: ${operator.phone}`, 15, yPos);
//     doc.text(`Email: ${operator.email}`, pageWidth / 2, yPos);
//     yPos += 8;
//     doc.text(`Address: ${operator.address}`, 15, yPos);
//     doc.text(`Department: ${operator.department}`, pageWidth / 2, yPos);
    
//     yPos += 20;
    
//     // Test Results
//     doc.setFontSize(16);
//     doc.text('Test Results', 15, yPos);
//     yPos += 10;
//     doc.setFontSize(12);
    
//     operator.testAttempts.forEach((attempt) => {
//       const score = (attempt.score / attempt.testPoints) * 100;
//       doc.text(`${attempt.title}: ${score}%`, 15, yPos);
//       doc.text(`Date: ${new Date(attempt.date).toLocaleDateString()}`, pageWidth / 2, yPos);
//       yPos += 8;
//     });
    
//     // Add signature if exists
//     if (withSignature && signature) {
//       yPos += 20;
//       doc.text('Authorized Signature:', 15, yPos);
//       yPos += 5;
//       doc.addImage(signature, 'PNG', 15, yPos, 50, 25);
//     }
    
//     // Footer with metadata
//     doc.setFontSize(10);
//     doc.setTextColor(128, 128, 128);
//     const timestamp = new Date().toLocaleString();
//     const docId = Math.random().toString(36).substr(2, 9);
//     doc.text(`Generated on ${timestamp} | Document ID: ${docId}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    
//     if (withSignature) {
//       const fileName = `${operator.firstName}_${operator.lastName}_${new Date().toISOString().split('T')[0]}.pdf`;
//       doc.save(fileName);
//       setShowSignatureModal(false);
//     } else {
//       const pdfBlob = doc.output('bloburl');
//       setPdfPreview(pdfBlob);
//       setDownloadReady(true);
//       setShowSignatureModal(true);
//     }
//   };

//   const handleDownloadPDF = () => {
//     generatePDF(true);
//     toast.success('PDF downloaded successfully');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (error || !operator) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-red-600">{error || 'Operator not found'}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <Toaster position="top-right" />
//       <div className="max-w-4xl mx-auto space-y-8">
//         {/* Header Card */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//           <div className="bg-gradient-to-r from-indigo-600 to-blue-500 h-32"></div>
//           <div className="relative px-6 pb-6">
//             <div className="flex flex-col sm:flex-row items-center">
//               <div className="-mt-16 relative">
//                 <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
//                   <User size={48} className="text-gray-400" />
//                   <img src={operator.image} alt=""  className='rounded-full'/>
//                 </div>
//                 <span className="absolute bottom-0 right-0 bg-green-500 p-1.5 rounded-full border-2 border-white">
//                   <BadgeCheck className="w-5 h-5 text-white" />
//                 </span>
//               </div>
//               <div className="mt-6 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
//                 <div className="flex items-center justify-between">
//                   <h1 className="text-2xl font-bold text-gray-900">
//                     {operator.firstName} {operator.lastName}
//                   </h1>
//                   <div className="flex gap-2 mt-10">
//                     <button
//                       onClick={() => generatePDF(false)}
//                       className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                     >
//                       <Pencil size={20} />
//                       Signer et Téléchargement
//                     </button>
//                     <button
//                       onClick={handleDownloadPDF}
//                       className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                     >
//                       <Download size={20} />
//                       Téléchargement rapide
//                     </button>
//                   </div>
//                 </div>
//                 <p className="text-gray-600 mt-1">{operator.role}</p>
//                 <div className="mt-3 flex flex-wrap gap-2">
//                   <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
//                     CIN: {operator.cin}
//                   </span>
//                   <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                     Matricule: {operator.matricule}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Info Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Contact Info */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">Coordonnées</h2>
//             <div className="space-y-4">
//               <div className="flex items-center text-gray-600">
//                 <Phone className="w-5 h-5 mr-3" />
//                 <span>{operator.phone}</span>
//               </div>
//               {/* <div className="flex items-center text-gray-600">
//                 <Mail className="w-5 h-5 mr-3" />
//                 <span>{operator.email}</span>
//               </div> */}
//               <div className="flex items-center text-gray-600">
//                 <MapPin className="w-5 h-5 mr-3" />
//                 <span>{operator.address}</span>
//               </div>
//               {/* <div className="flex items-center text-gray-600">
//                 <Building className="w-5 h-5 mr-3" />
//                 <span>{operator.department}</span>
//               </div> */}
//               <div className="flex items-center text-gray-600">
//                 <Clock className="w-5 h-5 mr-3" />
//                 <span>Rejoint {new Date(operator.createdAt).toLocaleDateString()}</span>
//               </div>
//             </div>
//           </div>

//           {/* Training Info */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">Détails de la formation</h2>
//             <div className="space-y-4">
//               {operator.formateurName && (
//                 <div className="flex items-center text-gray-600">
//                   <User className="w-5 h-5 mr-3" />
//                   <span>Formateur: {operator.formateurName}</span>
//                 </div>
//               )}
//               {operator.groupName && (
//                 <div className="flex items-center text-gray-600">
//                   <BookOpen className="w-5 h-5 mr-3" />
//                   <span>Groupe: {operator.groupName}</span>
//                 </div>
//               )}
//               <div className="flex items-center text-gray-600">
//                 <Award className="w-5 h-5 mr-3" />
//                 <span>Évaluation des performances: Excellent</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Test History */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-6">Historique des tests</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="text-left border-b-2 border-gray-200">
//                   <th className="pb-3 font-semibold text-gray-600">Titre du test</th>
//                   <th className="pb-3 font-semibold text-gray-600">Date</th>
//                   <th className="pb-3 font-semibold text-gray-600">Score</th>
//                   <th className="pb-3 font-semibold text-gray-600">Performance</th>
//                   <th className="pb-3 font-semibold text-gray-600">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {operator.testAttempts.map((attempt, index) => {
//                   const percentage = (attempt.score / attempt.testPoints) * 100;
//                   let performanceColor = 'bg-red-100 text-red-800';
//                   if (percentage >= 80)
//                     performanceColor = 'bg-green-100 text-green-800';
//                   else if (percentage >= 60)
//                     performanceColor = 'bg-yellow-100 text-yellow-800';

//                   return (
//                     <tr key={index}>
//                       <td className="py-4">{attempt.title}</td>
//                       <td className="py-4">
//                         {new Date(attempt.date).toLocaleDateString()}
//                       </td>
//                       <td className="py-4">
//                         {editingAttempt === index ? (
//                           <input
//                             type="number"
//                             value={editScore}
//                             onChange={(e) => setEditScore(Number(e.target.value))}
//                             min="0"
//                             max={attempt.testPoints}
//                             className="w-20 px-2 py-1 border rounded"
//                           />
//                         ) : (
//                           `${attempt.score}/${attempt.testPoints}`
//                         )}
//                       </td>
//                       <td className="py-4">
//                         <span
//                           className={`px-2 py-1 rounded-full text-sm ${performanceColor}`}
//                         >
//                           {percentage.toFixed(1)}%
//                         </span>
//                       </td>
//                       <td className="py-4">
//                         {editingAttempt === index ? (
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => {
//                                 const updatedOperator = { ...operator };
//                                 updatedOperator.testAttempts[index].score = editScore;
//                                 setOperator(updatedOperator);
//                                 setEditingAttempt(null);
//                                 EditScore(attempt.id)
//                                 toast.success('Score updated successfully');
//                               }}
//                               className="p-1 text-green-600 hover:text-green-800"
//                               title="Save"
//                             >
//                               <Save size={20} />
//                             </button>
//                             <button
//                               onClick={() => setEditingAttempt(null)}
//                               className="p-1 text-red-600 hover:text-red-800"
//                               title="Cancel"
//                             >
//                               <X size={20} />
//                             </button>
//                           </div>
//                         ) : (
//                           <button
//                             onClick={() => {
//                               setEditingAttempt(index);
//                               setEditScore(attempt.score);
//                             }}
//                             className="p-1 text-blue-600 hover:text-blue-800"
//                             title="Edit score"
//                           >
//                             <Edit2 size={20} />
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Signature Modal */}
//       {showSignatureModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-4xl w-full p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold">Sign Document</h3>
//               <button
//                 onClick={() => setShowSignatureModal(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={24} />
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* PDF Preview */}
//               <div className="bg-gray-100 rounded-lg p-4">
//                 <h4 className="font-semibold mb-2">PDF Preview</h4>
//                 <iframe
//                   src={pdfPreview || ''}
//                   className="w-full h-[500px] border rounded"
//                   title="PDF Preview"
//                 />
//               </div>

//               {/* Signature Pad */}
//               <div>
//                 <h4 className="font-semibold mb-2">Signature</h4>
//                 <div className="border rounded-lg p-4 bg-white">
//                   <canvas
//                     ref={canvasRef}
//                     width={400}
//                     height={200}
//                     className="border rounded touch-none"
//                     onMouseDown={startDrawing}
//                     onMouseMove={draw}
//                     onMouseUp={stopDrawing}
//                     onMouseLeave={stopDrawing}
//                   />
//                   <div className="flex justify-between mt-4">
//                     <button
//                       onClick={clearSignature}
//                       className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                     >
//                       Clear
//                     </button>
//                     <button
//                       onClick={() => {
//                         if (signature) {
//                           handleDownloadPDF();
//                         } else {
//                           toast.error('Please add your signature');
//                         }
//                       }}
//                       className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                     >
//                       Download Signed PDF
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default OperateurInfo;

import { useEffect, useState, useRef } from 'react';
import { User, BadgeCheck, Phone, MapPin, Award, BookOpen, Edit2, Save, X, Download, Pencil, Clock, Trash2, PhoneCall } from 'lucide-react';
import { jsPDF } from 'jspdf';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import axios from 'axios';


interface TestAttempt {
  id: string;
  title: string;
  date: string;
  score: number;
  testPoints: number;
}

interface OperatorData {
  id: string;
  firstName: string;
  lastName: string;
  cin: string;
  matricule: string;
  role: string;
  image: string | null;
  address: string;
  phone: string;
  email: string;
  department: string;
  createdAt: string;
  formateurName: string | null;
  groupName: string | null;
  testAttempts: TestAttempt[];
}

function OperateurInfo() {
  const { id } = useParams<{ id: string }>();
  const [operator, setOperator] = useState<OperatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAttempt, setEditingAttempt] = useState<number | null>(null);
  const [editScore, setEditScore] = useState<number>(0);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setDownloadReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const EditScore = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:3000/test-attempt/${id}`,
        { new_score: editScore },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        toast.success('Score updated successfully');
      }
    } catch (error) {
      console.error("Error updating score:", error);
      toast.error('Failed to update score');
    }
  };


  // Delete test attemps

  
  const DeleteTestAttempt = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:3000/test-attempt/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        await toast.success('Delete Test Attemps successfully');
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating score:", error);
      toast.error('Failed to Delete test attemps');
    }
  };

  useEffect(() => {
    const fetchOperator = async () => {
      try {
        const response = await fetch(`http://localhost:3000/operateur/${id}/info`);
        if (!response.ok) throw new Error('Failed to fetch operator data');
        const data = await response.json();
        setOperator(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOperator();
  }, [id]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  const generatePDF = (withSignature = false) => {
    if (!operator) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Header with gradient background
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 40, pageWidth, 5, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Rapport de certification des opérateurs', pageWidth / 2, 25, { align: 'center' });
    
    let yPos = 60;
    
    // Personal Information Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("", 'bold');
    doc.text('Informations Personnelles:', 15, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setFont("", 'normal');
    doc.text(`Nom: ${operator.firstName} ${operator.lastName}`, 15, yPos);
    doc.text(`CIN: ${operator.cin}`, pageWidth / 3, yPos);
    doc.text(`Matricule: ${operator.matricule}`, pageWidth / 1.8, yPos);
    
    
    yPos += 15;

    // Contact Information
    doc.setFontSize(16);
    doc.setFont("", 'bold');
    doc.text('Coordonnées:', 15, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont("", 'normal');
    doc.text(`numéro de téléphone: ${operator.phone}`, 15, yPos);
    // doc.text(`numéro de téléphone: ${operator.phone}`, pageWidth / 2, yPos);
    // yPos += 8;
    // doc.text(`Department: ${operator.department}`, 15, yPos);
    // doc.text(`Address: ${operator.address}`, pageWidth / 2, yPos);
    yPos += 15;

    // Training Information
    doc.setFontSize(16);
    doc.setFont("", 'bold');
    doc.text('Informations sur la Formation:', 15, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont("", 'normal');
    if (operator.formateurName) {
        doc.text(`Formateur: ${operator.formateurName}`, 15, yPos);
        yPos += 8;
    }
    if (operator.groupName) {
        doc.text(`Groupe: ${operator.groupName}`, 15, yPos);
        yPos += 15;
    }

    // Test History
    doc.setFontSize(16);
    doc.setFont("", 'bold');
    doc.text('Résultats des tests Historique:', 15, yPos);
    yPos += 10;

    // Table Header
    doc.setFontSize(12);
    doc.setFont("", 'bold');
    doc.text('Titre du test', 15, yPos);
    doc.text('Date', 80, yPos);
    doc.text('Score', 130, yPos);
    doc.text('Performance', 170, yPos);
    yPos += 5;

    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 8;

    // Table Content
    doc.setFont("", 'normal');
    operator.testAttempts.forEach((attempt) => {
        const percentage = (attempt.score / attempt.testPoints) * 100;
        const date = new Date(attempt.date).toLocaleDateString();
        
        doc.text(attempt.title, 15, yPos);
        doc.text(date, 80, yPos);
        doc.text(`${attempt.score}/${attempt.testPoints}`, 130, yPos);
        doc.text(`${percentage.toFixed(1)}%`, 170, yPos);
        yPos += 8;
    });
    
    // Add signature if provided
    if (withSignature && signature) {
      yPos = pageHeight - 50;
      doc.text(`${operator.formateurName}`, 15, yPos);
      yPos += 5;
      doc.addImage(signature, 'PNG', 15, yPos, 50, 25);
    }
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    const timestamp = new Date().toLocaleString();
    doc.text(`Généré le ${timestamp}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    if (withSignature) {
      doc.save(`${operator.firstName}_${operator.lastName}_certification.pdf`);
      setShowSignatureModal(false);
      toast.success('PDF downloaded successfully');
    } else {
      setPdfPreview(doc.output('bloburl').toString());
      setDownloadReady(true);
      setShowSignatureModal(true);
    }
  };
  // const generatePDF = (withSignature = false) => {
  //   if (!operator) return;

  //   const doc = new jsPDF();
  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const pageHeight = doc.internal.pageSize.getHeight();
    
  //   // Header with gradient background
  //   doc.setFillColor(30, 64, 175);
  //   doc.rect(0, 0, pageWidth, 40, 'F');
  //   doc.setFillColor(59, 130, 246);
  //   doc.rect(0, 40, pageWidth, 5, 'F');
    
  //   // Title
  //   doc.setTextColor(255, 255, 255);
  //   doc.setFontSize(24);
  //   doc.text('Operator Certification Report', pageWidth / 2, 25, { align: 'center' });
    
  //   let yPos = 60;
    
  //   // Personal Information Section
  //   doc.setTextColor(0, 0, 0);
  //   doc.setFontSize(16);
  //   doc.setFont(undefined, 'bold');
  //   doc.text('Personal Information', 15, yPos);
  //   yPos += 10;
    
  //   doc.setFontSize(12);
  //   doc.setFont(undefined, 'normal');
  //   doc.text(`Name: ${operator.firstName} ${operator.lastName}`, 15, yPos);
  //   doc.text(`Role: ${operator.role}`, pageWidth / 2, yPos);
  //   yPos += 8;
  //   doc.text(`CIN: ${operator.cin}`, 15, yPos);
  //   doc.text(`Matricule: ${operator.matricule}`, pageWidth / 2, yPos);
    
  //   // Add signature if provided
  //   if (withSignature && signature) {
  //     yPos = pageHeight - 50;
  //     doc.text('Authorized Signature:', 15, yPos);
  //     yPos += 5;
  //     doc.addImage(signature, 'PNG', 15, yPos, 50, 25);
  //   }
    
  //   // Footer
  //   doc.setFontSize(10);
  //   doc.setTextColor(128, 128, 128);
  //   const timestamp = new Date().toLocaleString();
  //   doc.text(`Generated on ${timestamp}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    
  //   if (withSignature) {
  //     doc.save(`${operator.firstName}_${operator.lastName}_certification.pdf`);
  //     setShowSignatureModal(false);
  //     toast.success('PDF downloaded successfully');
  //   } else {
  //     setPdfPreview(doc.output('bloburl'));
  //     setDownloadReady(true);
  //     setShowSignatureModal(true);
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !operator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 bg-red-50 px-4 py-3 rounded-lg shadow">
          {error || 'Operator not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      {/* Header Card */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 h-48"></div>
          <div className="relative px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center -mt-24">
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl bg-white flex items-center justify-center overflow-hidden">
                  {operator.image ? (
                    <img 
                      src={operator.image} 
                      alt={`${operator.firstName} ${operator.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-gray-400" />
                  )}
                </div>
                <span className="absolute bottom-2 right-2 bg-green-500 p-2 rounded-full border-4 border-white">
                  <BadgeCheck className="w-6 h-6 text-white" />
                </span>
              </div>
              
              <div className="mt-28 ml-10 text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {operator.firstName} {operator.lastName}
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">{operator.role}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        CIN: {operator.cin}
                      </span>
                      <span className="px-4 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                        Matricule: {operator.matricule}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6 sm:mt-0">
                    <button
                      onClick={() => generatePDF(false)}
                      className="flex items-center gap-2 px-2 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                      <Pencil size={20} />
                      Signer et télécharger
                    </button>
                    <button
                      onClick={() => generatePDF(true)}
                      className="flex items-center gap-2 px-2 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
                    >
                      <Download size={20} />
                      Téléchargement rapide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
              <Phone className="w-6 h-6 mr-3 text-blue-600" />
              Coordonnées
            </h2>
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                <span>{operator.address}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <PhoneCall className="w-5 h-5 mr-3 text-gray-500" />
                <span>{operator.phone}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-3 text-gray-500" />
                <span>Rejoint {new Date(operator.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Training Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
              <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
              Détails de la formation
            </h2>
            <div className="space-y-4">
              {operator.formateurName && (
                <div className="flex items-center text-gray-700">
                  <User className="w-5 h-5 mr-3 text-gray-500" />
                  <span>Formateur: {operator.formateurName}</span>
                </div>
              )}
              {operator.groupName && (
                <div className="flex items-center text-gray-700">
                  <BookOpen className="w-5 h-5 mr-3 text-gray-500" />
                  <span>Group: {operator.groupName}</span>
                </div>
              )}
              <div className="flex items-center text-gray-700">
                <Award className="w-5 h-5 mr-3 text-gray-500" />
                <span>Performance Rating: Excellent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Test History */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
            <Award className="w-6 h-6 mr-3 text-blue-600" />
            Historique des tests
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b-2 border-gray-200">
                  <th className="pb-3 font-semibold text-gray-600">Titre du test</th>
                  <th className="pb-3 font-semibold text-gray-600">Date</th>
                  <th className="pb-3 font-semibold text-gray-600">Score</th>
                  <th className="pb-3 font-semibold text-gray-600">Performance</th>
                  <th className="pb-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {operator.testAttempts.map((attempt, index) => {
                  const percentage = (attempt.score / attempt.testPoints) * 100;
                  let performanceColor = 'bg-red-100 text-red-800';
                  if (percentage >= 80) performanceColor = 'bg-green-100 text-green-800';
                  else if (percentage >= 60) performanceColor = 'bg-yellow-100 text-yellow-800';

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-4">{attempt.title}</td>
                      <td className="py-4">
                        {new Date(attempt.date).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        {editingAttempt === index ? (
                          <input
                            type="number"
                            value={editScore}
                            onChange={(e) => setEditScore(Number(e.target.value))}
                            min="0"
                            max={attempt.testPoints}
                            className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          `${attempt.score}/${attempt.testPoints}`
                        )}
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${performanceColor}`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4">
                        {editingAttempt === index ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const updatedOperator = { ...operator };
                                updatedOperator.testAttempts[index].score = editScore;
                                setOperator(updatedOperator);
                                setEditingAttempt(null);
                                EditScore(attempt.id);
                              }}
                              className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Save"
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={() => setEditingAttempt(null)}
                              className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (

                          <div className='flex gap-4'>
                                                      <button
                            onClick={() => {
                              setEditingAttempt(index);
                              setEditScore(attempt.score);
                            }}
                            className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Edit score"
                          >
                            <Edit2 size={20} />
                          </button>


                          <button
                            onClick={() => {
                              // setEditingAttempt(index);
                              // setEditScore(attempt.score);
                              DeleteTestAttempt(attempt.id);
                            }}
                            className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete Test"
                          >
                            <Trash2 size={20} />
                          </button>

                          </div>


                          
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">Sign Document</h3>
              <button
                onClick={() => setShowSignatureModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* PDF Preview */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">PDF Preview</h4>
                <div className="bg-gray-100 rounded-lg p-4">
                  <iframe
                    src={pdfPreview || ''}
                    className="w-full h-[600px] border rounded-lg shadow-inner"
                    title="PDF Preview"
                  />
                </div>
              </div>

              {/* Signature Pad */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Signature</h4>
                <div className="border rounded-lg p-6 bg-white shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    className="border rounded-lg touch-none bg-gray-50"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={clearSignature}
                      className="px-6 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                    >
                      Signature claire
                    </button>
                    <button
                      onClick={() => {
                        if (signature) {
                          generatePDF(true);
                        } else {
                          toast.error('Please add your signature');
                        }
                      }}
                      className="px-2 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                      Télécharger le PDF signé
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OperateurInfo;

