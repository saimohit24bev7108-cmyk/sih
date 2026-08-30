import { motion, useReducedMotion } from 'framer-motion';
import { Home as HomeIcon } from 'lucide-react';

const LINKS = ['Privacy', 'Terms', 'Contact'] as const;

export function Footer() {
  const reduceMotion = useReducedMotion();
  const hoverScale = reduceMotion ? undefined : { scale: 1.05 };
  const tapScale = reduceMotion ? undefined : { scale: 0.97 };

  return (
    <footer className="bg-blue-900 dark:bg-gray-950 text-white py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <HomeIcon size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold">FixFlow</span>
        </div>
        <p className="text-sm text-blue-200 dark:text-blue-100">&copy; 2026 FixFlow — Cooperative Gig Services Platform. SIH26089.</p>
        <div className="flex gap-4 text-sm text-blue-200 dark:text-blue-100">
          {LINKS.map((label) => (
            <motion.span
              key={label}
              className="hover:text-white cursor-pointer inline-block transition-colors"
              whileHover={hoverScale}
              whileTap={tapScale}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.span>
          ))}
        </div>
      </div>
    </footer>
  );
}
