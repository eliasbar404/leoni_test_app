// import { useState, useEffect } from 'react';
// import { Calendar as CalendarIcon, Users, CheckCircle, XCircle, Search, UserPlus, ChevronLeft, ChevronRight, Download, Filter, RefreshCw, ChevronDown } from 'lucide-react';
// import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

// interface Attendance {
//   id: string;
//   userId: string;
//   groupId: string;
//   date: string;
//   isPresent: boolean;
// }

// interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   matricule: string;
//   image?: string;
// }

// interface Group {
//   id: string;
//   name: string;
//   description?: string;
// }

// interface Stats {
//   totalPresent: number;
//   totalAbsent: number;
//   attendanceRate: number;
// }

// function App() {
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [selectedGroup, setSelectedGroup] = useState<string>('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [groupSearchQuery, setGroupSearchQuery] = useState('');
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const [attendance, setAttendance] = useState<Attendance[]>([]);
//   const [view, setView] = useState<'calendar' | 'list'>('calendar');
//   const [stats, setStats] = useState<Stats>({ totalPresent: 0, totalAbsent: 0, attendanceRate: 0 });
//   const [isLoading, setIsLoading] = useState(false);
//   const [sortBy, setSortBy] = useState<'name' | 'matricule' | 'status'>('name');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

//   const fetchGroups = async () => {
//     try {
//       setIsLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:3000/api/groups', {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch groups');
//       }
      
//       const data = await response.json();
//       setGroups(data);
//     } catch (error) {
//       console.error('Error fetching groups:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchUsers = async () => {
//     if (!selectedGroup) return;
//     try {
//       setIsLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await fetch(`http://localhost:3000/api/users/${selectedGroup}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       const data = await response.json();
//       setUsers(data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchAttendance = async () => {
//     if (!selectedGroup || !selectedDate) return;
//     try {
//       setIsLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `http://localhost:3000/api/attendance?date=${selectedDate}&groupId=${selectedGroup}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       const data = await response.json();
//       setAttendance(data);
//       updateStats(data);
//     } catch (error) {
//       console.error('Error fetching attendance:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateStats = (attendanceData: Attendance[]) => {
//     const totalPresent = attendanceData.filter(a => a.isPresent).length;
//     const totalAbsent = attendanceData.length - totalPresent;
//     const attendanceRate = attendanceData.length ? (totalPresent / attendanceData.length) * 100 : 0;
    
//     setStats({
//       totalPresent,
//       totalAbsent,
//       attendanceRate,
//     });
//   };

//   const exportAttendance = () => {
//     const data = filteredUsers.map(user => {
//       const attendanceRecord = attendance.find(a => a.userId === user.id);
//       return {
//         Name: `${user.firstName} ${user.lastName}`,
//         Matricule: user.matricule,
//         Date: selectedDate,
//         Status: attendanceRecord?.isPresent ? 'Present' : 'Absent',
//       };
//     });

//     const csv = [
//       Object.keys(data[0]).join(','),
//       ...data.map(row => Object.values(row).join(',')),
//     ].join('\n');

//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `attendance-${selectedDate}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   useEffect(() => {
//     fetchGroups();
//   }, []);

//   useEffect(() => {
//     if (selectedGroup) {
//       fetchUsers();
//       fetchAttendance();
//     }
//   }, [selectedGroup, selectedDate]);

//   const handleAttendanceChange = async (userId: string, isPresent: boolean) => {
//     try {
//       setIsLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await fetch('http://localhost:3000/api/attendance', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           userId,
//           groupId: selectedGroup,
//           date: selectedDate,
//           isPresent,
//         }),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to update attendance');
//       }
//       await fetchAttendance();
//     } catch (error) {
//       console.error('Error updating attendance:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filteredGroups = groups.filter(group =>
//     group.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
//     (group.description?.toLowerCase() || '').includes(groupSearchQuery.toLowerCase())
//   );

//   const filteredUsers = users
//     .filter(user =>
//       `${user.firstName} ${user.lastName} ${user.matricule}`
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase())
//     )
//     .sort((a, b) => {
//       if (sortBy === 'name') {
//         const nameA = `${a.firstName} ${a.lastName}`;
//         const nameB = `${b.firstName} ${b.lastName}`;
//         return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
//       }
//       if (sortBy === 'matricule') {
//         return sortOrder === 'asc' ? a.matricule.localeCompare(b.matricule) : b.matricule.localeCompare(a.matricule);
//       }
//       // Sort by status
//       const statusA = attendance.find(att => att.userId === a.id)?.isPresent ? 1 : 0;
//       const statusB = attendance.find(att => att.userId === b.id)?.isPresent ? 1 : 0;
//       return sortOrder === 'asc' ? statusA - statusB : statusB - statusA;
//     });

//   const days = eachDayOfInterval({
//     start: startOfMonth(currentMonth),
//     end: endOfMonth(currentMonth),
//   });

//   const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
//   const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

//   const handleSort = (newSortBy: typeof sortBy) => {
//     if (sortBy === newSortBy) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortBy(newSortBy);
//       setSortOrder('asc');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center">
//               <CalendarIcon className="h-8 w-8 text-indigo-600" />
//               <h1 className="ml-3 text-2xl font-bold text-gray-900">Gestion des présences</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => setView(view === 'calendar' ? 'list' : 'calendar')}
//                 className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
//               >
//                 {view === 'calendar' ? 'Vue en liste' : 'Vue du calendrier'}
//               </button>
//               <div className="flex items-center">
//                 <Users className="h-6 w-6 text-gray-500" />
//                 <span className="ml-2 text-gray-700 font-medium">{users.length} Operateurs</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Controls */}
//         <div className="bg-white rounded-lg shadow p-6 mb-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher un groupe</label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Rechercher un groupe..."
//                   value={groupSearchQuery}
//                   onChange={(e) => setGroupSearchQuery(e.target.value)}
//                   className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
//                 />
//                 <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Groupe</label>
//               <select
//                 value={selectedGroup}
//                 onChange={(e) => setSelectedGroup(e.target.value)}
//                 className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               >
//                 <option value="">Sélectionner un groupe</option>
//                 {filteredGroups.map(group => (
//                   <option key={group.id} value={group.id}>{group.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher un operateur</label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Recherche par nom ou matricule..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
//                 />
//                 <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               </div>
//             </div>
//           </div>

//           {/* Stats Section */}
//           {selectedGroup && (
//             <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-green-50 p-4 rounded-lg">
//                 <h3 className="text-green-800 text-sm font-medium">Présents</h3>
//                 <p className="mt-2 text-green-900 text-3xl font-semibold">{stats.totalPresent}</p>
//               </div>
//               <div className="bg-red-50 p-4 rounded-lg">
//                 <h3 className="text-red-800 text-sm font-medium">Absents</h3>
//                 <p className="mt-2 text-red-900 text-3xl font-semibold">{stats.totalAbsent}</p>
//               </div>
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <h3 className="text-blue-800 text-sm font-medium">Taux de présence</h3>
//                 <p className="mt-2 text-blue-900 text-3xl font-semibold">{stats.attendanceRate.toFixed(1)}%</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Actions Bar */}
//         {selectedGroup && (
//           <div className="flex justify-between items-center mb-4">
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => fetchAttendance()}
//                 className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
//               >
//                 <RefreshCw className="h-4 w-4 mr-2" />
//                 Actualiser
//               </button>
//               <button
//                 onClick={exportAttendance}
//                 className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
//               >
//                 <Download className="h-4 w-4 mr-2" />
//                 Exporter CSV
//               </button>
//             </div>
//             <div className="flex items-center">
//               <Filter className="h-5 w-5 text-gray-400 mr-2" />
//               <select
//                 value={sortBy}
//                 onChange={(e) => handleSort(e.target.value as typeof sortBy)}
//                 className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="name">Trier par nom</option>
//                 <option value="matricule">Trier par matricule</option>
//                 <option value="status">Trier par status</option>
//               </select>
//             </div>
//           </div>
//         )}

//         {isLoading && (
//           <div className="flex justify-center items-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
//           </div>
//         )}

//         {!isLoading && view === 'calendar' ? (
//           <div className="bg-white rounded-lg shadow">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-8">
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   {format(currentMonth, 'MMMM yyyy')}
//                 </h2>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={previousMonth}
//                     className="p-2 rounded-full hover:bg-gray-100"
//                   >
//                     <ChevronLeft className="h-5 w-5 text-gray-600" />
//                   </button>
//                   <button
//                     onClick={nextMonth}
//                     className="p-2 rounded-full hover:bg-gray-100"
//                   >
//                     <ChevronRight className="h-5 w-5 text-gray-600" />
//                   </button>
//                 </div>
//               </div>
//               <div className="grid grid-cols-7 gap-px bg-gray-200">
//                 {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
//                   <div
//                     key={day}
//                     className="bg-gray-50 py-2 text-center text-sm font-semibold text-gray-700"
//                   >
//                     {day}
//                   </div>
//                 ))}
//                 {days.map((day) => {
//                   const formattedDay = format(day, 'yyyy-MM-dd');
//                   const isSelected = isSameDay(day, new Date(selectedDate));
//                   const isCurrentMonth = isSameMonth(day, currentMonth);
//                   const hasAttendance = attendance.length > 0;
//                   const presentCount = attendance.filter(a => a.isPresent).length;
//                   const totalCount = attendance.length;

//                   return (
//                     <button
//                       key={day.toString()}
//                       onClick={() => setSelectedDate(formattedDay)}
//                       className={`
//                         relative bg-white p-3 hover:bg-gray-50 focus:z-10
//                         ${!isCurrentMonth && 'text-gray-400'}
//                         ${isSelected && 'bg-indigo-50 font-semibold text-indigo-600'}
//                       `}
//                     >
//                       <time dateTime={formattedDay} className="text-sm">
//                         {format(day, 'd')}
//                       </time>
//                       {hasAttendance && isSameDay(day, new Date(selectedDate)) && (
//                         <div className="mt-2">
//                           <div className="text-xs text-gray-600">
//                             {presentCount}/{totalCount} présent
//                           </div>
//                           <div className="mt-1 h-1 w-full bg-gray-200 rounded">
//                             <div
//                               className="h-full bg-green-500 rounded"
//                               style={{
//                                 width: `${(presentCount / totalCount) * 100}%`,
//                               }}
//                             />
//                           </div>
//                         </div>
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         ) : (
//           !isLoading && (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                         onClick={() => handleSort('name')}
//                       >
//                         <div className="flex items-center">
//                           Operateur
//                           {sortBy === 'name' && (
//                             <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
//                           )}
//                         </div>
//                       </th>
//                       <th
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                         onClick={() => handleSort('matricule')}
//                       >
//                         <div className="flex items-center">
//                           Matricule
//                           {sortBy === 'matricule' && (
//                             <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
//                           )}
//                         </div>
//                       </th>
//                       <th
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                         onClick={() => handleSort('status')}
//                       >
//                         <div className="flex items-center">
//                           Status
//                           {sortBy === 'status' && (
//                             <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
//                           )}
//                         </div>
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredUsers.map(user => {
//                       const attendanceRecord = attendance.find(a => a.userId === user.id);
//                       return (
//                         <tr key={user.id} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               {user.image ? (
//                                 <img className="h-10 w-10 rounded-full" src={user.image} alt="" />
//                               ) : (
//                                 <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                                   <UserPlus className="h-6 w-6 text-gray-400" />
//                                 </div>
//                               )}
//                               <div className="ml-4">
//                                 <div className="text-sm font-medium text-gray-900">
//                                   {user.firstName} {user.lastName}
//                                 </div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm text-gray-900">{user.matricule}</div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                               attendanceRecord?.isPresent 
//                                 ? 'bg-green-100 text-green-800' 
//                                 : 'bg-red-100 text-red-800'
//                             }`}>
//                               {attendanceRecord?.isPresent ? 'Présent' : 'Absent'}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                             <div className="flex space-x-4">
//                               <button
//                                 onClick={() => handleAttendanceChange(user.id, true)}
//                                 className={`${
//                                   attendanceRecord?.isPresent ? 'text-green-600' : 'text-gray-400'
//                                 } hover:text-green-900`}
//                               >
//                                 <CheckCircle className="h-6 w-6" />
//                               </button>
//                               <button
//                                 onClick={() => handleAttendanceChange(user.id, false)}
//                                 className={`${
//                                   !attendanceRecord?.isPresent ? 'text-red-600' : 'text-gray-400'
//                                 } hover:text-red-900`}
//                               >
//                                 <XCircle className="h-6 w-6" />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;


import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Users, CheckCircle, XCircle, Search, UserPlus, ChevronLeft, ChevronRight, Download, Filter, RefreshCw, FileDown, ChevronDown } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Attendance {
  id: string;
  userId: string;
  groupId: string;
  date: string;
  isPresent: boolean;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string;
  image?: string;
}

interface Group {
  id: string;
  name: string;
  description?: string;
}

interface Stats {
  totalPresent: number;
  totalAbsent: number;
  attendanceRate: number;
}

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [stats, setStats] = useState<Stats>({ totalPresent: 0, totalAbsent: 0, attendanceRate: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'matricule' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/groups', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!selectedGroup) return;
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/users/${selectedGroup}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendance = async () => {
    if (!selectedGroup || !selectedDate) return;
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/attendance?date=${selectedDate}&groupId=${selectedGroup}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setAttendance(data);
      updateStats(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStats = (attendanceData: Attendance[]) => {
    const totalPresent = attendanceData.filter(a => a.isPresent).length;
    const totalAbsent = attendanceData.length - totalPresent;
    const attendanceRate = attendanceData.length ? (totalPresent / attendanceData.length) * 100 : 0;
    
    setStats({
      totalPresent,
      totalAbsent,
      attendanceRate,
    });
  };

  const exportAttendance = () => {
    const data = filteredUsers.map(user => {
      const attendanceRecord = attendance.find(a => a.userId === user.id);
      return {
        Name: `${user.firstName} ${user.lastName}`,
        Matricule: user.matricule,
        Date: selectedDate,
        Status: attendanceRecord?.isPresent ? 'Present' : 'Absent',
      };
    });

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(`Rapport de présence - ${format(new Date(selectedDate), 'dd/MM/yyyy')}`, 14, 15);
    
    // Add group info
    const currentGroup = groups.find(g => g.id === selectedGroup);
    doc.setFontSize(12);
    doc.text(`Groupe: ${currentGroup?.name || ''}`, 14, 25);
    
    // Add statistics
    doc.text(`Présents: ${stats.totalPresent}`, 14, 35);
    doc.text(`Absents: ${stats.totalAbsent}`, 14, 42);
    doc.text(`Taux de présence: ${stats.attendanceRate.toFixed(1)}%`, 14, 49);
    
    // Create table data
    const tableData = filteredUsers.map(user => {
      const attendanceRecord = attendance.find(a => a.userId === user.id);
      return [
        `${user.firstName} ${user.lastName}`,
        user.matricule,
        attendanceRecord?.isPresent ? 'Présent' : 'Absent'
      ];
    });

    // Add table
    autoTable(doc, {
      head: [['Nom', 'Matricule', 'Status']],
      body: tableData,
      startY: 60,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [75, 85, 99] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // Save the PDF
    doc.save(`attendance-${selectedDate}.pdf`);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchUsers();
      fetchAttendance();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup, selectedDate]);

  const handleAttendanceChange = async (userId: string, isPresent: boolean) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:3000/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          groupId: selectedGroup,
          date: selectedDate,
          isPresent,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update attendance');
      }
      await fetchAttendance();
    } catch (error) {
      console.error('Error updating attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
    (group.description?.toLowerCase() || '').includes(groupSearchQuery.toLowerCase())
  );

  const filteredUsers = users
    .filter(user =>
      `${user.firstName} ${user.lastName} ${user.matricule}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = `${a.firstName} ${a.lastName}`;
        const nameB = `${b.firstName} ${b.lastName}`;
        return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      }
      if (sortBy === 'matricule') {
        return sortOrder === 'asc' ? a.matricule.localeCompare(b.matricule) : b.matricule.localeCompare(a.matricule);
      }
      // Sort by status
      const statusA = attendance.find(att => att.userId === a.id)?.isPresent ? 1 : 0;
      const statusB = attendance.find(att => att.userId === b.id)?.isPresent ? 1 : 0;
      return sortOrder === 'asc' ? statusA - statusB : statusB - statusA;
    });

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Gestion des présences</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setView(view === 'calendar' ? 'list' : 'calendar')}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
              >
                {view === 'calendar' ? 'Vue en liste' : 'Vue du calendrier'}
              </button>
              <div className="flex items-center">
                <Users className="h-6 w-6 text-gray-500" />
                <span className="ml-2 text-gray-700 font-medium">{users.length} Operateurs</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher un groupe</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un groupe..."
                  value={groupSearchQuery}
                  onChange={(e) => setGroupSearchQuery(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Groupe</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Sélectionner un groupe</option>
                {filteredGroups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher un operateur</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Recherche par nom ou matricule..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          {selectedGroup && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-green-800 text-sm font-medium">Présents</h3>
                <p className="mt-2 text-green-900 text-3xl font-semibold">{stats.totalPresent}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-red-800 text-sm font-medium">Absents</h3>
                <p className="mt-2 text-red-900 text-3xl font-semibold">{stats.totalAbsent}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-blue-800 text-sm font-medium">Taux de présence</h3>
                <p className="mt-2 text-blue-900 text-3xl font-semibold">{stats.attendanceRate.toFixed(1)}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions Bar */}
        {selectedGroup && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchAttendance()}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </button>
              <button
                onClick={exportAttendance}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter CSV
              </button>
              <button
                onClick={exportPDF}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Exporter PDF
              </button>
            </div>
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value as typeof sortBy)}
                className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="name">Trier par nom</option>
                <option value="matricule">Trier par matricule</option>
                <option value="status">Trier par status</option>
              </select>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {!isLoading && view === 'calendar' ? (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-semibold text-gray-900">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={previousMonth}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
                  <div
                    key={day}
                    className="bg-gray-50 py-2 text-center text-sm font-semibold text-gray-700"
                  >
                    {day}
                  </div>
                ))}
                {days.map((day) => {
                  const formattedDay = format(day, 'yyyy-MM-dd');
                  const isSelected = isSameDay(day, new Date(selectedDate));
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const hasAttendance = attendance.length > 0;
                  const presentCount = attendance.filter(a => a.isPresent).length;
                  const totalCount = attendance.length;

                  return (
                    <button
                      key={day.toString()}
                      onClick={() => setSelectedDate(formattedDay)}
                      className={`
                        relative bg-white p-3 hover:bg-gray-50 focus:z-10
                        ${!isCurrentMonth && 'text-gray-400'}
                        ${isSelected && 'bg-indigo-50 font-semibold text-indigo-600'}
                      `}
                    >
                      <time dateTime={formattedDay} className="text-sm">
                        {format(day, 'd')}
                      </time>
                      {hasAttendance && isSameDay(day, new Date(selectedDate)) && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-600">
                            {presentCount}/{totalCount} présent
                          </div>
                          <div className="mt-1 h-1 w-full bg-gray-200 rounded">
                            <div
                              className="h-full bg-green-500 rounded"
                              style={{
                                width: `${(presentCount / totalCount) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Operateur
                        {sortBy === 'name' && (
                          <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('matricule')}
                    >
                      <div className="flex items-center">
                        Matricule
                        {sortBy === 'matricule' && (
                          <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {sortBy === 'status' && (
                          <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map(user => {
                    const attendanceRecord = attendance.find(a => a.userId === user.id);
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.image ? (
                              <img className="h-10 w-10 rounded-full" src={user.image} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserPlus className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.matricule}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            attendanceRecord?.isPresent 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {attendanceRecord?.isPresent ? 'Présent' : 'Absent'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-4">
                            <button
                              onClick={() => handleAttendanceChange(user.id, true)}
                              className={`${
                                attendanceRecord?.isPresent ? 'text-green-600' : 'text-gray-400'
                              } hover:text-green-900`}
                            >
                              <CheckCircle className="h-6 w-6" />
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(user.id, false)}
                              className={`${
                                !attendanceRecord?.isPresent ? 'text-red-600' : 'text-gray-400'
                              } hover:text-red-900`}
                            >
                              <XCircle className="h-6 w-6" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;








