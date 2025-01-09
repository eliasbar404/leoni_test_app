import { User } from '../types/User';
import { Link } from 'react-router-dom';



import { Phone,Settings , MapPin, Hash, Briefcase  ,IdCard,BookText  ,CircleFadingArrowUp } from 'lucide-react';
// import { ProfileHeader } from './ProfileHeader';
// import { ProfileInfo } from './ProfileInfo';
// import { SocialLinks } from './SocialLinks';

interface ProfileCardProps {
  data: User;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ data }) => {
  return (
    <div className="bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
        <div className="p-6">
          <ProfileHeader title="Profile" />
          
          {/* Profile Image and Name */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-lg overflow-hidden mb-4">
              <img
                src={data.image}
                alt={`${data.firstName} ${data.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              {data.firstName} {data.lastName}
            </h2>
          </div>


          <ProfileInfo user={data} />
          {/* <SocialLinks /> */}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;







interface ProfileHeaderProps {
  title: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl text-gray-700">{title}</h2>
      {/* <button className="bg-emerald-500 p-2 rounded-full text-white hover:bg-emerald-600 transition-colors">
        <Pencil size={20} />
      </button> */}

      
    </div>
  );
}







interface ProfileInfoProps {
  user: User;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  return (
    <div className="w-full space-y-3 mt-4">
      <div className="flex items-center text-gray-600">
        <Briefcase  size={18} className="mr-3" />
        <span>{user.role}</span>
      </div>
      <div className="flex items-center text-gray-600">
        <IdCard size={18} className="mr-3" />
        <span>{user.cin}</span>
      </div>
      <div className="flex items-center text-gray-600">
        <Hash  size={18} className="mr-3" />
        <span>{user.matricule}</span>
      </div>
      <div className="flex items-center text-gray-600">
        <MapPin size={18} className="mr-3" />
        <span>{user.address}</span>
      </div>
      <div className="flex items-center text-gray-600">
        <Phone size={18} className="mr-3"/>
        <span>{user.phone}</span>
      </div>

      <div className="flex items-center text-gray-600"> 
        <CircleFadingArrowUp size={20} className="mr-3"/>
        <span className='font-black text-md'>Groupe: <span className='text-md text-green-500'>{user.groups}</span></span>
      </div>

      {
        user.role === "OPERATEUR" &&       
        <div className="flex items-center text-gray-600"> 
        <CircleFadingArrowUp size={20} className="mr-3"/>
        <span className='font-black text-md'>Formateur: <span className='text-md text-green-500'>{user.formateur}</span></span>
      </div>
      }


      
      <div className="flex gap-2 items-center text-gray-600">
      <Link to={`/formateur/dashboard/operateur/${user.id}/edit`} className="bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors">
        <Settings  size={20} />
      </Link>

      <Link to={`/formateur/dashboard/operateur/${user.id}/info`} className="bg-emerald-500 p-2 rounded-full text-white hover:bg-emerald-600 transition-colors">
        <BookText size={20} />
      </Link>
      </div>
    </div>
  );
}
