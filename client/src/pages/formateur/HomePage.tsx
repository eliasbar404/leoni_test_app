import Charts from '../../components/Charts';
import TodayActivities from '../../components/TodayActivities';
import useFormateurStatistics from '../../hooks/useFormateurStatistics';
import { Users,FilePenLine, LucideIcon,User, Folder } from 'lucide-react';

const HomePage: React.FC = () => {
  const { statistics, loading, error } = useFormateurStatistics();

  const stats = [
    { 
      title: "Total Groupes", 
      value: statistics?.groupes || 0, 
      icon: Users, 
      color: "border-l-4 border-red-500",
      background:"bg-gradient-to-b from-red-900 to-red-500"
    },
    { 
      title: "Total Operateurs", 
      value: statistics?.operateurs || 0, 
      icon: User, 
      color: "border-l-4 border-blue-500",
      background:"bg-gradient-to-b from-blue-900 to-blue-500"
    },
    { 
      title: "Tests", 
      value: statistics?.tests || 0, 
      icon: FilePenLine , 
      color: "border-l-4 border-green-500",
      background:"bg-gradient-to-b from-green-900 to-green-500"
    },
    { 
      title: "Dossier Complet", 
      value: 20, 
      icon: Folder, 
      color: "border-l-4 border-yellow-500",
      background:"bg-gradient-to-b from-yellow-900 to-yellow-500"
    }
  ];


  // If loading or there's an error, display a placeholder or message
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }



  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-10">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              background={stat.background}
            />
          ))}
        </div>


        {/* Activity Section */}
        <div className="flex flex-col gap-5">
          {/* <RecentActivity /> */}
          
          {/* Additional Section (e.g., Chart or Calendar) */}
          {/* <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-black text-gray-800 mb-4 p-5">Actions rapides</h2>
            <div className="grid grid-cols-2 gap-4 overflow-hidden">
              <Link to={"/formateur/dashboard/tests/create"} className="p-4 text-center bg-blue-50 rounded-lg text-blue-700 font-medium hover:bg-blue-100 transition-colors">
                Nouvel Test
              </Link>
              <Link to={"/formateur/dashboard/operateurs/create"} className="p-4 text-center bg-green-50 rounded-lg text-green-700 font-medium hover:bg-green-100 transition-colors">
                Ajouter un Utilisateur
              </Link>
              <Link to={"/formateur/dashboard/groupes/create"} className="p-4 text-center bg-red-50 rounded-lg text-red-700 font-medium hover:bg-red-100 transition-colors">
                Ajouter un Groupe
              </Link>
              <Link to={"/formateur/dashboard/profile"} className="p-4 text-center bg-purple-50 rounded-lg text-purple-700 font-medium hover:bg-purple-100 transition-colors">
                Profil
              </Link>
              <button className="p-4 bg-yellow-50 rounded-lg text-yellow-700 font-medium hover:bg-yellow-100 transition-colors">
                Settings
              </button>
            </div>
          </div> */}

          <TodayActivities/>



        </div>
      </main>


      <div className='flex gap-10'>
        <Charts/>
       
      </div>


    </div>
  );
};

export default HomePage;









// StatCard Component
interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  background:string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color,background }) => {
  return (
    <div className={`${background} rounded-lg shadow-md p-6 ${color} transform transition-transform duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-md font-semibold mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-l-4', 'bg-opacity-10')}`}>
          <Icon size={27} color='white' className={color.replace('border-l-4', 'text')} />
        </div>
      </div>
    </div>
  );
}