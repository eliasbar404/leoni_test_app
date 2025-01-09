import { User } from 'lucide-react';

export function ProfileHeader() {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="p-3 bg-blue-100 rounded-full">
        <User size={32} className="text-blue-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Paramètres du profil</h1>
    </div>
  );
}