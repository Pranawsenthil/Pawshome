import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <span className="text-8xl mb-6 block">🐕</span>
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-8">Oops! This page ran away...</h2>
      <Link to="/" className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3.5 px-10 rounded-full shadow-md transition-colors text-lg">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
