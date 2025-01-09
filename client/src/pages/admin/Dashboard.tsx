import AdminLayout from '../../layouts/AdminLayout';
import Sidebar from '../../components/SideBar';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="flex w-full min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 min-h-screen">
          <Navbar />
          <main className="p-4 lg:p-8 ml-[70px] md:ml-[250px] mt-16">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;