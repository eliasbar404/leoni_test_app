import { useState, useEffect } from 'react';

import { Settings ,MapPin ,Phone ,IdCard ,Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ProfileData } from '../../types/Profile';
import { ProfileHeader } from '../../components/ProfileHeader';


export default function FormateurProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/formateur/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfileData({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          cin: response.data.user.cin,
          role:response.data.user.role,
          matricule: response.data.user.matricule,
          image: response.data.user.image || '',
          phone:response.data.user.phone,
          address:response.data.user.address,
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500">{error}</div>
    </div>
  );

  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ProfileHeader />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard profile={profileData} />
          </div>

          {/* Right Column - Stats and Additional Info */}
          <div className="lg:col-span-2">
            <ProfileStats
              matricule={profileData.matricule}
              cin={profileData.cin}
            />

            {/* Activity Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* <h3 className="text-lg font-semibold mb-4">Recent Activity</h3> */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <MapPin />
                  <div>
                    <p className="text-sm text-gray-600">{profileData.address}</p>
                    {/* <p className="text-xs text-gray-400">2 days ago</p> */}
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Phone />
                  <div>
                    <p className="text-sm text-gray-600">{profileData.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



interface ProfileCardProps {
  profile: ProfileData;
}

function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 relative">
      <Link
        to="/formateur/dashboard/profile/edit"
        className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Settings className="w-5 h-5 text-gray-600" />
      </Link>

      <div className="flex flex-col items-center">
        <div className="w-32 h-32 mb-4 relative">
          <img
            src={profile.image || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop'}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-full h-full object-cover rounded-full ring-4 ring-gray-50"
          />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          {profile.firstName} {profile.lastName}
        </h2>
        <p className="text-gray-500 mt-1">{profile.role}</p>

        <div className="mt-6 w-full">
          <div className="flex justify-center space-x-4">
{/* 
            <p className='font-black text-2xl'>Formateur: <span className='text-green-500'>{profile.formateur}</span></p> */}
            {/* <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              Message
            </button>
            <Link
              to="/admin/dashboard/profile/edit"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Edit Profile
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}





interface ProfileStatsProps {
  matricule: string;
  cin: string;
}

function ProfileStats({ matricule, cin }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-4">
        <div className="bg-blue-100 p-2 rounded-full">
          <Hash  className="text-blue-600 w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Matricule</p>
          <p className="font-semibold">{matricule}</p>
        </div>
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg flex items-center space-x-4">
        <div className="bg-purple-100 p-2 rounded-full">
          <IdCard className="text-purple-600 w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">CIN</p>
          <p className="font-semibold">{cin}</p>
        </div>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-4">
        <div className="bg-green-400 p-2 rounded-full">
          {/* <Mail className="text-green-600 w-5 h-5" /> */}
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-semibold">Active</p>
        </div>
      </div>
    </div>
  );
}