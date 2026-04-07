import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainPhoto, setMainPhoto] = useState('');
  
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const petRes = await api.get(`/pets/${id}`);
        setPet(petRes.data);
        if (petRes.data.photos && petRes.data.photos.length > 0) {
          setMainPhoto(petRes.data.photos[0]);
        } else {
          setMainPhoto('https://placedog.net/500/400?id=1');
        }

        if (isAuthenticated) {
          const [watchRes, appRes] = await Promise.all([
            api.get('/watchlist/mine'),
            api.get('/applications/mine')
          ]);
          
          setIsWatchlisted(watchRes.data.some(w => w.petId?._id === id || w.petId === id));
          setHasApplied(appRes.data.some(a => a.petId?._id === id || a.petId === id));
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load pet details');
      } finally {
        setLoading(false);
      }
    };

    fetchPetData();
  }, [id, isAuthenticated]);

  const handleWatchlist = async () => {
    if (!isAuthenticated) return navigate('/login');
    
    setActionLoading(true);
    try {
      if (isWatchlisted) {
        await api.delete(`/watchlist/${id}`);
        setIsWatchlisted(false);
        toast.success('Removed from watchlist');
      } else {
        await api.post(`/watchlist/${id}`);
        setIsWatchlisted(true);
        toast.success('Added to watchlist');
      }
    } catch (error) {
      toast.error('Failed to update watchlist');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) return navigate('/login');
    if (user?.role !== 'adopter') return toast.error('Only adopters can apply.');
    navigate(`/apply/${id}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const getTraitColor = (trait) => {
    switch (trait) {
      case 'Good with kids': return 'bg-green-100 text-green-800 border-green-200';
      case 'Energetic': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Calm': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'House-trained': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!pet) {
    return <div className="text-center py-20 text-2xl font-bold">Pet not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Column - Gallery */}
        <div className="w-full lg:w-[60%]">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 mb-4 bg-gray-100 h-96 sm:h-[500px]">
             <img src={mainPhoto} alt={pet.name} className="w-full h-full object-contain" />
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-2">
            {pet.photos?.length > 0 ? pet.photos.map((photo, idx) => (
              <button 
                key={idx} 
                onClick={() => setMainPhoto(photo)}
                className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${mainPhoto === photo ? 'border-indigo-600 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                 <img src={photo} alt={`${pet.name} thumbnail`} className="w-full h-full object-cover" />
              </button>
            )) : (
               <div className="w-24 h-24 rounded-lg border-2 border-indigo-600 overflow-hidden">
                 <img src="https://placedog.net/500/400?id=1" alt="Fallback" className="w-full h-full object-cover" />
               </div>
            )}
          </div>

          {pet.videoUrl && (
             <div className="mt-8 rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-black">
               <video src={pet.videoUrl} controls className="w-full max-h-[400px]" />
             </div>
          )}

          <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About {pet.name}</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{pet.description || "No description provided."}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[40%]">
           <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
             
             <div className="flex justify-between items-start mb-4">
               <div>
                 <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{pet.name}</h1>
                 <p className="text-gray-500 font-medium">
                   {pet.breed} &bull; {pet.age} yrs &bull; {pet.gender} &bull; {pet.size}
                 </p>
               </div>
               <button onClick={handleShare} className="text-gray-400 hover:text-indigo-600 transition" title="Share">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3 3 0 000-1.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
               </button>
             </div>

             <div className="flex items-center text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg font-semibold mb-6">
               <span className="mr-2 text-xl">📍</span>
               {pet.shelterId?.name} - {pet.shelterId?.city}
             </div>

             <div className="mb-8">
               <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Traits & Personality</h3>
               <div className="flex flex-wrap gap-2">
                 {pet.traits?.map((trait, idx) => (
                   <span key={idx} className={`px-3 py-1 text-sm font-semibold rounded-full border ${getTraitColor(trait)}`}>
                     {trait}
                   </span>
                 ))}
               </div>
             </div>

             <div className="space-y-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={handleApply}
                  disabled={hasApplied || pet.status === 'adopted'}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-center text-lg transition-transform hover:scale-[1.02] shadow-sm ${
                    pet.status === 'adopted'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed hover:scale-100'
                    : hasApplied 
                      ? 'bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed hover:scale-100' 
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30'
                  }`}
                >
                  {pet.status === 'adopted' ? 'Already Adopted 🎉' : hasApplied ? 'Application Submitted ✓' : 'Apply to Adopt 🐾'}
                </button>

                <button 
                  onClick={handleWatchlist}
                  disabled={actionLoading}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-center border-2 transition-colors flex items-center justify-center gap-2 outline-none ${
                    isWatchlisted
                    ? 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {isWatchlisted ? '❤️ In Watchlist' : '🤍 Add to Watchlist'}
                </button>
             </div>

           </div>
        </div>

      </div>
    </div>
  );
};

export default PetDetail;
