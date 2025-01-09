import { useState, useEffect } from 'react';
import axios from 'axios';
import { Test } from '../../types/test';
import { Loader2 } from 'lucide-react';
import { BookOpen, Calendar, Award ,Settings,Trash2  } from 'lucide-react';
import { Search} from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const FormateurTestsPage = () =>{
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/formateur/quizzes', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setTests(response.data);
      setError('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch tests');
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(search.toLowerCase()) ||
                         test.description.toLowerCase().includes(search.toLowerCase()) || test.creatorName.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = !difficulty || test.difficulty === difficulty;
    const matchesCategory = !category || test.category === category;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const handleTestSelect = (test: Test) => {
    // Handle test selection - you can add navigation here
    console.log('Selected test:', test);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Mes Tests</h1>
          <Link
            to={"/formateur/dashboard/tests/create"}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Créer un Test
          </Link>
        </div>

        <TestFilters
          search={search}
          difficulty={difficulty}
          category={category}
          onSearchChange={setSearch}
          onDifficultyChange={setDifficulty}
          onCategoryChange={setCategory}
        />

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map(test => (
            <TestCard
              key={test.id}
              test={test}
              onSelect={handleTestSelect}
            />
          ))}
        </div>

        {filteredTests.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {search || difficulty || category
                ? 'Aucun test ne correspond à vos critères de recherche'
                : 'Aucun test disponible'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormateurTestsPage;











interface TestCardProps {
  test: Test;
  onSelect: (test: Test) => void;
}

function TestCard({ test, onSelect }: TestCardProps) {


  const Delete_Test = async(id:string)=>{

  
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:3000/formateur/test/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(response.status == 201){
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "vous avez supprimé le test avec succès",
          showConfirmButton: false,
          timer: 1500
        }).then(()=>{
          // navigate("/formateur/dashboard/tests")
          window.location.reload()
        });

      }


  }
  return (
    <div 
      onClick={() => onSelect(test)}
      className="bg-white min-w-[300px] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
    >
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {test.title}
          </h3>
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${test.difficulty === 'EASY' ? 'bg-green-100 text-green-800' : 
              test.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'}
          `}>
            {test.difficulty}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2">{test.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Award className="w-4 h-4 mr-1" />
            <span>{test.testPoints} points</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            <span>{test.category}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{new Date(test.createdAt).toLocaleDateString()}</span>
          </div>


        </div>
          <div className='relative'>
               créer par: <span className='text-green-400'>{test.creatorName}</span>

               <div className='absolute right-[-12px] bottom-[-10px] flex gap-1'>
               <Link className='text-blue-500 text-xl font-black' to={`/formateur/dashboard/test/${test.id}/edit`}><Settings size={30}/></Link>
               <button className='text-red-500'
               onClick={()=>{


                Swal.fire({
                  title: "êtes-vous sûr de vouloir supprimer ce test?",
                  showCancelButton: true,
                  confirmButtonText: "OUI",
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    Delete_Test(test.id)
                  } 
                });
               }}
               
               
               
               
               ><Trash2 size={30} /></button>

               </div>

               
          </div>

          
      </div>
    </div>
  );
}





interface TestFiltersProps {
  search: string;
  difficulty: string;
  category: string;
  onSearchChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

function TestFilters({
  search,
  difficulty,
//   category,
  onSearchChange,
  onDifficultyChange,
//   onCategoryChange
}: TestFiltersProps) {
  return (
    <div className="bg-white flex justify-start gap-3 p-4 rounded-lg shadow-sm space-y-4 md:space-y-0 md:flex md:items-start md:space-x-4">
      <div className="flex-2 relative">
        <Search className="absolute right-3 top-6 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher des tests..."
          className="w-full pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-col space-x-4 -translate-x-4">
        <div className="relative">
          {/* <Filter className="absolute right-10 top-6 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
          >
            <option value="">Tous les niveaux</option>
            <option value="EASY">Facile</option>
            <option value="MEDIUM">Moyen</option>
            <option value="HARD">Difficile</option>
          </select>
        </div>
        
        {/* <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
          >
            <option value="">Toutes les catégories</option>
            <option value="MATH">Mathématiques</option>
            <option value="PHYSICS">Physique</option>
            <option value="CHEMISTRY">Chimie</option>
          </select>
        </div> */}
      </div>
    </div>
  );
}