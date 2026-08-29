import { useNavigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const scrollToServices = () => {
    if (location.pathname === '/') {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
      <button onClick={() => navigate('/')} className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
          <HomeIcon size={24} className="text-white" />
        </div>
        <div className="text-left leading-tight">
          <span className="text-xl font-bold text-blue-900">FixFlow</span>
          <p className="text-[10px] text-gray-500 font-medium">Your Home Services Team!</p>
        </div>
      </button>

      <div className="hidden md:flex items-center gap-8">
        <button onClick={() => navigate('/')} className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-800 hover:text-blue-600'}`}>
          Home
        </button>
        <button onClick={scrollToServices} className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">
          Services
        </button>
        <button onClick={() => navigate('/about-us')} className={`text-sm font-medium transition-colors ${isActive('/about-us') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-800 hover:text-blue-600'}`}>
        About Us
        </button>
        <button onClick={() => navigate('/safety')} className={`text-sm font-medium transition-colors ${isActive('/safety') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-800 hover:text-blue-600'}`}>
         Safety
        </button>
        <button onClick={() => navigate('/faq')} className={`text-sm font-medium transition-colors ${isActive('/faq') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-800 hover:text-blue-600'}`}>
          FAQs
        </button>
        <button className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">
          Contact Us
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-lg border border-blue-200 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Register
        </button>
      </div>
    </nav>
  );
}