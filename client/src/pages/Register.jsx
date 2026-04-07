import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'adopter' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      login(res.data, res.data.token);
      toast.success('Account created successfully!');
      
      if (res.data.role === 'shelter-admin') {
        navigate('/dashboard/shelter');
      } else {
        navigate('/pets');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create Account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Log in</Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" required value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input type="email" required value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" required value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">I am a...</legend>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="role" value="adopter" checked={formData.role==='adopter'} onChange={(e)=>setFormData({...formData, role: 'adopter'})} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer" />
                  <span className="ml-2 text-sm text-gray-700">Adopter</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="role" value="shelter-admin" checked={formData.role==='shelter-admin'} onChange={(e)=>setFormData({...formData, role: 'shelter-admin'})} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer" />
                  <span className="ml-2 text-sm text-gray-700">Shelter Admin</span>
                </label>
              </div>
            </fieldset>

            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors">
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
