import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import PetCard from '../components/PetCard';

const questions = [
  {
    id: 'activityLevel',
    title: "What's your activity level?",
    options: [
      { label: '🧘 Low', value: 'Low' },
      { label: '🚶 Medium', value: 'Medium' },
      { label: '🏃 High', value: 'High' }
    ]
  },
  {
    id: 'homeType',
    title: "What type of home do you have?",
    options: [
      { label: '🏢 Apartment', value: 'Apartment' },
      { label: '🏠 House with Yard', value: 'House with Yard' },
      { label: '🌾 Farm', value: 'Farm' }
    ]
  },
  {
    id: 'hasChildren',
    title: "Do you have children at home?",
    options: [
      { label: '👶 Yes', value: 'true' },
      { label: '🙅 No', value: 'false' }
    ]
  },
  {
    id: 'hasOtherPets',
    title: "Do you have other pets?",
    options: [
      { label: '🐕 Yes', value: 'true' },
      { label: '🙅 No', value: 'false' }
    ]
  },
  {
    id: 'sizePreference',
    title: "Size preference?",
    options: [
      { label: '🐭 Small', value: 'Small' },
      { label: '🐕 Medium', value: 'Medium' },
      { label: '🐘 Large', value: 'Large' },
      { label: '💛 No Pref', value: '' }
    ]
  }
];

const Quiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSelect = (value) => {
    setAnswers(prev => ({ ...prev, [questions[currentStep].id]: value }));
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        Object.entries(answers).forEach(([k, v]) => {
          if (v) queryParams.append(k, v);
        });
        const res = await api.get(`/pets/match?${queryParams.toString()}`);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const currentQ = questions[currentStep];
  const selectedValue = answers[currentQ?.id];

  if (results) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12 tracking-tight">Your Top Matches! 🎉</h1>
        
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map(pet => (
              <div key={pet._id} className="relative">
                 <PetCard pet={pet} />
                 {pet.matchScore !== undefined && (
                   <div className={`absolute -top-3 -right-3 z-10 px-4 py-1.5 rounded-full font-bold text-sm shadow-md border-2 border-white ${
                     pet.matchScore >= 70 ? 'bg-green-500 text-white' : 'bg-yellow-400 text-yellow-900'
                   }`}>
                     {pet.matchScore >= 70 ? '>70% Great Match' : '50-70% Good Match'}
                   </div>
                 )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
             <span className="text-6xl block mb-4">🤷</span>
             <h2 className="text-2xl font-bold text-gray-900">No perfect matches right now.</h2>
          </div>
        )}

        <div className="mt-16 text-center">
          <button 
            onClick={() => { setResults(null); setCurrentStep(0); setAnswers({}); }}
            className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 font-bold py-3.5 px-10 rounded-full transition shadow-sm"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600 mb-8"></div>
        <h2 className="text-2xl font-bold text-gray-700 animate-pulse">Finding your perfect match...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 min-h-[85vh] flex flex-col justify-center">
      
      <div className="mb-12">
        <div className="flex justify-between text-sm font-bold text-indigo-600 mb-2 uppercase tracking-wide">
          <span>Step {currentStep + 1}</span>
          <span>{questions.length}</span>
        </div>
        <div className="w-full bg-indigo-50 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-14 overflow-hidden relative min-h-[450px] flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex-grow"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10 text-center tracking-tight">
              {currentQ.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(opt.value)}
                  className={`py-8 px-6 rounded-2xl text-xl font-bold border-2 transition-all duration-200 outline-none ${
                    selectedValue === opt.value
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm transform scale-[1.02]'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-gray-50'
                  } ${currentQ.options.length === 3 && idx === 2 ? 'sm:col-span-2' : ''}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex justify-between border-t border-gray-100 pt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-gray-500 hover:text-gray-900 font-bold py-2 disabled:opacity-0 transition-opacity"
          >
            &larr; Back
          </button>
          <button
            onClick={handleNext}
            disabled={selectedValue === undefined}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-bold py-3 px-10 rounded-full shadow-sm transition-all"
          >
            {currentStep === questions.length - 1 ? 'Find Matches!' : 'Next'}
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Quiz;
