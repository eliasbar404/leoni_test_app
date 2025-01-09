import React from 'react';
import { UserCircle2 ,UserCog, LogOut } from 'lucide-react';
import { useOperateurProfile } from '../hooks/useOperateurProfile';
import { Link} from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';


const OperateurNavbar = () => {
  const { profileData, loading, error } = useOperateurProfile();

  return (
    <nav className="fixed w-[100%] shadow-lg top-0 right-0 h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-40">
      <div className="flex items-center gap-4">
        <Link to='/operateur/dashboard/' className="text-2xl font-extrabold text-[#070a94]">LEONI</Link>
      </div>
      
      <div className="flex items-center gap-4">
        <UserProfile 
          profileData={profileData} 
          loading={loading} 
          error={error} 
        />
      </div>
    </nav>
  );
};

export default OperateurNavbar;






interface ProfileData {
    firstName: string;
    lastName: string;
    cin: string;
    matricule: string;
    image: string;
    address:string;
    phone:string;
    formateur:string;
}

interface UserProfileProps {
  profileData: ProfileData | null;
  loading: boolean;
  error: string | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  profileData, 
  loading}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        {profileData?.image ? (
          <img
            src={profileData.image}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <UserCircle2 className="w-8 h-8 text-gray-600" />
        )}
        <span className="hidden md:block text-sm font-medium text-gray-700">
          {loading ? 'Loading...' : profileData ? `${profileData.firstName} ${profileData.lastName}` : 'Profile'}
        </span>
      </button>

      {isOpen && (
        <ProfileDropdown onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};




interface ProfileDropdownProps {
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onClose }) => {
  const { handleLogout } = useLogout();

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
      <Link
        to="/operateur/dashboard/profile"
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={onClose}
      >
        <UserCog className="w-4 h-4" />
        <span>Profile</span>
      </Link>
      
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <LogOut className="w-4 h-4" />
        <span>Déconnexion</span>
      </button>
    </div>
  );
};