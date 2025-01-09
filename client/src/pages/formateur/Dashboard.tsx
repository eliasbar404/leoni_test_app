import FormateurLayout from '../../layouts/FormateurLayout';

import { Outlet } from 'react-router-dom';
import FormateurNavbar from '../../components/FormateurNavbar';
import FormateurSidebar from '../../components/FormateurSideBar';


const Dashboard = () => {
  return (
    <FormateurLayout>
      <div className="flex w-full min-h-screen bg-gray-50">
        <FormateurSidebar />
        <div className="flex-1 min-h-screen">
          <FormateurNavbar />
          <main className="p-4 lg:p-8 ml-[70px] md:ml-[250px] mt-16">
            <Outlet />
          </main>
        </div>
      </div>
    </FormateurLayout>
  )
}

export default Dashboard