import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import PetCard from '../components/PetCard';
import Skeleton from '../components/Skeleton';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('applications');
  
  const [applications, setApplications] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'applications') {
          const res = await api.get('/applications/mine');
          setApplications(res.data);
        } else {
          const res = await api.get('/watchlist/mine');
          setWatchlist(res.data);
        }
      } catch (err) {
         toast.error('Failed to load personal data properly');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const removeFromWatchlist = async (petId) => {
    try {
      await api.delete(`/watchlist/${petId}`);
      setWatchlist(prev => prev.filter(w => w.petId?._id !== petId));
      toast.success('Removed securely from your watchlist');
    } catch (err) {
      toast.error('Failed to remove element');
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ";
    switch(status) {
      case 'pending': return base + 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'under-review': return base + 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'approved': return base + 'bg-green-100 text-green-800 border border-green-200';
      case 'rejected': return base + 'bg-red-100 text-red-800 border border-red-200';
      default: return base + 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex items-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome back, {user?.name}! 🐾</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-gray-200 mb-10">
        <button 
          onClick={() => setActiveTab('applications')}
          className={`pb-4 text-sm font-bold uppercase tracking-wide border-b-4 transition-colors ${activeTab === 'applications' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          My Applications
        </button>
        <button 
          onClick={() => setActiveTab('watchlist')}
          className={`pb-4 text-sm font-bold uppercase tracking-wide border-b-4 transition-colors ${activeTab === 'watchlist' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          My Watchlist
        </button>
      </div>

      {/* Content Loading Framework */}
      <div className="min-h-[50vh]">
        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {Array(3).fill(0).map((_, i) => <Skeleton key={i} className={activeTab === 'watchlist' ? "h-96 w-full" : "h-48 w-full"} />)}
           </div>
        ) : activeTab === 'applications' ? (
           
           /* Applications Content Block */
           applications.length > 0 ? (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {applications.map(app => (
                 <div key={app._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-6 items-start hover:shadow-md transition-shadow">
                   <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-sm shrink-0 bg-gray-100">
                     <img src={app.petId?.photos?.[0] || 'https://placedog.net/500/400?id=1'} alt={app.petId?.name} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-grow w-full">
                     <div className="flex justify-between items-start mb-3">
                       <div>
                         <h3 className="text-xl font-bold text-gray-900">{app.petId?.name}</h3>
                         <p className="text-sm font-medium text-gray-500 mt-1">{app.petId?.breed} • {app.petId?.species}</p>
                       </div>
                       <span className={getStatusBadge(app.status)}>{app.status}</span>
                     </div>
                     
                     {/* Mini Stepper representing adoption stages visually */}
                     <div className="mt-6">
                       <div className="flex justify-between mb-2">
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stage {app.stage} of 4</span>
                       </div>
                       <div className="flex space-x-2">
                         {[1,2,3,4].map(s => (
                           <div key={s} className={`h-2 flex-1 rounded-full ${s <= app.stage ? 'bg-indigo-600' : 'bg-gray-100'}`}></div>
                         ))}
                       </div>
                     </div>

                     <div className="mt-6 flex justify-end">
                        <Link to={`/pets/${app.petId?._id}`} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors">
                          View Pet Details &rarr;
                        </Link>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="text-center py-24 bg-gray-50 rounded-3xl border border-gray-100">
               <span className="text-6xl block mb-6">📝</span>
               <h3 className="text-xl font-bold text-gray-900">You haven't applied for any pets yet.</h3>
               <p className="text-gray-500 mt-2 mb-8 max-w-sm mx-auto">Adopting a pet changes incredibly loving lives. Browse our gallery to find yours.</p>
               <Link to="/pets" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-full shadow-sm transition-colors">Browse Pets &rarr;</Link>
             </div>
           )

        ) : (
           /* Watchlist Content Block */
           watchlist.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {watchlist.map(item => {
                 const pet = item.petId;
                 if (!pet) return null;
                 return (
                   <div key={item._id} className="relative group">
                     {/* Remove Button Hover Trap */}
                     <button 
                       onClick={() => removeFromWatchlist(pet._id)}
                       className="absolute -top-3 -right-3 z-10 w-10 h-10 bg-white text-red-500 hover:text-white hover:bg-red-500 border border-red-100 rounded-full shadow-md flex items-center justify-center font-bold text-xl opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                       title="Remove cleanly from Watchlist"
                     >
                       &times;
                     </button>
                     <PetCard pet={pet} />
                   </div>
                 );
               })}
             </div>
           ) : (
             <div className="text-center py-24 bg-gray-50 rounded-3xl border border-gray-100">
               <span className="text-6xl block mb-6">🤍</span>
               <h3 className="text-xl font-bold text-gray-900">Your watchlist is completely empty.</h3>
               <p className="text-gray-500 mt-2 mb-8 max-w-sm mx-auto">Keep track of the amazing animals you bond closely with by hearting them!</p>
               <Link to="/pets" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-full shadow-sm transition-colors">Start Browsing! &rarr;</Link>
             </div>
           )
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
