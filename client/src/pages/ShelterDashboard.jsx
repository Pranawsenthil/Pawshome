import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Skeleton from '../components/Skeleton';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const allTraits = ["Playful", "Calm", "Energetic", "Good with kids", "Good with other pets", "House-trained", "Apartment-friendly", "Loves walks"];

export default function ShelterDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('pets'); // 'pets', 'applications', 'analytics'
  
  // Data States
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petForm, setPetForm] = useState({
    name: '', species: 'Dog', breed: '', age: '', gender: 'Male', size: 'Medium', traits: [], description: ''
  });
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pets' || activeTab === 'analytics') {
        const petRes = await api.get('/pets/mine');
        setPets(petRes.data);
      }
      if (activeTab === 'applications' || activeTab === 'analytics') {
        const appRes = await api.get('/applications/shelter');
        setApplications(appRes.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // --- Pets Logic ---
  const handleDeletePet = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;
    try {
      await api.delete(`/pets/${id}`);
      setPets(pets.filter(p => p._id !== id));
      toast.success('Pet deleted successfully');
    } catch (err) {
      toast.error('Failed to delete pet');
    }
  };

  const handleCreatePet = async (e) => {
    e.preventDefault();
    if (photos.length === 0) return toast.error("Please add at least 1 photo");
    setUploading(true);

    try {
      const formData = new FormData();
      Object.keys(petForm).forEach(key => {
        if (key === 'traits') {
          formData.append(key, petForm[key].join(','));
        } else {
          formData.append(key, petForm[key]);
        }
      });
      // Append files
      for (let i = 0; i < photos.length; i++) {
        formData.append('photos', photos[i]);
      }

      const res = await api.post('/pets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setPets([res.data.pet, ...pets]);
      setIsModalOpen(false);
      setPhotos([]);
      setPetForm({ name: '', species: 'Dog', breed: '', age: '', gender: 'Male', size: 'Medium', traits: [], description: '' });
      toast.success('Pet created successfully!');
    } catch (error) {
      toast.error('Failed to create pet');
    } finally {
      setUploading(false);
    }
  };

  const toggleTrait = (trait) => {
    setPetForm(prev => {
      if (prev.traits.includes(trait)) {
        return { ...prev, traits: prev.traits.filter(t => t !== trait) };
      }
      return { ...prev, traits: [...prev.traits, trait] };
    });
  };

  // --- Applications Logic ---
  const handleStageAdvance = async (appId, currentStage) => {
    if (currentStage >= 4) return;
    try {
      await api.put(`/applications/${appId}/stage`, { stage: currentStage + 1 });
      toast.success('Application advanced successfully');
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to advance application');
    }
  };

  const handleReject = async (appId) => {
    const note = window.prompt("Reason for rejection:");
    if (note === null) return;
    try {
      await api.put(`/applications/${appId}/stage`, { stage: 5, note: note || "Application rejected" });
      toast.success('Application rejected');
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to reject application');
    }
  };

  // --- Analytics Logic ---
  const petStatusData = [
    { name: 'Available', value: pets?.filter(p => p.status === 'available').length || 0 },
    { name: 'Pending', value: pets?.filter(p => p.status === 'pending').length || 0 },
    { name: 'Adopted', value: pets?.filter(p => p.status === 'adopted').length || 0 },
  ].filter(d => d.value > 0);

  const stageNames = ["Submitted", "Reviewing Home", "Reference Check", "Decision", "Rejected"];
  const applicationStageData = stageNames.map((name, index) => ({
    name,
    count: applications?.filter(a => a.stage === index + 1).length || 0
  }));

  const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'];

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Shelter Dashboard 🏠</h1>
            <p className="text-gray-500 mt-1">Manage pets, track adoptions, and view analytics.</p>
          </div>
          {activeTab === 'pets' && (
            <button onClick={() => setIsModalOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-colors">
              + Add New Pet
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 sm:space-x-4 border-b border-gray-200 mb-8 overflow-x-auto">
          {['pets', 'applications', 'analytics'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 font-bold text-sm sm:text-base border-b-2 whitespace-nowrap transition-colors ${activeTab === tab ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading ? (
           <div className="space-y-4">
               <Skeleton className="h-16 w-full" />
               <Skeleton className="h-16 w-full" />
               <Skeleton className="h-16 w-full" />
           </div>
        ) : (
          <div>
            {/* MY PETS TAB */}
            {activeTab === 'pets' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pet</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Species</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pets.length === 0 && (
                      <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">No pets listed yet. Click "+ Add New Pet" to get started!</td></tr>
                    )}
                    {pets.map(pet => (
                      <tr key={pet._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-4">
                          <img src={pet.photos[0] || 'https://via.placeholder.com/150'} alt={pet.name} className="h-12 w-12 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{pet.name}</p>
                            <p className="text-xs text-gray-500">{pet.breed} • {pet.age} years</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pet.species}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            pet.status === 'available' ? 'bg-green-100 text-green-800' :
                            pet.status === 'pending' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {pet.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleDeletePet(pet._id)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* APPLICATIONS TAB */}
            {activeTab === 'applications' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pet</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stage</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.length === 0 && (
                      <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">No applications received yet.</td></tr>
                    )}
                    {applications.map(app => (
                      <tr key={app._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-bold text-gray-900">{app.applicantName || 'Applicant'}</p>
                          <p className="text-xs text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-900 font-medium">{app.petId?.name || 'Unknown Pet'}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                             app.stage === 5 ? 'bg-red-100 text-red-800' :
                             app.stage === 4 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                           }`}>
                             Stage {app.stage}: {app.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {app.stage < 4 && (
                            <button onClick={() => handleStageAdvance(app._id, app.stage)} className="text-indigo-600 hover:text-indigo-900 mr-4">Approve Stage</button>
                          )}
                          {app.stage < 4 && (
                            <button onClick={() => handleReject(app._id)} className="text-red-600 hover:text-red-900">Reject</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pie Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Pet Status Distribution</h3>
                  {petStatusData.length > 0 ? (
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={petStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                            {petStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-10">No pet data available.</p>
                  )}
                  <div className="flex justify-center gap-4 mt-4">
                    {petStatusData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm font-medium text-gray-600">{entry.name} ({entry.value})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Application Funnel</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={applicationStageData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" />
                        <YAxis allowDecimals={false} />
                        <Tooltip cursor={{ fill: '#f3f4f6' }} />
                        <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add New Pet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-end justify-center sm:items-center sm:px-4">
          <div className="bg-white max-w-2xl w-full sm:rounded-3xl shadow-2xl mt-20 sm:my-8 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <h3 className="text-xl font-bold text-gray-900">Add New Pet</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleCreatePet} className="p-6 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name *</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" value={petForm.name} onChange={e => setPetForm({...petForm, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Species *</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" value={petForm.species} onChange={e => setPetForm({...petForm, species: e.target.value})}>
                      <option>Dog</option><option>Cat</option><option>Rabbit</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Breed *</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" value={petForm.breed} onChange={e => setPetForm({...petForm, breed: e.target.value})} />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age (Yrs) *</label>
                      <input required type="number" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" value={petForm.age} onChange={e => setPetForm({...petForm, age: e.target.value})} />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" value={petForm.gender} onChange={e => setPetForm({...petForm, gender: e.target.value})}>
                        <option>Male</option><option>Female</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" value={petForm.size} onChange={e => setPetForm({...petForm, size: e.target.value})}>
                      <option>Small</option><option>Medium</option><option>Large</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Photos (Files) *</label>
                    <input required type="file" multiple accept="image/*" onChange={(e) => setPhotos(Array.from(e.target.files))} className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                    {photos.length > 0 && <p className="text-xs text-gray-500 mt-2">{photos.length} files selected</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Traits</label>
                    <div className="flex flex-wrap gap-2">
                      {allTraits.map(trait => (
                        <button key={trait} type="button" onClick={() => toggleTrait(trait)} className={`px-3 py-1 rounded-full text-xs font-medium border ${petForm.traits.includes(trait) ? 'bg-indigo-100 border-indigo-200 text-indigo-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                          {trait}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows="3" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" value={petForm.description} onChange={e => setPetForm({...petForm, description: e.target.value})}></textarea>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 border-t border-gray-100 pt-6 flex justify-end gap-4 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100">Cancel</button>
                <button type="submit" disabled={uploading} className="px-6 py-2.5 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-70 flex items-center">
                  {uploading ? 'Uploading & Saving...' : 'Save Pet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
