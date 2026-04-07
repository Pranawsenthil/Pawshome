import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PetCard = ({ pet }) => {
  const imageUrl = pet.photos?.[0] || 'https://placedog.net/500/400?id=1';
  
  const statusColors = {
    available: 'bg-green-500',
    pending: 'bg-yellow-500',
    adopted: 'bg-gray-500'
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col h-full relative"
    >
      <div className="h-56 overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={pet.name} 
          className="w-full h-full object-cover aspect-square"
        />
        <div className={`absolute top-3 right-3 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm ${statusColors[pet.status] || 'bg-gray-500'}`}>
          {pet.status}
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-2xl font-bold text-gray-900">{pet.name}</h3>
        </div>
        
        <p className="text-sm font-medium text-gray-500 mb-4">
          {pet.breed} • {pet.age} yrs • {pet.gender}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {pet.traits?.slice(0, 3).map((trait, idx) => (
            <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium border border-indigo-100">
              {trait}
            </span>
          ))}
        </div>
        
        {pet.matchScore !== undefined && (
          <p className="text-sm font-bold text-emerald-600 mb-3">
            Match Score: {pet.matchScore}%
          </p>
        )}
        
        <div className="mt-auto pt-2">
          <Link 
            to={`/pets/${pet._id}`}
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors"
          >
            Meet {pet.name} &rarr;
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PetCard;
