// import React, { useState } from 'react';
// import { Users, Search, Calendar, ArrowLeft, ArrowRight, FileBarChart, X } from 'lucide-react';

// function AttendanceReport() {
//   const [selectedGroup, setSelectedGroup] = useState<string>('group1');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);

//   // Sample groups data
//   const groups = {
//     group1: {
//       name: "Class 10-A",
//       students: [
//         { id: 1, name: "John Doe" },
//         { id: 2, name: "Jane Smith" },
//         { id: 3, name: "Mike Johnson" }
//       ]
//     },
//     group2: {
//       name: "Class 10-B",
//       students: [
//         { id: 4, name: "Sarah Williams" },
//         { id: 5, name: "Alex Brown" },
//         { id: 6, name: "Emma Davis" }
//       ]
//     },
//     group3: {
//       name: "Class 10-C",
//       students: [
//         { id: 7, name: "Tom Wilson" },
//         { id: 8, name: "Lucy Anderson" },
//         { id: 9, name: "James Taylor" }
//       ]
//     }
//   };

//   // Sample attendance data
//   const sampleAttendanceData = {
//     'group1-1-2024-03-01': true,
//     'group1-1-2024-03-02': true,
//     'group1-1-2024-03-03': false,
//     'group1-2-2024-03-01': false,
//     'group1-2-2024-03-02': true,
//     'group1-2-2024-03-03': true,
//   };

//   const filteredGroups = Object.entries(groups).filter(([_, group]) =>
//     group.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const getDaysInMonth = (date: Date) => {
//     return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//   };

//   const formatDate = (year: number, month: number, day: number) => {
//     return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//   };

//   const getAttendanceStatus = (studentId: number, date: string) => {
//     const key = `${selectedGroup}-${studentId}-${date}`;
//     return sampleAttendanceData[key as keyof typeof sampleAttendanceData];
//   };

//   const calculateStudentStats = (studentId: number) => {
//     const daysInMonth = getDaysInMonth(currentMonth);
//     let present = 0;
//     let absent = 0;

//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = formatDate(
//         currentMonth.getFullYear(),
//         currentMonth.getMonth(),
//         day
//       );
//       const status = getAttendanceStatus(studentId, date);
//       if (status === true) present++;
//       if (status === false) absent++;
//     }

//     const total = present + absent;
//     const presentPercentage = total > 0 ? (present / total) * 100 : 0;

//     return {
//       present,
//       absent,
//       total,
//       presentPercentage
//     };
//   };

//   const calculateGroupAttendance = (date: string) => {
//     const currentGroup = groups[selectedGroup as keyof typeof groups];
//     let presentCount = 0;
//     let totalStudents = currentGroup.students.length;

//     currentGroup.students.forEach(student => {
//       if (getAttendanceStatus(student.id, date) === true) {
//         presentCount++;
//       }
//     });

//     return {
//       presentCount,
//       absentCount: totalStudents - presentCount,
//       attendanceRate: (presentCount / totalStudents) * 100
//     };
//   };

//   const getDailyAttendance = (date: string) => {
//     const currentGroup = groups[selectedGroup as keyof typeof groups];
//     const present: typeof currentGroup.students = [];
//     const absent: typeof currentGroup.students = [];

//     currentGroup.students.forEach(student => {
//       if (getAttendanceStatus(student.id, date)) {
//         present.push(student);
//       } else {
//         absent.push(student);
//       }
//     });

//     return { present, absent };
//   };

//   const renderCalendar = () => {
//     const daysInMonth = getDaysInMonth(currentMonth);
//     const days = [];

//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = formatDate(
//         currentMonth.getFullYear(),
//         currentMonth.getMonth(),
//         day
//       );
//       const attendance = calculateGroupAttendance(date);

//       days.push(
//         <button
//           key={day}
//           onClick={() => setSelectedDate(date)}
//           className={`p-2 border rounded-lg hover:bg-gray-100 transition-colors ${
//             selectedDate === date ? 'ring-2 ring-blue-500' : ''
//           }`}
//         >
//           <div className="text-sm font-medium mb-1">{day}</div>
//           <div className={`text-xs ${
//             attendance.attendanceRate >= 75 ? 'text-green-600' :
//             attendance.attendanceRate >= 50 ? 'text-yellow-600' : 'text-red-600'
//           }`}>
//             {attendance.presentCount}/{attendance.presentCount + attendance.absentCount}
//           </div>
//         </button>
//       );
//     }

//     return days;
//   };

//   const renderDailyDetails = () => {
//     if (!selectedDate) return null;

//     const { present, absent } = getDailyAttendance(selectedDate);
//     const formattedDate = new Date(selectedDate).toLocaleDateString('default', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
//           <div className="p-6 border-b">
//             <div className="flex items-center justify-between">
//               <h3 className="text-xl font-semibold">
//                 Attendance for {formattedDate}
//               </h3>
//               <button
//                 onClick={() => setSelectedDate(null)}
//                 className="p-2 hover:bg-gray-100 rounded-full"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//           <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
//             <div className="grid grid-cols-2 gap-6">
//               <div>
//                 <h4 className="text-lg font-semibold text-green-600 mb-4 flex items-center gap-2">
//                   Present ({present.length})
//                 </h4>
//                 <div className="space-y-2">
//                   {present.map(student => (
//                     <div
//                       key={student.id}
//                       className="p-3 bg-green-50 rounded-lg text-green-800"
//                     >
//                       {student.name}
//                     </div>
//                   ))}
//                   {present.length === 0 && (
//                     <div className="text-gray-500 italic">No students present</div>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <h4 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
//                   Absent ({absent.length})
//                 </h4>
//                 <div className="space-y-2">
//                   {absent.map(student => (
//                     <div
//                       key={student.id}
//                       className="p-3 bg-red-50 rounded-lg text-red-800"
//                     >
//                       {student.name}
//                     </div>
//                   ))}
//                   {absent.length === 0 && (
//                     <div className="text-gray-500 italic">No students absent</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-2">
//               <FileBarChart className="w-6 h-6 text-blue-500" />
//               <h1 className="text-2xl font-bold text-gray-800">Attendance Report</h1>
//             </div>
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
//                 className="p-2 hover:bg-gray-100 rounded-full"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//               </button>
//               <span className="text-lg font-medium">
//                 {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
//               </span>
//               <button
//                 onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
//                 className="p-2 hover:bg-gray-100 rounded-full"
//               >
//                 <ArrowRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//             {/* Group Selection Sidebar */}
//             <div className="bg-gray-50 rounded-xl p-6">
//               <div className="flex items-center gap-2 mb-4">
//                 <Users className="w-5 h-5 text-blue-500" />
//                 <h2 className="text-lg font-semibold">Groups</h2>
//               </div>
              
//               {/* Search Input */}
//               <div className="relative mb-4">
//                 <input
//                   type="text"
//                   placeholder="Search groups..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//                 <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//               </div>

//               <div className="space-y-2">
//                 {filteredGroups.length > 0 ? (
//                   filteredGroups.map(([groupId, group]) => (
//                     <button
//                       key={groupId}
//                       onClick={() => setSelectedGroup(groupId)}
//                       className={`w-full p-3 rounded-lg text-left transition-colors ${
//                         selectedGroup === groupId
//                           ? 'bg-blue-500 text-white'
//                           : 'hover:bg-blue-50'
//                       }`}
//                     >
//                       {group.name}
//                     </button>
//                   ))
//                 ) : (
//                   <div className="text-center py-4 text-gray-500">
//                     No groups found
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Attendance Report Panel */}
//             <div className="md:col-span-3">
//               <div className="bg-gray-50 rounded-xl p-6">
//                 <div className="mb-6">
//                   <h2 className="text-xl font-semibold mb-2">
//                     {groups[selectedGroup as keyof typeof groups].name}
//                   </h2>
//                   <p className="text-gray-600">
//                     Monthly Attendance Report
//                   </p>
//                 </div>

//                 {/* Calendar View */}
//                 <div className="mb-8">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <Calendar className="w-5 h-5 text-blue-500" />
//                     Daily Group Attendance
//                   </h3>
//                   <div className="grid grid-cols-7 gap-2">
//                     {renderCalendar()}
//                   </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="bg-gray-100">
//                         <th className="px-4 py-3 text-left">Student</th>
//                         <th className="px-4 py-3 text-center">Present Days</th>
//                         <th className="px-4 py-3 text-center">Absent Days</th>
//                         <th className="px-4 py-3 text-center">Attendance Rate</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {groups[selectedGroup as keyof typeof groups].students.map(student => {
//                         const stats = calculateStudentStats(student.id);
//                         return (
//                           <tr key={student.id} className="border-t">
//                             <td className="px-4 py-3">
//                               <div className="font-medium">{student.name}</div>
//                             </td>
//                             <td className="px-4 py-3 text-center">
//                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
//                                 {stats.present}
//                               </span>
//                             </td>
//                             <td className="px-4 py-3 text-center">
//                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
//                                 {stats.absent}
//                               </span>
//                             </td>
//                             <td className="px-4 py-3">
//                               <div className="flex items-center justify-center">
//                                 <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[150px]">
//                                   <div
//                                     className="bg-blue-500 h-2.5 rounded-full"
//                                     style={{ width: `${stats.presentPercentage}%` }}
//                                   ></div>
//                                 </div>
//                                 <span className="ml-2 text-sm text-gray-600">
//                                   {stats.presentPercentage.toFixed(1)}%
//                                 </span>
//                               </div>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Monthly Summary */}
//                 <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <div className="text-sm text-gray-600">Average Attendance Rate</div>
//                     <div className="mt-1 text-2xl font-bold text-blue-600">
//                       {(groups[selectedGroup as keyof typeof groups].students.reduce((acc, student) => {
//                         return acc + calculateStudentStats(student.id).presentPercentage;
//                       }, 0) / groups[selectedGroup as keyof typeof groups].students.length).toFixed(1)}%
//                     </div>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <div className="text-sm text-gray-600">Total Students</div>
//                     <div className="mt-1 text-2xl font-bold text-blue-600">
//                       {groups[selectedGroup as keyof typeof groups].students.length}
//                     </div>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <div className="text-sm text-gray-600">Days in Month</div>
//                     <div className="mt-1 text-2xl font-bold text-blue-600">
//                       {getDaysInMonth(currentMonth)}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {selectedDate && renderDailyDetails()}
//     </div>
//   );
// }

// export default AttendanceReport;