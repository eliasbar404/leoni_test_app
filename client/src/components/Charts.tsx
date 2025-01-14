// import React, { useEffect, useState } from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
//   ResponsiveContainer
// } from 'recharts';
// // import { format } from 'date-fns';
// // import { fr } from 'date-fns/locale';
// import { Users, BookOpen, UserCheck, Layout } from 'lucide-react';

// // Types
// interface GenderData {
//   genre: string;
//   nombre: number;
// }

// interface TestData {
//   titre: string;
//   tentatives: number;
//   moyenneScore: number;
// }

// interface AttendanceData {
//   date: string;
//   presents: number;
//   absents: number;
// }

// interface GroupData {
//   nom: string;
//   nombreOperateurs: number;
// }

// function App() {
//   const [genderData, setGenderData] = useState<GenderData[]>([]);
//   const [testData, setTestData] = useState<TestData[]>([]);
//   const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
//   const [groupData, setGroupData] = useState<GroupData[]>([]);

//   useEffect(() => {

//     const url = "http://localhost:3000"
//     // Fetch data from your API
//     const fetchData = async () => {
//       try {
//         // Retrieve token from localStorage
//         const token = localStorage.getItem('token'); // Replace 'authToken' with your token's key
  
//         // Create fetch options with the Authorization header
//         const fetchOptions = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };
  
//         const responses = await Promise.all([
//           fetch(`${url}/api/analytics/operateurs/gender`, fetchOptions),
//           fetch(`${url}/api/analytics/tests/stats`, fetchOptions),
//           fetch(`${url}/api/analytics/attendance`, fetchOptions),
//           fetch(`${url}/api/analytics/groups`, fetchOptions),
//         ]);
  
//         const [genderStats, testStats, attendanceStats, groupStats] = await Promise.all(
//           responses.map(res => res.json())
//         );
  
//         setGenderData(genderStats);
//         setTestData(testStats);
//         setAttendanceData(attendanceStats);
//         setGroupData(groupStats);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des données:', error);
//       }
//     };
  
//     fetchData();
//   }, []);
  

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de Bord Formateur</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Répartition par Genre */}
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <div className="flex items-center mb-4">
//             <Users className="w-6 h-6 text-blue-600 mr-2" />
//             <h2 className="text-xl font-semibold">Répartition par Genre</h2>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={genderData}
//                 dataKey="nombre"
//                 nameKey="genre"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 label
//               >
//                 {genderData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Statistiques des Tests */}
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <div className="flex items-center mb-4">
//             <BookOpen className="w-6 h-6 text-green-600 mr-2" />
//             <h2 className="text-xl font-semibold">Statistiques des Tests</h2>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={testData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="titre" />
//               <YAxis yAxisId="left" />
//               <YAxis yAxisId="right" orientation="right" />
//               <Tooltip />
//               <Legend />
//               <Bar yAxisId="left" dataKey="tentatives" fill="#8884d8" name="Tentatives" />
//               <Bar yAxisId="right" dataKey="moyenneScore" fill="#82ca9d" name="Score Moyen" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Présence Quotidienne */}
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <div className="flex items-center mb-4">
//             <UserCheck className="w-6 h-6 text-purple-600 mr-2" />
//             <h2 className="text-xl font-semibold">Présence Quotidienne</h2>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={attendanceData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="presents" stroke="#82ca9d" name="Présents" />
//               <Line type="monotone" dataKey="absents" stroke="#ff7c7c" name="Absents" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Statistiques des Groupes */}
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <div className="flex items-center mb-4">
//             <Layout className="w-6 h-6 text-orange-600 mr-2" />
//             <h2 className="text-xl font-semibold">Statistiques des Groupes</h2>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={groupData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="nom" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="nombreOperateurs" fill="#ffa726" name="Nombre d'Opérateurs" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;


import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
  ComposedChart,
  // Scatter
} from 'recharts';
// import { format } from 'date-fns';
// import { fr } from 'date-fns/locale';
import { Users, BookOpen, UserCheck, Layout, Target, Calendar, Award, Activity } from 'lucide-react';

// Types existants...
interface GenderData {
  genre: string;
  nombre: number;
}

interface TestData {
  titre: string;
  tentatives: number;
  moyenneScore: number;
}

interface AttendanceData {
  date: string;
  presents: number;
  absents: number;
}

interface GroupData {
  nom: string;
  nombreOperateurs: number;
}

// Nouveaux types
interface DifficultyData {
  difficulte: string;
  nombre: number;
}

interface MonthlyPerformanceData {
  mois: string;
  moyenneScore: number;
  tauxReussite: number;
}

interface SkillsData {
  categorie: string;
  score: number;
}

interface ActivityData {
  semaine: string;
  tests: number;
  presences: number;
  evenements: number;
}

function App() {
  const [genderData, setGenderData] = useState<GenderData[]>([]);
  const [testData, setTestData] = useState<TestData[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [groupData, setGroupData] = useState<GroupData[]>([]);
  const [difficultyData, setDifficultyData] = useState<DifficultyData[]>([]);
  const [monthlyPerformanceData, setMonthlyPerformanceData] = useState<MonthlyPerformanceData[]>([]);
  const [skillsData, setSkillsData] = useState<SkillsData[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = "http://localhost:3000";
        //         // Create fetch options with the Authorization header
        const fetchOptions = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        
        const responses = await Promise.all([
          fetch(`${url}/api/analytics/operateurs/gender`,fetchOptions),
          fetch(`${url}/api/analytics/tests/stats`,fetchOptions),
          fetch(`${url}/api/analytics/attendance`,fetchOptions),
          fetch(`${url}/api/analytics/groups`,fetchOptions),
          fetch(`${url}/api/analytics/tests/difficulty`,fetchOptions),
          fetch(`${url}/api/analytics/performance/monthly`,fetchOptions),
          fetch(`${url}/api/analytics/operateurs/skills`,fetchOptions),
          fetch(`${url}/api/analytics/activity`,fetchOptions)
        ]);

        const [
          genderStats,
          testStats,
          attendanceStats,
          groupStats,
          difficultyStats,
          performanceStats,
          skillsStats,
          activityStats
        ] = await Promise.all(responses.map(res => res.json()));

        setGenderData(genderStats);
        setTestData(testStats);
        setAttendanceData(attendanceStats);
        setGroupData(groupStats);
        setDifficultyData(difficultyStats);
        setMonthlyPerformanceData(performanceStats);
        setSkillsData(skillsStats);
        setActivityData(activityStats);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="min-h-screen bg-gray-100 p-8 rounded-md shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de Bord Formateur</h1>
      
      <div className="flex flex-col gap-5 p-20">
        {/* Répartition par Genre */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">Répartition par Genre</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="nombre"
                nameKey="genre"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {genderData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution des Difficultés */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <Target className="w-6 h-6 text-red-600 mr-2" />
            <h2 className="text-xl font-semibold">Distribution des Difficultés</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={difficultyData}
                dataKey="nombre"
                nameKey="difficulte"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {difficultyData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Mensuelle */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Performance Mensuelle</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="moyenneScore" fill="#8884d8" name="Score Moyen" />
              <Line yAxisId="right" type="monotone" dataKey="tauxReussite" stroke="#82ca9d" name="Taux de Réussite" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Compétences des Opérateurs */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <Award className="w-6 h-6 text-yellow-600 mr-2" />
            <h2 className="text-xl font-semibold">Compétences des Opérateurs</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="categorie" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Activité Hebdomadaire */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <Activity className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold">Activité Hebdomadaire</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semaine" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="tests" stackId="1" stroke="#8884d8" fill="#8884d8" name="Tests" />
              <Area type="monotone" dataKey="presences" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Présences" />
              <Area type="monotone" dataKey="evenements" stackId="1" stroke="#ffc658" fill="#ffc658" name="Événements" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Statistiques des Tests */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <BookOpen className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold">Statistiques des Tests</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={testData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="titre" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="tentatives" fill="#8884d8" name="Tentatives" />
              <Bar yAxisId="right" dataKey="moyenneScore" fill="#82ca9d" name="Score Moyen" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Présence Quotidienne */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <UserCheck className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold">Présence Quotidienne</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="presents" stroke="#82ca9d" name="Présents" />
              <Line type="monotone" dataKey="absents" stroke="#ff7c7c" name="Absents" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Statistiques des Groupes */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <Layout className="w-6 h-6 text-orange-600 mr-2" />
            <h2 className="text-xl font-semibold">Statistiques des Groupes</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nom" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="nombreOperateurs" fill="#ffa726" name="Nombre d'Opérateurs" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;