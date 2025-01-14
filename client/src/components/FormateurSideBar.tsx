// import { useState } from 'react';
// import { Home, Users,User , NotepadText, Menu ,CalendarDays ,ListTodo } from 'lucide-react';
// import { Link, useLocation } from 'react-router-dom';

// const menuItems = [
//   { id: 'home', icon: Home, label: 'Accueil', link: "/formateur/dashboard" },
//   { id: 'groups', icon: Users, label: 'Groupes', link: "/formateur/dashboard/groupes" },
//   { id: 'users', icon: User, label: 'Opérateurs', link: "/formateur/dashboard/operateurs" },
//   { id: 'tests', icon: NotepadText, label: 'Tests', link: "/formateur/dashboard/tests" },
//   { id: 'absence', icon: CalendarDays, label: 'Présences', link: "/formateur/dashboard/présences" },
//   { id: 'task', icon: ListTodo, label: 'Liste de faire', link: "/formateur/dashboard/listedefaire" },
// ];

// const FormateurSidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const location = useLocation();

//   return (
//     <aside 
//       className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-900 to-blue-500 text-white transition-all duration-300 z-50
//         ${isCollapsed ? 'w-[70px]' : 'w-[250px]'}`}
//     >
//       {/* Header */}
//       <div className="p-6 flex items-center gap-4 border-b border-white/10">
//         <button 
//           disabled
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//         >
//           <Menu size={20} />
//         </button>
//         {!isCollapsed && (
//           <h2 className="text-2xl font-bold">LEONI</h2>
//         )}
//       </div>

//       {/* Navigation */}
//       <nav className="py-4">
//         {menuItems.map((item) => {
//           const isActive = location.pathname === item.link;
//           return (
//             <Link
//               key={item.id}
//               to={item.link}
//               className={`flex items-center gap-4 px-6 py-3 transition-colors relative
//                 ${isCollapsed ? 'justify-center px-4' : ''}
//                 ${isActive ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/10'}
//                 ${isActive ? 'before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-400 before:shadow-[0_0_10px_rgba(52,152,219,0.5)]' : ''}`}
//             >
//               <item.icon size={20} />
//               {!isCollapsed && (
//                 <span className="font-medium">{item.label}</span>
//               )}
//             </Link>
//           );
//         })}
//       </nav>

//     </aside>
//   );
// };

// export default FormateurSidebar;

import { useState } from 'react';
import { Home, Users, User, NotepadText, Menu, CalendarDays,Info , ListTodo, ChevronDown, ChevronRight, MessageSquareMore, FolderOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { id: 'home', icon: Home, label: 'Accueil', link: "/formateur/dashboard" },
  {
    id: 'groups',
    icon: Users,
    label: 'Groupes',
    children: [
      { id: 'list-groups', label: 'Liste des groupes', link: "/formateur/dashboard/groupes" },
      { id: 'add-group', label: 'Ajouter un groupe', link: "/formateur/dashboard/groupes/create" },
    ]
  },
  {
    id: 'users',
    icon: User,
    label: 'Opérateurs',
    children: [
      { id: 'list-users', label: 'Liste des opérateurs', link: "/formateur/dashboard/operateurs" },
      { id: 'add-user', label: 'Ajouter un opérateur', link: "/formateur/dashboard/operateurs/create" },
    ]
  },
  { id: 'project', icon: NotepadText, label: 'Projects',
    children:[
      { id: 'list-tests', label: 'Liste des projects', link: "/formateur/dashboard/tests" },
      { id: 'add-test', label: 'Ajouter un project', link: "/formateur/dashboard/tests/create" },

    ]
    },
  { id: 'absence', icon: CalendarDays, label: 'Présences', link: "/formateur/dashboard/présences" },
  { id: 'task', icon: ListTodo, label: 'Liste de faire', link: "/formateur/dashboard/listedefaire" },
  { id: 'dossiers', icon: FolderOpen , label: 'Dossiers', link: "/formateur/dashboard/dossiers" },
  { id: 'info', icon: Info , label: 'info', link: "/formateur/dashboard/info" },
  { id: 'contact', icon: MessageSquareMore , label: 'Contact & Aide', link: "/formateur/dashboard/contact" },
];

const FormateurSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const location = useLocation();

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderMenuItem = (item: any) => {
    const isActive = location.pathname === item.link;
    const isExpanded = expandedMenus.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleSubmenu(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-3 transition-colors
              ${isCollapsed ? 'justify-center px-4' : ''}
              ${isActive ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <item.icon size={20} />
            {!isCollapsed && (
              <>
                <span className="font-medium flex-1 text-left">{item.label}</span>
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </>
            )}
          </button>
          {!isCollapsed && isExpanded && (
            <div className="bg-white/5">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {item.children.map((child: any) => (
                <Link
                  key={child.id}
                  to={child.link}
                  className={`flex items-center px-12 py-2 transition-colors
                    ${location.pathname === child.link 
                      ? 'text-white bg-white/10' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                >
                  <span className="font-medium text-sm">{child.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

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
  };

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-900 to-blue-500 text-white transition-all duration-300 z-50
        ${isCollapsed ? 'w-[70px]' : 'w-[250px]'}`}
    >
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-white/10">
        <button 
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
        {menuItems.map(renderMenuItem)}
      </nav>
    </aside>
  );
};

export default FormateurSidebar;