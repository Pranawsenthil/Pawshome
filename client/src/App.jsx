import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import PetGallery from './pages/PetGallery';
import PetDetail from './pages/PetDetail';
import Quiz from './pages/Quiz';
import Apply from './pages/Apply';
import UserDashboard from './pages/UserDashboard';
import ShelterDashboard from './pages/ShelterDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<PetGallery />} />
            <Route path="/pets/:id" element={<PetDetail />} />
            <Route path="/quiz" element={<Quiz />} />
            
            <Route path="/apply/:petId" element={
              <ProtectedRoute requiredRole="adopter">
                <Apply />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/user" element={
              <ProtectedRoute requiredRole="adopter">
                <UserDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/shelter" element={
              <ProtectedRoute requiredRole="shelter-admin">
                <ShelterDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
