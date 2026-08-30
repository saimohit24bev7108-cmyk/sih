import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { tapScale, hoverLift } from '@/lib/motion';

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
      }, 250);
    }
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50">
      <motion.button whileTap={tapScale} whileHover={hoverLift} onClick={() => navigate('/')} className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
          <HomeIcon size={24} className="text-white" />
        </div>
        <div className="text-left leading-tight">
          <span className="text-xl font-bold text-blue-900 dark:text-white">FixFlow</span>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Your Home Services Team!</p>
        </div>
      </motion.button>

      <div className="hidden md:flex items-center gap-8">
        <motion.button whileTap={tapScale} whileHover={hoverLift} onClick={() => navigate('/')} className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'}`}>
          Home
        </motion.button>
        <motion.button whileTap={tapScale} whileHover={hoverLift} onClick={scrollToServices} className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Services
        </motion.button>
        <motion.button whileTap={tapScale} whileHover={hoverLift} onClick={() => navigate('/about-us')} className={`text-sm font-medium transition-colors ${isActive('/about-us') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'}`}>
        About Us
        </motion.button>
        <motion.button whileTap={tapScale} whileHover={hoverLift} onClick={() => navigate('/safety')} className={`text-sm font-medium transition-colors ${isActive('/safety') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'}`}>
         Safety
        </motion.button>
        <motion.button whileTap={tapScale} whileHover={hoverLift} onClick={() => navigate('/faq')} className={`text-sm font-medium transition-colors ${isActive('/faq') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'}`}>
          FAQs
        </motion.button>
        <motion.button whileTap={tapScale} whileHover={hoverLift} className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Contact Us
        </motion.button>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <motion.button
          whileTap={tapScale}
          whileHover={hoverLift}
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-lg border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-300 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          Login
        </motion.button>
        <motion.button
          whileTap={tapScale}
          whileHover={hoverLift}
          onClick={() => navigate('/register')}
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Register
        </motion.button>
      </div>
    </nav>
  );
}