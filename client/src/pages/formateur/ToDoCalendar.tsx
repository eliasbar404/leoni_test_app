// import React, { useState, useEffect } from 'react';
// import { Calendar, Clock, Plus, X, Check, Square, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';

// interface Todo {
//   id: string;
//   text: string;
//   completed: boolean;
//   eventId: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Event {
//   id: string;
//   title: string;
//   description: string | null;
//   date: string;
//   startTime: string;
//   endTime: string;
//   userId: string;
//   createdAt: string;
//   updatedAt: string;
//   todos: Todo[];
// }

// function ToDoCalendar() {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [events, setEvents] = useState<Event[]>([]);
//   const [showEventModal, setShowEventModal] = useState(false);
//   const [showEventDetails, setShowEventDetails] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
//   const [isMonthView, setIsMonthView] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [newEvent, setNewEvent] = useState({
//     title: '',
//     description: '',
//     date: '',
//     startTime: '',
//     endTime: '',
//     todos: [] as { id: string; text: string; completed: boolean }[]
//   });
//   const [newTodo, setNewTodo] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const timeSlots = Array.from({ length: 48 }, (_, i) => {
//     const hour = Math.floor(i / 2);
//     const minute = i % 2 === 0 ? '00' : '30';
//     return `${hour.toString().padStart(2, '0')}:${minute}`;
//   });

//   const monthNames = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const fetchEvents = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch('http://localhost:3000/events', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) throw new Error('Failed to fetch events');
//       const data = await response.json();
//       const formattedEvents = data.map((event: Event) => ({
//         ...event,
//         date: new Date(event.date).toISOString().split('T')[0]
//       }));
//       setEvents(formattedEvents);
//     } catch (err) {
//       setError('Failed to load events');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddEvent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const method = isEditing ? 'PUT' : 'POST';
//       const url = isEditing && selectedEvent 
//         ? `http://localhost:3000/event/${selectedEvent.id}` 
//         : 'http://localhost:3000/events';

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           title: newEvent.title,
//           description: newEvent.description || '',
//           date: newEvent.date,
//           startTime: newEvent.startTime,
//           endTime: newEvent.endTime,
//           todos: newEvent.todos.map(todo => ({ text: todo.text }))
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} event`);
//       }

//       await fetchEvents();
//       setShowEventModal(false);
//       setIsEditing(false);
//       setNewEvent({ title: '', description: '', date: '', startTime: '', endTime: '', todos: [] });
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//     }
//   };

//   const handleToggleTodo = async (todoId: string) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`http://localhost:3000/todos/${todoId}`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error('Failed to update todo');
      
//       // Update the local state immediately for better UX
//       setEvents(prevEvents => 
//         prevEvents.map(event => ({
//           ...event,
//           todos: event.todos.map(todo => 
//             todo.id === todoId 
//               ? { ...todo, completed: !todo.completed }
//               : todo
//           )
//         }))
//       );

//       // If we have a selected event, update its todos as well
//       if (selectedEvent) {
//         setSelectedEvent(prevEvent => {
//           if (!prevEvent) return null;
//           return {
//             ...prevEvent,
//             todos: prevEvent.todos.map(todo =>
//               todo.id === todoId
//                 ? { ...todo, completed: !todo.completed }
//                 : todo
//             )
//           };
//         });
//       }

//       // Fetch the latest data from the server
//       await fetchEvents();
//     } catch (err) {
//       setError('Failed to update todo');
//       // Revert the optimistic update if the server request failed
//       await fetchEvents();
//     }
//   };

//   const handleDeleteEvent = async (id: string) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`http://localhost:3000/event/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error('Failed to delete event');
//       await fetchEvents();
//       setShowEventDetails(false);
//       setSelectedEvent(null);
//     } catch (err) {
//       setError('Failed to delete event');
//     }
//   };

//   const handleAddTodo = () => {
//     if (newTodo.trim()) {
//       const todo = {
//         id: Date.now().toString(),
//         text: newTodo.trim(),
//         completed: false
//       };
//       setNewEvent(prev => ({
//         ...prev,
//         todos: [...prev.todos, todo]
//       }));
//       setNewTodo('');
//     }
//   };

//   const handleRemoveTodo = (todoId: string) => {
//     setNewEvent(prev => ({
//       ...prev,
//       todos: prev.todos.filter(todo => todo.id !== todoId)
//     }));
//   };

//   const handleEditEvent = (event: Event) => {
//     setNewEvent({
//       title: event.title,
//       description: event.description || '',
//       date: event.date,
//       startTime: event.startTime,
//       endTime: event.endTime,
//       todos: event.todos.map(todo => ({
//         id: todo.id,
//         text: todo.text,
//         completed: todo.completed
//       }))
//     });
//     setSelectedEvent(event);
//     setIsEditing(true);
//     setShowEventDetails(false);
//     setShowEventModal(true);
//   };

//   const daysInMonth = new Date(
//     selectedDate.getFullYear(),
//     selectedDate.getMonth() + 1,
//     0
//   ).getDate();

//   const firstDayOfMonth = new Date(
//     selectedDate.getFullYear(),
//     selectedDate.getMonth(),
//     1
//   ).getDay();

//   const handlePrevMonth = () => {
//     setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
//   };

//   const handleNextMonth = () => {
//     setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
//   };

//   const handlePrevDay = () => {
//     const newDate = new Date(selectedDate);
//     newDate.setDate(newDate.getDate() - 1);
//     setSelectedDate(newDate);
//   };

//   const handleNextDay = () => {
//     const newDate = new Date(selectedDate);
//     newDate.setDate(newDate.getDate() + 1);
//     setSelectedDate(newDate);
//   };

//   const formatDate = (date: Date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const getEventsForDate = (date: string) => {
//     return events.filter(event => event.date === date);
//   };

//   const timeToMinutes = (time: string) => {
//     const [hours, minutes] = time.split(':').map(Number);
//     return hours * 60 + minutes;
//   };

//   const calculateEventPosition = (event: Event) => {
//     const startMinutes = timeToMinutes(event.startTime);
//     const endMinutes = timeToMinutes(event.endTime);
//     const totalMinutes = 24 * 60;
    
//     const top = (startMinutes / totalMinutes) * 100;
//     const height = ((endMinutes - startMinutes) / totalMinutes) * 100;
    
//     return {
//       top: `${top}%`,
//       height: `${height}%`,
//       position: 'absolute' as const,
//       left: '4px',
//       right: '4px',
//       zIndex: 10
//     };
//   };

//   const renderDayView = () => {
//     const currentDate = formatDate(selectedDate);
//     const dayEvents = getEventsForDate(currentDate);
    
//     return (
//       <div className="grid grid-cols-[80px_1fr] h-[800px] overflow-y-auto bg-white rounded-lg border">
//         <div className="sticky top-0 z-20">
//           {timeSlots.map((time, index) => (
//             <div
//               key={time}
//               className={`h-16 border-b border-r border-gray-200 flex items-center justify-end pr-2 text-sm text-gray-500 ${
//                 index % 2 === 0 ? 'bg-gray-50 font-medium' : 'bg-gray-50/50'
//               }`}
//             >
//               {time}
//             </div>
//           ))}
//         </div>
//         <div className="relative">
//           {timeSlots.map((time, index) => (
//             <div
//               key={time}
//               className={`h-16 border-b border-gray-200 ${
//                 index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
//               }`}
//             />
//           ))}
//           {dayEvents.map(event => (
//             <div
//               key={event.id}
//               onClick={() => setSelectedEvent(event)}
//               className="absolute rounded-lg p-2 bg-blue-100 hover:bg-blue-200 cursor-pointer transition-all shadow-sm border border-blue-200"
//               style={calculateEventPosition(event)}
//             >
//               <div className="font-medium text-blue-900 text-sm truncate">
//                 {event.title}
//               </div>
//               <div className="text-xs text-blue-700">
//                 {event.startTime} - {event.endTime}
//               </div>
//               {event.todos.length > 0 && (
//                 <div className="text-xs bg-blue-200/50 mt-1 px-2 py-0.5 rounded-full inline-block">
//                   {event.todos.filter(t => t.completed).length}/{event.todos.length}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const renderMonthView = () => {
//     const days = [];
//     const totalDays = firstDayOfMonth + daysInMonth;
//     const rows = Math.ceil(totalDays / 7);

//     for (let i = 0; i < rows * 7; i++) {
//       const dayNumber = i - firstDayOfMonth + 1;
//       const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
//       const currentDay = isCurrentMonth
//         ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dayNumber)
//         : null;
//       const date = currentDay ? formatDate(currentDay) : '';
//       const dayEvents = getEventsForDate(date);

//       days.push(
//         <div
//           key={i}
//           className={`min-h-[120px] p-2 border border-gray-200 ${
//             isCurrentMonth ? 'bg-white' : 'bg-gray-50'
//           }`}
//         >
//           {isCurrentMonth && (
//             <>
//               <div className="font-medium text-sm text-gray-600">
//                 {dayNumber}
//                 <span className="ml-2 text-xs text-gray-500">
//                   {currentDay?.toLocaleDateString('en-US', { weekday: 'short' })}
//                 </span>
//               </div>
//               <div className="space-y-1 mt-1">
//                 {dayEvents.map(event => (
//                   <div
//                     key={event.id}
//                     className="text-xs bg-blue-50 p-2 rounded-lg shadow-sm flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors"
//                     onClick={() => setSelectedEvent(event)}
//                   >
//                     <div>
//                       <div className="font-medium text-blue-900">{event.title}</div>
//                       <div className="text-blue-700">{event.startTime} - {event.endTime}</div>
//                     </div>
//                     {event.todos.length > 0 && (
//                       <div className="text-xs bg-blue-200 px-2 py-1 rounded-full text-blue-800">
//                         {event.todos.filter(t => t.completed).length}/{event.todos.length}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       );
//     }
//     return days;
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow-sm">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center space-x-4">
//               <Calendar className="w-6 h-6 text-blue-600" />
//               <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => setIsMonthView(!isMonthView)}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
//               >
//                 {isMonthView ? 'Day View' : 'Month View'}
//               </button>
//               <button
//                 onClick={() => {
//                   setSelectedEvent(null);
//                   setIsEditing(false);
//                   setNewEvent({
//                     title: '',
//                     description: '',
//                     date: formatDate(selectedDate),
//                     startTime: '',
//                     endTime: '',
//                     todos: []
//                   });
//                   setShowEventModal(true);
//                 }}
//                 className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <Plus size={20} />
//                 <span>Add Event</span>
//               </button>
//             </div>
//           </div>

//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-semibold text-gray-800">
//               {isMonthView ? (
//                 `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
//               ) : (
//                 selectedDate.toLocaleDateString('en-US', { 
//                   weekday: 'long', 
//                   month: 'long', 
//                   day: 'numeric' 
//                 })
//               )}
//             </h2>
//             <div className="flex space-x-2">
//               <button
//                 onClick={isMonthView ? handlePrevMonth : handlePrevDay}
//                 className="p-2 border rounded hover:bg-gray-50"
//               >
//                 <ChevronLeft size={20} />
//               </button>
//               <button
//                 onClick={isMonthView ? handleNextMonth : handleNextDay}
//                 className="p-2 border rounded hover:bg-gray-50"
//               >
//                 <ChevronRight size={20} />
//               </button>
//             </div>
//           </div>

//           {isMonthView ? (
//             <>
//               <div className="grid grid-cols-7 gap-px mb-1">
//                 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//                   <div key={day} className="text-center py-2 bg-gray-50 font-medium text-gray-600">
//                     {day}
//                   </div>
//                 ))}
//               </div>
//               <div className="grid grid-cols-7 gap-px bg-gray-200">
//                 {renderMonthView()}
//               </div>
//             </>
//           ) : (
//             renderDayView()
//           )}
//         </div>
//       </div>

//       {/* Event Details Modal */}
//       {selectedEvent && !showEventModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => handleEditEvent(selectedEvent)}
//                   className="text-blue-500 hover:text-blue-700 p-1"
//                   title="Edit Event"
//                 >
//                   <Edit2 size={20} />
//                 </button>
//                 <button
//                   onClick={() => setSelectedEvent(null)}
//                   className="text-gray-500 hover:text-gray-700 p-1"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <div className="flex items-center space-x-2 text-gray-600">
//                 <Calendar className="w-5 h-5" />
//                 <span>{selectedEvent.date}</span>
//                 <Clock className="w-5 h-5 ml-2" />
//                 <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
//               </div>
//               {selectedEvent.description && (
//                 <div>
//                   <h4 className="font-medium mb-2">Description</h4>
//                   <p className="text-gray-600">{selectedEvent.description}</p>
//                 </div>
//               )}
//               <div>
//                 <h4 className="font-medium mb-2">Todo List</h4>
//                 <div className="space-y-2">
//                   {selectedEvent.todos.map(todo => (
//                     <div
//                       key={todo.id}
//                       className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
//                     >
//                       <button
//                         onClick={() => handleToggleTodo(todo.id)}
//                         className={`flex-shrink-0 w-5 h-5 border-2 rounded flex items-center justify-center transition-colors duration-200 ease-in-out ${
//                           todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-500'
//                         }`}
//                       >
//                         {todo.completed && <Check className="w-4 h-4 text-white" />}
//                       </button>
//                       <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
//                         {todo.text}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <button
//                 onClick={() => handleDeleteEvent(selectedEvent.id)}
//                 className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors mt-4"
//               >
//                 Delete Event
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add/Edit Event Modal */}
//       {showEventModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold">
//                 {isEditing ? 'Edit Event' : 'Add New Event'}
//               </h3>
//               <button
//                 onClick={() => {
//                   setShowEventModal(false);
//                   setIsEditing(false);
//                   setNewEvent({ title: '', description: '', date: '', startTime: '', endTime: '', todos: [] });
//                 }}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={24} />
//               </button>
//             </div>
//             <form onSubmit={handleAddEvent} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={newEvent.title}
//                   onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Date
//                 </label>
//                 <input
//                   type="date"
//                   required
//                   value={newEvent.date}
//                   onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Start Time
//                   </label>
//                   <select
//                     required
//                     value={newEvent.startTime}
//                     onChange={e => setNewEvent({ ...newEvent, startTime: e.target.value })}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select time</option>
//                     {timeSlots.map(time => (
//                       <option key={time} value={time}>{time}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     End Time
//                   </label>
//                   <select
//                     required
//                     value={newEvent.endTime}
//                     onChange={e => setNewEvent({ ...newEvent, endTime: e.target.value })}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select time</option>
//                     {timeSlots
//                       .filter(time => timeToMinutes(time) > timeToMinutes(newEvent.startTime || '00:00'))
//                       .map(time => (
//                         <option key={time} value={time}>{time}</option>
//                       ))}
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   value={newEvent.description}
//                   onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                   rows={3}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Todo List
//                 </label>
//                 <div className="flex space-x-2 mb-2">
//                   <input
//                     type="text"
//                     value={newTodo}
//                     onChange={e => setNewTodo(e.target.value)}
//                     placeholder="Add a todo item"
//                     className="flex-1 px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                     onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTodo())}
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddTodo}
//                     className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
//                   >
//                     Add
//                   </button>
//                 </div>
//                 <div className="space-y-2">
//                   {newEvent.todos.map(todo => (
//                     <div key={todo.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
//                       <div className="flex items-center space-x-2">
//                         <Square className="w-4 h-4 text-gray-400" />
//                         <span>{todo.text}</span>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveTodo(todo.id)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 {isEditing ? 'Update Event' : 'Add Event'}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ToDoCalendar;


import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X, Check, Square, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  eventId: string;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  todos: Todo[];
}

function ToDoCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isMonthView, setIsMonthView] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    todos: [] as { id: string; text: string; completed: boolean }[]
  });
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:3000/events', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Échec du chargement des événements');
      const data = await response.json();
      const formattedEvents = data.map((event: Event) => ({
        ...event,
        date: new Date(event.date).toISOString().split('T')[0]
      }));
      setEvents(formattedEvents);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Échec du chargement des événements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing && selectedEvent 
        ? `http://localhost:3000/event/${selectedEvent.id}` 
        : 'http://localhost:3000/events';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newEvent.title,
          description: newEvent.description || '',
          date: newEvent.date,
          startTime: newEvent.startTime,
          endTime: newEvent.endTime,
          todos: newEvent.todos.map(todo => ({ text: todo.text }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Échec de ${isEditing ? 'la mise à jour' : 'la création'} de l'événement`);
      }

      await fetchEvents();
      setShowEventModal(false);
      setIsEditing(false);
      setNewEvent({ title: '', description: '', date: '', startTime: '', endTime: '', todos: [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleToggleTodo = async (todoId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/todos/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Échec de la mise à jour de la tâche');
      
      setEvents(prevEvents => 
        prevEvents.map(event => ({
          ...event,
          todos: event.todos.map(todo => 
            todo.id === todoId 
              ? { ...todo, completed: !todo.completed }
              : todo
          )
        }))
      );

      if (selectedEvent) {
        setSelectedEvent(prevEvent => {
          if (!prevEvent) return null;
          return {
            ...prevEvent,
            todos: prevEvent.todos.map(todo =>
              todo.id === todoId
                ? { ...todo, completed: !todo.completed }
                : todo
            )
          };
        });
      }

      await fetchEvents();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Échec de la mise à jour de la tâche');
      await fetchEvents();
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/event/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Échec de la suppression de l\'événement');
      await fetchEvents();
      setShowEventDetails(false);
      setSelectedEvent(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Échec de la suppression de l\'événement');
    }
  };

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false
      };
      setNewEvent(prev => ({
        ...prev,
        todos: [...prev.todos, todo]
      }));
      setNewTodo('');
    }
  };

  const handleRemoveTodo = (todoId: string) => {
    setNewEvent(prev => ({
      ...prev,
      todos: prev.todos.filter(todo => todo.id !== todoId)
    }));
  };

  const handleEditEvent = (event: Event) => {
    setNewEvent({
      title: event.title,
      description: event.description || '',
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      todos: event.todos.map(todo => ({
        id: todo.id,
        text: todo.text,
        completed: todo.completed
      }))
    });
    setSelectedEvent(event);
    setIsEditing(true);
    setShowEventDetails(false);
    setShowEventModal(true);
  };

  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  ).getDay();

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  };

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const calculateEventPosition = (event: Event) => {
    const startMinutes = timeToMinutes(event.startTime);
    const endMinutes = timeToMinutes(event.endTime);
    const totalMinutes = 24 * 60;
    
    const top = (startMinutes / totalMinutes) * 100;
    const height = ((endMinutes - startMinutes) / totalMinutes) * 100;
    
    return {
      top: `${top}%`,
      height: `${height}%`,
      position: 'absolute' as const,
      left: '4px',
      right: '4px',
      zIndex: 10
    };
  };

  const renderDayView = () => {
    const currentDate = formatDate(selectedDate);
    const dayEvents = getEventsForDate(currentDate);
    
    return (
      <div className="grid grid-cols-[80px_1fr] h-[800px] overflow-y-auto bg-white rounded-lg border">
        <div className="sticky top-0 z-20">
          {timeSlots.map((time, index) => (
            <div
              key={time}
              className={`h-16 border-b border-r border-gray-200 flex items-center justify-end pr-2 text-sm text-gray-500 ${
                index % 2 === 0 ? 'bg-gray-50 font-medium' : 'bg-gray-50/50'
              }`}
            >
              {time}
            </div>
          ))}
        </div>
        <div className="relative">
          {timeSlots.map((time, index) => (
            <div
              key={time}
              className={`h-16 border-b border-gray-200 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
              }`}
            />
          ))}
          {dayEvents.map(event => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="absolute rounded-lg p-2 bg-blue-100 hover:bg-blue-200 cursor-pointer transition-all shadow-sm border border-blue-200"
              style={calculateEventPosition(event)}
            >
              <div className="font-medium text-blue-900 text-sm truncate">
                {event.title}
              </div>
              <div className="text-xs text-blue-700">
                {event.startTime} - {event.endTime}
              </div>
              {event.todos.length > 0 && (
                <div className="text-xs bg-blue-200/50 mt-1 px-2 py-0.5 rounded-full inline-block">
                  {event.todos.filter(t => t.completed).length}/{event.todos.length}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const days = [];
    const totalDays = firstDayOfMonth + daysInMonth;
    const rows = Math.ceil(totalDays / 7);

    for (let i = 0; i < rows * 7; i++) {
      const dayNumber = i - firstDayOfMonth + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
      const currentDay = isCurrentMonth
        ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dayNumber)
        : null;
      const date = currentDay ? formatDate(currentDay) : '';
      const dayEvents = getEventsForDate(date);

      days.push(
        <div
          key={i}
          className={`min-h-[120px] p-2 border border-gray-200 ${
            isCurrentMonth ? 'bg-white' : 'bg-gray-50'
          }`}
        >
          {isCurrentMonth && (
            <>
              <div className="font-medium text-sm text-gray-600">
                {dayNumber}
                <span className="ml-2 text-xs text-gray-500">
                  {currentDay?.toLocaleDateString('fr-FR', { weekday: 'short' })}
                </span>
              </div>
              <div className="space-y-1 mt-1">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className="text-xs bg-blue-50 p-2 rounded-lg shadow-sm flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div>
                      <div className="font-medium text-blue-900">{event.title}</div>
                      <div className="text-blue-700">{event.startTime} - {event.endTime}</div>
                    </div>
                    {event.todos.length > 0 && (
                      <div className="text-xs bg-blue-200 px-2 py-1 rounded-full text-blue-800">
                        {event.todos.filter(t => t.completed).length}/{event.todos.length}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      );
    }
    return days;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Calendrier</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMonthView(!isMonthView)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {isMonthView ? 'Vue Journalière' : 'Vue Mensuelle'}
              </button>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setIsEditing(false);
                  setNewEvent({
                    title: '',
                    description: '',
                    date: formatDate(selectedDate),
                    startTime: '',
                    endTime: '',
                    todos: []
                  });
                  setShowEventModal(true);
                }}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>Ajouter un événement</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {isMonthView ? (
                `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
              ) : (
                selectedDate.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })
              )}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={isMonthView ? handlePrevMonth : handlePrevDay}
                className="p-2 border rounded hover:bg-gray-50"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={isMonthView ? handleNextMonth : handleNextDay}
                className="p-2 border rounded hover:bg-gray-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {isMonthView ? (
            <>
              <div className="grid grid-cols-7 gap-px mb-1">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                  <div key={day} className="text-center py-2 bg-gray-50 font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {renderMonthView()}
              </div>
            </>
          ) : (
            renderDayView()
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && !showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditEvent(selectedEvent)}
                  className="text-blue-500 hover:text-blue-700 p-1"
                  title="Modifier l'événement"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>{selectedEvent.date}</span>
                <Clock className="w-5 h-5 ml-2" />
                <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
              </div>
              {selectedEvent.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600">{selectedEvent.description}</p>
                </div>
              )}
              <div>
                <h4 className="font-medium mb-2">Liste des tâches</h4>
                <div className="space-y-2">
                  {selectedEvent.todos.map(todo => (
                    <div
                      key={todo.id}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <button
                        onClick={() => handleToggleTodo(todo.id)}
                        className={`flex-shrink-0 w-5 h-5 border-2 rounded flex items-center justify-center transition-colors duration-200 ease-in-out ${
                          todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {todo.completed && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {todo.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleDeleteEvent(selectedEvent.id)}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors mt-4"
              >
                Supprimer l'événement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {isEditing ? 'Modifier l\'événement' : 'Ajouter un événement'}
              </h3>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setIsEditing(false);
                  setNewEvent({ title: '', description: '', date: '', startTime: '', endTime: '', todos: [] });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={newEvent.date}
                  onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de début
                  </label>
                  <select
                    required
                    value={newEvent.startTime}
                    onChange={e => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner l'heure</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de fin
                  </label>
                  <select
                    required
                    value={newEvent.endTime}
                    onChange={e => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner l'heure</option>
                    {timeSlots
                      .filter(time => timeToMinutes(time) > timeToMinutes(newEvent.startTime || '00:00'))
                      .map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Liste des tâches
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={e => setNewTodo(e.target.value)}
                    placeholder="Ajouter une tâche"
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTodo())}
                  />
                  <button
                    type="button"
                    onClick={handleAddTodo}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="space-y-2">
                  {newEvent.todos.map(todo => (
                    <div key={todo.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Square className="w-4 h-4 text-gray-400" />
                        <span>{todo.text}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTodo(todo.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditing ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToDoCalendar;


