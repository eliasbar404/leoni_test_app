// import React, { useEffect, useState } from 'react';
// import { 
//   BookOpen, 
//   Users, 
//   Calendar, 
//   CheckCircle2, 
//   Clock, 
//   AlertCircle,
//   X
// } from 'lucide-react';

// interface Activity {
//   type: 'test' | 'attendance' | 'event';
//   title: string;
//   time: string;
//   status: 'completed' | 'pending' | 'in_progress';
//   details: {
//     participants?: number;
//     score?: number;
//     duration?: string;
//     location?: string;
//   };
// }

// function TodayActivities() {
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [hiddenActivities, setHiddenActivities] = useState<Set<string>>(
//     new Set(JSON.parse(localStorage.getItem('hiddenActivities') || '[]'))
//   );

//   useEffect(() => {
//     const url = "http://localhost:3000";
//     const token = localStorage.getItem("token");
//     const fetchOptions = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//     const fetchTodayActivities = async () => {
//       try {
//         const response = await fetch(`${url}/api/formateur/activities/today`,fetchOptions);
//         if (!response.ok) throw new Error('Erreur lors de la récupération des activités');
//         const data = await response.json();
//         setActivities(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Une erreur est survenue');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTodayActivities();
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('hiddenActivities', JSON.stringify([...hiddenActivities]));
//   }, [hiddenActivities]);

//   const hideActivity = (activityKey: string) => {
//     setHiddenActivities(prev => {
//       const newSet = new Set(prev);
//       newSet.add(activityKey);
//       return newSet;
//     });
//   };

//   const showAllActivities = () => {
//     setHiddenActivities(new Set());
//   };

//   const getActivityKey = (activity: Activity, index: number) => {
//     return `${activity.type}-${activity.title}-${activity.time}-${index}`;
//   };

//   const getStatusColor = (status: Activity['status']) => {
//     switch (status) {
//       case 'completed':
//         return 'text-green-500';
//       case 'in_progress':
//         return 'text-blue-500';
//       case 'pending':
//         return 'text-orange-500';
//       default:
//         return 'text-gray-500';
//     }
//   };

//   const getStatusIcon = (status: Activity['status']) => {
//     switch (status) {
//       case 'completed':
//         return <CheckCircle2 className="w-5 h-5 text-green-500" />;
//       case 'in_progress':
//         return <Clock className="w-5 h-5 text-blue-500" />;
//       case 'pending':
//         return <AlertCircle className="w-5 h-5 text-orange-500" />;
//     }
//   };

//   const getActivityIcon = (type: Activity['type']) => {
//     switch (type) {
//       case 'test':
//         return <BookOpen className="w-6 h-6 text-purple-500" />;
//       case 'attendance':
//         return <Users className="w-6 h-6 text-blue-500" />;
//       case 'event':
//         return <Calendar className="w-6 h-6 text-green-500" />;
//     }
//   };

//   const visibleActivities = activities.filter((_, index) => 
//     !hiddenActivities.has(getActivityKey(activities[index], index))
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 p-4 rounded-lg">
//         <p className="text-red-600">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-slate-100 rounded-lg shadow-lg p-6 w-full mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Activités d'Aujourd'hui</h2>
//         {hiddenActivities.size > 0 && (
//           <button
//             onClick={showAllActivities}
//             className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
//           >
//             Afficher toutes les activités ({activities.length})
//           </button>
//         )}
//       </div>
      
//       {visibleActivities.length === 0 ? (
//         <div className="text-center py-8">
//           <p className="text-gray-500">
//             {activities.length === 0 
//               ? "Aucune activité prévue pour aujourd'hui"
//               : "Toutes les activités sont masquées"}
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {activities.map((activity, index) => {
//             const activityKey = getActivityKey(activity, index);
//             if (hiddenActivities.has(activityKey)) return null;

//             return (
//               <div
//                 key={activityKey}
//                 className="flex items-start bg-white space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
//               >
//                 <div className="flex-shrink-0">
//                   {getActivityIcon(activity.type)}
//                 </div>
                
//                 <div className="flex-grow">
//                   <div className="flex items-center justify-between">
//                     <h3 className="font-semibold text-gray-800">{activity.title}</h3>
//                     <span className="text-sm text-gray-500">{activity.time}</span>
//                   </div>
                  
//                   <div className="mt-2 text-sm text-gray-600">
//                     {activity.type === 'test' && activity.details.participants && (
//                       <p>
//                         {activity.details.participants} participants
//                         {activity.details.score && ` • Score moyen: ${activity.details.score}%`}
//                       </p>
//                     )}
                    
//                     {activity.type === 'attendance' && activity.details.participants && (
//                       <p>{activity.details.participants} opérateurs présents</p>
//                     )}
                    
//                     {activity.type === 'event' && (
//                       <p>
//                         {activity.details.duration && `Durée: ${activity.details.duration}`}
//                         {activity.details.location && ` • Lieu: ${activity.details.location}`}
//                       </p>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="flex-shrink-0 flex items-center space-x-2">
//                   <span className={`text-sm ${getStatusColor(activity.status)}`}>
//                     {activity.status === 'completed' && 'Terminé'}
//                     {activity.status === 'in_progress' && 'En cours'}
//                     {activity.status === 'pending' && 'À venir'}
//                   </span>
//                   {getStatusIcon(activity.status)}
//                   <button
//                     onClick={() => hideActivity(activityKey)}
//                     className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-gray-100 rounded"
//                     title="Masquer cette activité"
//                   >
//                     <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// export default TodayActivities;




import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  User,
  Users2,
} from 'lucide-react';

interface Activity {
  type: 'test' | 'attendance' | 'event' | 'group' | 'profile';
  title: string;
  time: string;
  status: 'completed' | 'pending' | 'in_progress' | 'updated' | 'created';
  details: {
    participants?: number;
    score?: number;
    duration?: string;
    location?: string;
    members?: number;
    firstName?: string;
    lastName?: string;
  };
}

function TodayActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hiddenActivities, setHiddenActivities] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem('hiddenActivities') || '[]'))
  );

  useEffect(() => {
    const url = 'http://localhost:3000';
    const token = localStorage.getItem('token');
    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const fetchTodayActivities = async () => {
      try {
        const response = await fetch(`${url}/api/formateur/activities/today`, fetchOptions);
        if (!response.ok) throw new Error('Erreur lors de la récupération des activités');
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchTodayActivities();
  }, []);

  useEffect(() => {
    localStorage.setItem('hiddenActivities', JSON.stringify([...hiddenActivities]));
  }, [hiddenActivities]);

  const hideActivity = (activityKey: string) => {
    setHiddenActivities((prev) => {
      const newSet = new Set(prev);
      newSet.add(activityKey);
      return newSet;
    });
  };

  const showAllActivities = () => {
    setHiddenActivities(new Set());
  };

  const getActivityKey = (activity: Activity, index: number) => {
    return `${activity.type}-${activity.title}-${activity.time}-${index}`;
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in_progress':
        return 'text-blue-500';
      case 'pending':
        return 'text-orange-500';
      case 'updated':
        return 'text-purple-500';
      case 'created':
        return 'text-indigo-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'updated':
        return <CheckCircle2 className="w-5 h-5 text-purple-500" />;
      case 'created':
        return <CheckCircle2 className="w-5 h-5 text-indigo-500" />;
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'test':
        return <BookOpen className="w-6 h-6 text-purple-500" />;
      case 'attendance':
        return <Users className="w-6 h-6 text-blue-500" />;
      case 'event':
        return <Calendar className="w-6 h-6 text-green-500" />;
      case 'group':
        return <Users2 className="w-6 h-6 text-indigo-500" />;
      case 'profile':
        return <User className="w-6 h-6 text-teal-500" />;
    }
  };

  const visibleActivities = activities.filter((_, index) =>
    !hiddenActivities.has(getActivityKey(activities[index], index))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 rounded-lg shadow-lg p-6 w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Activités d'Aujourd'hui</h2>
        {hiddenActivities.size > 0 && (
          <button
            onClick={showAllActivities}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Afficher toutes les activités ({activities.length})
          </button>
        )}
      </div>

      {visibleActivities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {activities.length === 0
              ? "Aucune activité prévue pour aujourd'hui"
              : "Toutes les activités sont masquées"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const activityKey = getActivityKey(activity, index);
            if (hiddenActivities.has(activityKey)) return null;

            return (
              <div
                key={activityKey}
                className="flex items-start bg-white space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    {activity.type === 'test' && activity.details.participants && (
                      <p>
                        {activity.details.participants} participants
                        {activity.details.score && ` • Score moyen: ${activity.details.score}%`}
                      </p>
                    )}

                    {activity.type === 'attendance' && activity.details.participants && (
                      <p>{activity.details.participants} opérateurs présents</p>
                    )}

                    {activity.type === 'event' && (
                      <p>
                        {activity.details.duration && `Durée: ${activity.details.duration}`}
                        {activity.details.location && ` • Lieu: ${activity.details.location}`}
                      </p>
                    )}

                    {activity.type === 'group' && activity.details.members && (
                      <p>{activity.details.members} membres</p>
                    )}

                    {activity.type === 'profile' && (
                      <p>
                        {activity.details.firstName && `Prénom: ${activity.details.firstName}`}
                        {activity.details.lastName && ` • Nom: ${activity.details.lastName}`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-center space-x-2">
                  <span className={`text-sm ${getStatusColor(activity.status)}`}>
                    {activity.status === 'completed' && 'Terminé'}
                    {activity.status === 'in_progress' && 'En cours'}
                    {activity.status === 'pending' && 'À venir'}
                    {activity.status === 'updated' && 'Mis à jour'}
                    {activity.status === 'created' && 'Créé'}
                  </span>
                  {getStatusIcon(activity.status)}
                  <button
                    onClick={() => hideActivity(activityKey)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-gray-100 rounded"
                    title="Masquer cette activité"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TodayActivities;