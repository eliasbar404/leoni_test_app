import { Users, GraduationCap, BookCheck , LucideIcon ,FilePenLine } from 'lucide-react';
import useAdminStatistics from '../../hooks/useAdminStatistics';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { statistics, loading, error } = useAdminStatistics();

  // If loading or there's an error, display a placeholder or message
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // The statistics object is available here, now use it in the Stats Grid
  const stats = [
    { 
      title: "Total Formateurs", 
      value: statistics?.formaters || 0, 
      icon: GraduationCap, 
      color: "border-l-4 border-blue-500" 
    },
    { 
      title: "Total Operateurs", 
      value: statistics?.operateurs || 0, 
      icon: Users, 
      color: "border-l-4 border-green-500" 
    },
    { 
      title: "Tests", 
      value: statistics?.quizzes || 0, 
      icon: FilePenLine , 
      color: "border-l-4 border-purple-500" 
    },
    { 
      title: "Tests terminés", 
      value: statistics?.quizAttempt || 0, 
      icon: BookCheck , 
      color: "border-l-4 border-yellow-500" 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* <RecentActivity /> */}
          
          {/* Additional Section (e.g., Chart or Calendar) */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Actions rapides</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link to={"/admin/dashboard/tests/create"} className="p-4 text-center bg-blue-50 rounded-lg text-blue-700 font-medium hover:bg-blue-100 transition-colors">
                Nouvel Test
              </Link>
              <Link to={"/admin/dashboard/users/create"} className="p-4 text-center bg-green-50 rounded-lg text-green-700 font-medium hover:bg-green-100 transition-colors">
                Ajouter un Utilisateur
              </Link>
              <Link to={"/admin/dashboard/profile"} className="p-4 text-center bg-purple-50 rounded-lg text-purple-700 font-medium hover:bg-purple-100 transition-colors">
                Profil
              </Link>
              <button className="p-4 bg-yellow-50 rounded-lg text-yellow-700 font-medium hover:bg-yellow-100 transition-colors">
                Settings
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// StatCard Component
interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${color} transform transition-transform duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-l-4', 'bg-opacity-10')}`}>
          <Icon size={24} className={color.replace('border-l-4', 'text')} />
        </div>
      </div>
    </div>
  );
}

// RecentActivity Component
// interface ActivityItem {
//     id: number;
//     user: string;
//     action: string;
//     time: string;
// }

// const activities: ActivityItem[] = [
//   { id: 1, user: "John Doe", action: "Completed Test #123", time: "2 hours ago" },
//   { id: 2, user: "Jane Smith", action: "Started Training Module", time: "3 hours ago" },
//   { id: 3, user: "Mike Johnson", action: "Updated Profile", time: "5 hours ago" },
// ];

// const RecentActivity: React.FC = () => {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
//         <div className="space-y-4">
//           {activities.map((activity) => (
//             <div key={activity.id} className="flex items-center justify-between border-b pb-3 last:border-0">
//               <div>
//                 <p className="font-medium text-gray-800">{activity.user}</p>
//                 <p className="text-sm text-gray-500">{activity.action}</p>
//               </div>
//               <span className="text-sm text-gray-400">{activity.time}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
// }
