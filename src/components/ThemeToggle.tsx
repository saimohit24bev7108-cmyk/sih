import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { tapScale } from '@/lib/motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={tapScale}
      aria-label="Toggle dark mode"
      className="relative w-14 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center px-1 transition-colors duration-250"
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-md"
        animate={{ x: theme === 'dark' ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {theme === 'dark' ? (
          <Moon size={14} className="text-blue-300" />
        ) : (
          <Sun size={14} className="text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
}
