import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, ChevronLeft, ChevronRight, Search ,Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Swal from 'sweetalert2';

// API Configuration
const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Pagination Settings
const ITEMS_PER_PAGE = 10;

// Main Component
const FormateurGroupesPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [groups, setGroups] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Groups
  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
      setError(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to fetch groups');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Mes Groupes
        </h1>
        <Link to={"/formateur/dashboard/groupes/create"}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Ajouter un groupe
        </Link>
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groupe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membres</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-red-600">{error}</td>
              </tr>
            ) : paginatedGroups.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  Aucun groupe trouvé.
                </td>
              </tr>
            ) : (
              paginatedGroups.map((group) => (
                <GroupRow key={group.id} group={group} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredGroups.length}
        itemsPerPage={ITEMS_PER_PAGE}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default FormateurGroupesPage;

// GroupRow Component
interface GroupRowProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  group: any;
}

const GroupRow: React.FC<GroupRowProps> = ({ group }) => {

    const DeleteGroup = async(id:string)=>{
        const token = localStorage.getItem("token");
        const response = await axios.delete(`http://localhost:3000/groups/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in the Authorization header
            },
        });

        if(response.status == 200){
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Vous avez supprimé le groupe avec succès",
                showConfirmButton: false,
                timer: 1500
            }).then(()=>{
                window.location.reload()
            });
        }
    }
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <Link to={`/formateur/dashboard/groupe/${group.id}/operateurs`} className="text-sm font-medium text-gray-900">{group.name}</Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {group.members.length} membres
      </td>
      <td className="px-6 py-4 flex gap-2 whitespace-nowrap text-sm font-medium">
        <button title='Supprimer' onClick={()=>{
          Swal.fire({
            title: "si vous supprimez le groupe, tous les opérateurs appartenant à ce groupe seront supprimés avec leurs informations.",
            showCancelButton: true,
            confirmButtonText: "Continuer",
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire({
                title: "Alors, êtes-vous sûr de supprimer ce groupe ?",
                showCancelButton: true,
                confirmButtonText: "OUI",
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  DeleteGroup(group.id)
                } 
              });
            } 
          });
        }
          
          
          } className="text-red-600 hover:text-red-900 transition-colors">
          <Trash2 className="h-7 w-7" />
        </button>
        <Link to={`/formateur/dashboard/groupe/${group.id}`} title='Modifier' className="text-green-600 hover:text-green-900 transition-colors">
          <Settings className="h-7 w-7" />
        </Link>
        
      </td>
    </tr>
  );
};

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  setCurrentPage,
}) => {
  if (totalItems === 0) return null;

  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span>
            {' - '}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span>
            {' of '}
            <span className="font-medium">{totalItems}</span>
          </p>
        </div>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                ${currentPage === i + 1
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  );
};

// SearchBar Component
interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-6 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Rechercher un groupe..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

