import { useState } from 'react';
import { Home, Users,User , NotepadText, Menu ,CalendarDays } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { id: 'home', icon: Home, label: 'Accueil', link: "/formateur/dashboard" },
  { id: 'groups', icon: Users, label: 'Groupes', link: "/formateur/dashboard/groupes" },
  { id: 'users', icon: User, label: 'Opérateurs', link: "/formateur/dashboard/operateurs" },
  { id: 'tests', icon: NotepadText, label: 'Tests', link: "/formateur/dashboard/tests" },
  { id: 'absence', icon: CalendarDays, label: 'Présences', link: "/formateur/dashboard/présences" },
];

const FormateurSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-900 to-blue-500 text-white transition-all duration-300 z-50
        ${isCollapsed ? 'w-[70px]' : 'w-[250px]'}`}
    >
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-white/10">
        <button 
          disabled
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        {!isCollapsed && (
          <h2 className="text-2xl font-bold">LEONI</h2>
        )}
      </div>

      {/* Navigation */}
      <nav className="py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.link;
          return (
            <Link
              key={item.id}
              to={item.link}
              className={`flex items-center gap-4 px-6 py-3 transition-colors relative
                ${isCollapsed ? 'justify-center px-4' : ''}
                ${isActive ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/10'}
                ${isActive ? 'before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-400 before:shadow-[0_0_10px_rgba(52,152,219,0.5)]' : ''}`}
            >
              <item.icon size={20} />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
};

export default FormateurSidebar;