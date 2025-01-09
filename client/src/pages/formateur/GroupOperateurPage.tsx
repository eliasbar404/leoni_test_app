import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import { User } from '../../types/User';
import { Link, useParams } from 'react-router-dom';

import ProfileCard from '../../components/ProfileCard';
import { Modal } from 'flowbite-react';

import axios from 'axios';

// Api
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

const userService = {
  getUsers: async (groupId: string) => {
    try {
      const response = await api.get(`/groups/${groupId}/operateurs`);
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
      };
    }
  },

  deleteUserfromgroup: async (id: string) => {
    try {
      await api.put(`/group/operateur/${id}/delete`);
      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to delete user from group',
      };
    }
  },
};

const ITEMS_PER_PAGE = 10;

const GroupOperateurPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();  // Get groupId from URL params

  const [users, setUsers] = useState<User[]>([]);  // Ensure initial state is an empty array
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (groupId: string) => {
    setIsLoading(true);
    const { data, error: fetchError } = await userService.getUsers(groupId);

    if (fetchError) {
      setError(fetchError);
      setUsers([]);  // Reset users if error occurs
    } else {
      setUsers(Array.isArray(data.operateurs) ? data.operateurs : []);  // Ensure data is always an array
      setError(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (groupId) {
      fetchUsers(groupId);
    } else {
      console.error("groupId is undefined");
    }
  }, [groupId]);

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Êtes-vous sûr de vouloir supprimer l\'utilisateur?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      });

      if (result.isConfirmed) {
        const { error: deleteError } = await userService.deleteUserfromgroup(id);

        if (deleteError) {
          throw new Error(deleteError);
        }

        await fetchUsers(groupId || '');  // Re-fetch users after deletion
        Swal.fire('Supprimé!', 'L\'utilisateur a été supprimé.', 'success');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error');
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchString = `${user.firstName} ${user.lastName} ${user.cin} ${user.matricule}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Utilisateurs existants
        </h1>
        <Link
          to="/formateur/dashboard/operateurs/create"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Ajouter un utilisateur
        </Link>
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matricule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <UserRow key={user.id} user={user} onDelete={handleDelete} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredUsers.length}
        itemsPerPage={ITEMS_PER_PAGE}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default GroupOperateurPage;

interface UserRowProps {
  user: User;
  onDelete: (id: string) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onDelete }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header></Modal.Header>
          <Modal.Body>
            <ProfileCard data={user} />
          </Modal.Body>
        </Modal>
        <div className="flex items-center">
          <img
            onClick={() => setOpenModal(true)}
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.cin}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.matricule}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onClick={() => onDelete(user.id)} className="text-red-600 hover:text-red-900">
          <Trash2 className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
};

const SearchBar: React.FC<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}> = ({ searchTerm, setSearchTerm }) => (
  <div className="mb-4 flex items-center gap-2">
    <Search className="h-5 w-5 text-gray-500" />
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="px-4 py-2 w-full border rounded-lg"
      placeholder="Rechercher un utilisateur"
    />
  </div>
);

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
}> = ({ currentPage, totalPages, setCurrentPage }) => (
  <div className="flex justify-between items-center mt-4">
    <div className="text-sm text-gray-500">
      {`Page ${currentPage} sur ${totalPages}`}
    </div>
    <div className="flex gap-2">
      <button
        disabled={currentPage <= 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        disabled={currentPage >= totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  </div>
);





