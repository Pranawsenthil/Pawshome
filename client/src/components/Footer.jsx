import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-8 gap-6 text-center sm:text-left">
          
          <div>
            <h3 className="text-xl font-extrabold text-white mb-2">🐾 PawsHome</h3>
            <p className="text-gray-400 font-medium">Find Your Forever Friend</p>
          </div>
          
          <div className="flex flex-wrap justify-center sm:justify-end gap-x-8 gap-y-2 font-medium">
            <Link to="/pets" className="hover:text-white transition-colors">Browse Pets</Link>
            <Link to="/quiz" className="hover:text-white transition-colors">Take the Quiz</Link>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          </div>
          
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-sm font-medium text-gray-500">
          <p>© 2026 PawsHome. Built with ❤️ for rescued animals.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
