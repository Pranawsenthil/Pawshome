import { useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const steps = ['Personal Info', 'Home Assessment', 'Reference Check', 'Review & Submit'];

const Apply = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    occupation: '',
    address: '',
    homeType: '',
    ownOrRent: '',
    hasYard: false,
    hasOtherPets: false,
    hasChildren: false,
    referenceName: '',
    referencePhone: '',
    vetName: ''
  });

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.fullName || !formData.phone || !formData.occupation || !formData.address) {
        return toast.error('Please fill in all personal info fields');
      }
    }
    if (currentStep === 1) {
      if (!formData.homeType || !formData.ownOrRent) {
        return toast.error('Please select your home type and ownership status');
      }
    }
    if (currentStep === 2) {
      if (!formData.referenceName || !formData.referencePhone) {
        return toast.error('Please provide a reference');
      }
      if (formData.hasOtherPets && !formData.vetName) {
        return toast.error('Please provide your vet name since you have other pets');
      }
    }
    
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/applications', {
        petId,
        answers: formData
      });
      setIsSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="h-32 w-32 bg-green-100 rounded-full flex items-center justify-center mb-8"
        >
          <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Application Submitted! 🎉</h1>
        <p className="text-xl text-gray-600 mb-10 text-center max-w-xl">
          We'll email you updates as your application progresses. Thank you for your interest in giving a pet a forever home!
        </p>
        <Link 
          to="/dashboard/user"
          className="bg-indigo-600 text-white font-bold py-3.5 px-10 rounded-full shadow-md hover:bg-indigo-700 transition"
        >
          View My Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">Adoption Application</h1>
      
      {/* Stepper */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative max-w-3xl mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-orange-500 z-0 transition-all duration-500"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
          
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
               <div key={idx} className="relative z-10 flex flex-col items-center">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors ${
                   isCompleted ? 'bg-orange-500 border-orange-500 text-white' :
                   isCurrent ? 'bg-white border-orange-500 text-orange-500' :
                   'bg-white border-gray-300 text-gray-400'
                 }`}>
                   {isCompleted ? '✓' : idx + 1}
                 </div>
                 <span className={`absolute top-12 text-xs font-bold whitespace-nowrap hidden sm:block ${
                   isCurrent || isCompleted ? 'text-gray-900' : 'text-gray-400'
                 }`}>
                   {step}
                 </span>
               </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-10 min-h-[400px] flex flex-col max-w-3xl mx-auto">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 pb-4 border-b border-gray-100">{steps[currentStep]}</h2>
        
        <div className="flex-grow">
          {currentStep === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Occupation</label>
                <input type="text" value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Current Address</label>
                <textarea rows="3" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"></textarea>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Home Type</label>
                <div className="flex gap-6">
                  {['Apartment', 'House', 'Farm'].map(type => (
                    <label key={type} className="flex items-center cursor-pointer">
                      <input type="radio" value={type} checked={formData.homeType === type} onChange={e => setFormData({...formData, homeType: e.target.value})} className="text-orange-500 focus:ring-orange-500 mr-2 h-4 w-4 border-gray-300 cursor-pointer" /> {type}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 mt-8">Own or Rent?</label>
                <div className="flex gap-6">
                  {['Own', 'Rent'].map(val => (
                    <label key={val} className="flex items-center cursor-pointer">
                      <input type="radio" value={val} checked={formData.ownOrRent === val} onChange={e => setFormData({...formData, ownOrRent: e.target.value})} className="text-orange-500 focus:ring-orange-500 mr-2 h-4 w-4 border-gray-300 cursor-pointer" /> {val}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-4">
                <span className="text-sm font-bold text-gray-700">Do you have a yard?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.hasYard} onChange={(e) => setFormData({...formData, hasYard: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm font-bold text-gray-700">Do you have other pets?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.hasOtherPets} onChange={(e) => setFormData({...formData, hasOtherPets: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm font-bold text-gray-700">Do you have children at home?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.hasChildren} onChange={(e) => setFormData({...formData, hasChildren: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Reference Name</label>
                <input type="text" value={formData.referenceName} onChange={e => setFormData({...formData, referenceName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Reference Phone</label>
                <input type="tel" value={formData.referencePhone} onChange={e => setFormData({...formData, referencePhone: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
              </div>
              
              {formData.hasOtherPets && (
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1 mt-8">Veterinarian Name (Required for current pet owners)</label>
                   <input type="text" value={formData.vetName} onChange={e => setFormData({...formData, vetName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
                 </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-sm">
               <h3 className="font-extrabold text-lg mb-6 text-gray-900 border-b pb-3">Final Application Summary</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                 <div>
                   <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Full Name</p>
                   <p className="font-semibold text-gray-900">{formData.fullName}</p>
                 </div>
                 <div>
                   <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Phone Number</p>
                   <p className="font-semibold text-gray-900">{formData.phone}</p>
                 </div>
                 <div className="sm:col-span-2">
                   <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Occupation & Address</p>
                   <p className="font-semibold text-gray-900">{formData.occupation}</p>
                   <p className="font-semibold text-gray-900 mt-1">{formData.address}</p>
                 </div>
                 <div>
                   <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Home Specifications</p>
                   <p className="font-semibold text-gray-900">{formData.homeType} ({formData.ownOrRent})</p>
                 </div>
                 <div>
                   <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Yard / Children / Pets</p>
                   <p className="font-semibold text-gray-900">
                     {formData.hasYard ? 'Has Yard' : 'No Yard'} &bull; {formData.hasChildren ? 'Has Children' : 'No Children'} &bull; {formData.hasOtherPets ? 'Has Pets' : 'No Pets'}
                   </p>
                 </div>
                 <div className="border-t border-gray-200 pt-4 mt-2 sm:col-span-2">
                   <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Reference Checks</p>
                   <p className="font-semibold text-gray-900">{formData.referenceName} • {formData.referencePhone}</p>
                   {formData.vetName && <p className="font-semibold text-gray-900 mt-1">Vet: {formData.vetName}</p>}
                 </div>
               </div>
             </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
          <button 
            onClick={handleBack} 
            disabled={currentStep === 0 || isSubmitting}
            className="text-gray-400 font-bold hover:text-gray-900 transition disabled:opacity-0 disabled:pointer-events-none"
          >
            &larr; Back
          </button>

          {currentStep === 3 ? (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3.5 px-10 rounded-full shadow-md transition disabled:bg-orange-300 flex items-center"
            >
              {isSubmitting ? 'Summitting...' : 'Submit Application'}
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 px-10 rounded-full shadow-md transition"
            >
              Next Step
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Apply;
