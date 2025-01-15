// import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import { Bell, X } from 'lucide-react'; // Import the Bell and X icons from Lucide

// const FormateurNotifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false); // State to toggle notifications dropdown

//   useEffect(() => {
//     // Connect to the Socket.IO server
//     const socket = io('http://localhost:3000', {
//       withCredentials: true,
//     });

//     // Listen for the 'testAttemptSaved' event
//     socket.on('testAttemptSaved', (data) => {
//       console.log('New test attempt saved:', data);

//       setNotifications((prevNotifications) => [
//         ...prevNotifications,
//         {
//           id: Date.now(), // Unique ID for the notification
//           message: `L'opérateur ${data.operateurName} a réussi le test (${data.testName}) en premier à ${data.date} et son score est ${data.score}/${data.testPoints}`,
//         },
//       ]);
//     });

//     // Clean up the socket connection when the component unmounts
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   // Toggle the notifications dropdown
//   const toggleNotifications = () => {
//     setIsNotificationOpen(!isNotificationOpen);
//   };

//   // Remove a notification by ID
//   const removeNotification = (id) => {
//     setNotifications((prevNotifications) =>
//       prevNotifications.filter((notification) => notification.id !== id)
//     );
//   };

//   return (
//     <div className="p-6 font-sans">


//       {/* Notification Icon and Dropdown */}
//       <div className="relative">
//         {/* Notification Icon */}
//         <button
//           onClick={toggleNotifications}
//           className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
//         >
//           <Bell className="w-6 h-6 text-gray-700" />
//           {/* Notification Badge */}
//           {notifications.length > 0 && (
//             <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
//               {notifications.length}
//             </span>
//           )}
//         </button>

//         {/* Notifications Dropdown */}
//         {isNotificationOpen && (
//           <div className="absolute w-[500px] right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
//             <div className="p-4">
//               <h2 className="text-lg font-semibold mb-4">Notifications</h2>
//               {notifications.length === 0 ? (
//                 <p className="text-gray-500">No new notifications.</p>
//               ) : (
//                 <ul>
//                   {notifications.map((notification) => (
//                     <li
//                       key={notification.id}
//                       className="py-2 border-b hover:bg-slate-200 px-2 cursor-pointer border-gray-200 last:border-b-0 flex items-center justify-between"
//                     >
//                       <p className="text-sm text-gray-700">{notification.message}</p>
//                       {/* "X" Button to Remove Notification */}
//                       <button
//                         onClick={() => removeNotification(notification.id)}
//                         className="p-1 text-gray-500 hover:text-red-500 focus:outline-none"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Bell, X } from 'lucide-react'; // Import the Bell and X icons from Lucide

// Define the type for notifications
interface Notification {
  id: number;
  message: string;
}

const FormateurNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]); // Explicitly define the type
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // State to toggle notifications dropdown

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io('http://localhost:3000', {
      withCredentials: true,
    });

    // Listen for the 'testAttemptSaved' event
    socket.on('testAttemptSaved', (data) => {
      console.log('New test attempt saved:', data);

      // Add the new notification to the state
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          id: Date.now(), // Unique ID for the notification
          message: `L'opérateur  <span style="font-weight: bold;">${data.operateurName}</span> a réussi le test <span style="font-weight: bold;">${data.testName}</span> en premier à ${data.date} et son score est <span style="font-weight: bold;">${data.score}/${data.testPoints}</span>`,
        },
      ]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  // Toggle the notifications dropdown
  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  // Remove a notification by ID
  const removeNotification = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="p-6 font-sans">

      {/* Notification Icon and Dropdown */}
      <div className="relative">
        {/* Notification Icon */}
        <button
          onClick={toggleNotifications}
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {/* Notification Badge */}
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        {isNotificationOpen && (
          <div className="absolute right-0 mt-2 w-[400px] bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Notifications</h2>
              {notifications.length === 0 ? (
                <p className="text-gray-500">No new notifications.</p>
              ) : (
                <ul>
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className="py-2 border-b hover:bg-slate-200 cursor-pointer px-2 border-gray-200 last:border-b-0 flex items-center justify-between"
                    >
                                            <p
                        className="text-sm text-gray-700"
                        dangerouslySetInnerHTML={{ __html: notification.message }}
                      />
                      {/* "X" Button to Remove Notification */}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="p-1 text-gray-500 hover:text-red-500 focus:outline-none"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export default FormateurNotifications;