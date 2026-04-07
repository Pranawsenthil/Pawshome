import { useState, useEffect } from 'react';
import api from '../api/axios';
import PetCard from '../components/PetCard';
import Skeleton from '../components/Skeleton';

const allTraits = ["Playful", "Calm", "Energetic", "Good with kids", "Good with other pets", "House-trained", "Apartment-friendly", "Loves walks", "Independent", "Affectionate", "Senior-friendly"];

const PetGallery = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    species: [],
    size: [],
    minAge: '',
    maxAge: '',
    traits: []
  });

  const [activeQuery, setActiveQuery] = useState({});

  const fetchPets = async (queryObject, pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const params = { page: pageNum, ...queryObject };
      // Process arrays for API
      if (params.species && params.species.length > 0) params.species = params.species.join(',');
      else delete params.species;

      if (params.size && params.size.length > 0) params.size = params.size.join(',');
      else delete params.size;

      if (params.traits && params.traits.length > 0) params.traits = params.traits.join(',');
      else delete params.traits;

      const res = await api.get('/pets', { params });
      
      if (append) {
        setPets(prev => [...prev, ...res.data.pets]);
      } else {
        setPets(res.data.pets);
      }
      setTotalPages(res.data.pages);
      setTotalCount(res.data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets(activeQuery, page, page > 1);
  }, [page, activeQuery]);

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      if (Array.isArray(prev[type])) {
        if (prev[type].includes(value)) {
          return { ...prev, [type]: prev[type].filter(item => item !== value) };
        } else {
          return { ...prev, [type]: [...prev[type], value] };
        }
      }
      return { ...prev, [type]: value };
    });
  };

  const applyFilters = () => {
    setPage(1);
    setActiveQuery({ ...filters });
    setIsSidebarOpen(false); // Close drawer on mobile after applying
  };

  const clearFilters = () => {
    const defaultFilters = { species: [], size: [], minAge: '', maxAge: '', traits: [] };
    setFilters(defaultFilters);
    setPage(1);
    setActiveQuery({});
  };

  return (
    <div className="bg-gray-50 min-h-[90vh] py-8 border-t border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="w-full bg-white border border-gray-300 text-gray-800 font-bold py-3 rounded-xl shadow-sm flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Show Filters
          </button>
        </div>

        {/* Sidebar Background Blur (Mobile) */}
        <div 
          className={`fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        {/* Sidebar Drawer / Desktop Sidebar */}
        <div className={`fixed md:relative inset-y-0 left-0 z-50 w-[280px] bg-white shadow-xl md:shadow-none transform transition-transform duration-300 md:transform-none shrink-0 overflow-y-auto md:overflow-visible flex flex-col h-full md:h-auto md:block ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          
          <div className="bg-white p-6 md:rounded-2xl md:shadow-sm md:border md:border-gray-100 md:sticky md:top-24 max-h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-lg font-bold text-gray-900">Filters</h2>
              <div className="flex items-center gap-4">
                <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Clear All</button>
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
              </div>
            </div>

            {/* Species */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Species</h3>
              <div className="space-y-2.5">
                {['Dog', 'Cat', 'Rabbit', 'Other'].map(species => (
                  <label key={species} className="flex items-center cursor-pointer group">
                    <input type="checkbox" className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer" 
                      checked={filters.species.includes(species)} 
                      onChange={() => handleFilterChange('species', species)} 
                    />
                    <span className="ml-3 text-gray-700 text-sm font-medium group-hover:text-indigo-800">{species}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Size</h3>
              <div className="space-y-2.5">
                {['Small', 'Medium', 'Large'].map(size => (
                  <label key={size} className="flex items-center cursor-pointer group">
                    <input type="checkbox" className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer" 
                      checked={filters.size.includes(size)} 
                      onChange={() => handleFilterChange('size', size)} 
                    />
                    <span className="ml-3 text-gray-700 text-sm font-medium group-hover:text-indigo-800">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Age Range */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Age (Years)</h3>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" min="0" className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" value={filters.minAge} onChange={(e) => handleFilterChange('minAge', e.target.value)} />
                <span className="text-gray-400 font-bold">-</span>
                <input type="number" placeholder="Max" min="0" className="w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" value={filters.maxAge} onChange={(e) => handleFilterChange('maxAge', e.target.value)} />
              </div>
            </div>

            {/* Traits */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Traits</h3>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                {allTraits.map(trait => (
                  <label key={trait} className="flex items-center cursor-pointer group">
                    <input type="checkbox" className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer" 
                      checked={filters.traits.includes(trait)} 
                      onChange={() => handleFilterChange('traits', trait)} 
                    />
                    <span className="ml-3 text-gray-700 text-sm font-medium group-hover:text-indigo-800">{trait}</span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={applyFilters} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-sm mt-auto md:mt-4 mb-4 md:mb-0">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Browse Pets</h1>
            <span className="text-indigo-700 font-bold bg-indigo-50 px-4 py-1.5 rounded-full text-sm">{totalCount} pets found</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {!loading && pets.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-6xl mb-4 block">😔</span>
                <h3 className="text-xl font-bold text-gray-900">No pets match your filters</h3>
                <p className="text-gray-500 mt-2">Try clearing your filters or widening your search.</p>
                <button onClick={clearFilters} className="mt-6 font-bold text-indigo-600 hover:text-indigo-800">Clear all filters</button>
              </div>
            )}
            
            {pets.map(pet => (
              <PetCard key={pet._id} pet={pet} />
            ))}

            {loading && Array(6).fill(0).map((_, idx) => (
              <Skeleton key={`skel-${idx}`} className="h-[430px] w-full" />
            ))}
          </div>

          {!loading && page < totalPages && (
             <div className="mt-14 text-center">
               <button 
                 onClick={() => setPage(page + 1)} 
                 className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-3.5 px-10 rounded-full shadow-sm transition-colors"
                >
                 Load More Pets
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetGallery;
