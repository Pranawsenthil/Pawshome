import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import PetCard from '../components/PetCard';
import Skeleton from '../components/Skeleton';

const Home = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [stories, setStories] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [loadingStories, setLoadingStories] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await api.get('/pets?status=available&limit=4');
        setFeaturedPets(res.data.pets.slice(0, 4) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPets(false);
      }
    };

    const fetchStories = async () => {
      try {
        const res = await api.get('/stories');
        setStories(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStories(false);
      }
    };

    fetchPets();
    fetchStories();
  }, []);

  return (
    <div className="bg-white">
      {/* Section 1 - Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 pb-20 pt-24 text-center px-4 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Find Your Forever Friend 🐾
          </h1>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto font-medium">
            Give a rescued pet a loving home. Browse hundreds of pets waiting for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pets" className="bg-white text-orange-600 px-8 py-3.5 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition drop-shadow-sm">
              Browse Pets
            </Link>
            <Link to="/quiz" className="bg-transparent text-white border-2 border-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-white hover:text-orange-600 transition shadow-sm">
              Take the Quiz
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Section 2 - Featured Pets */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Meet Our Pets</h2>
          <Link to="/pets" className="text-indigo-600 font-bold hover:text-indigo-800 hidden sm:block">View all &rarr;</Link>
        </div>
        
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x hide-scrollbar">
          {loadingPets ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="min-w-[280px] w-[280px] md:min-w-[300px] snap-center">
                <Skeleton className="h-[430px] w-full" />
              </div>
            ))
          ) : (
            featuredPets.map(pet => (
              <div key={pet._id} className="min-w-[280px] w-[280px] md:min-w-[300px] snap-center">
                <PetCard pet={pet} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Section 3 - How It Works */}
      <section className="bg-orange-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-md mb-6 text-4xl">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Browse</h3>
              <p className="text-gray-600">Find the perfect companion whose traits match your lifestyle.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-md mb-6 text-4xl">📝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Apply</h3>
              <p className="text-gray-600">Submit an application to the shelter to review your details.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-md mb-6 text-4xl">🏠</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Adopt</h3>
              <p className="text-gray-600">Bring your new best friend home and start your journey!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - Success Stories */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 tracking-tight mb-16">Happy Tails 🎉</h2>
        {loadingStories ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
          </div>
        ) : stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {stories.map(story => (
               <div key={story._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                 <div className="h-48 overflow-hidden bg-gray-100 relative items-center justify-center flex text-6xl">
                    {story.photo ? (
                      <img src={story.photo} alt={story.petName} className="w-full h-full object-cover" />
                    ) : ( <span>🎉</span> )}
                 </div>
                 <div className="p-6 flex-grow flex flex-col">
                   <h3 className="text-xl font-bold text-gray-900 mb-2">{story.petName}</h3>
                   <p className="text-gray-600 italic">"{story.story.length > 100 ? story.story.substring(0, 100) + '...' : story.story}"</p>
                   <p className="text-xs font-semibold text-gray-400 mt-4 text-right mt-auto">— {story.userId?.name || 'Anonymous'}</p>
                 </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-4xl mb-4 block">🏆</span>
            <p className="text-gray-500 font-medium text-lg">Be the first to share your adoption story!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
