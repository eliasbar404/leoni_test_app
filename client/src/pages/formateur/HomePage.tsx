// import { Users, User  ,FilePenLine } from 'lucide-react';
// import useFormateurStatistics from '../../hooks/useFormateurStatistics';
import { Link } from 'react-router-dom';
import Charts from '../../components/Charts';
import TodayActivities from '../../components/TodayActivities';




const HomePage: React.FC = () => {


  // If loading or there's an error, display a placeholder or message
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }



  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-10">


        {/* Activity Section */}
        <div className="flex flex-col gap-5">
          {/* <RecentActivity /> */}
          
          {/* Additional Section (e.g., Chart or Calendar) */}
          <div className="bg-white rounded-lg shadow-md p-6">
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
          </div>

          <TodayActivities/>



        </div>
      </main>


      <div className='flex flex-col gap-10'>
        <Charts/>
       
      </div>


    </div>
  );
};

export default HomePage;









