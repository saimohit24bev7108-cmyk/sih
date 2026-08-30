import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { usePageTransition } from '@/lib/motion';

export function PageWrapper({ children }: { children: ReactNode }) {
  const transition = usePageTransition();

  return (
    <motion.div
      initial={transition.initial}
      animate={transition.animate}
      exit={transition.exit}
      transition={transition.transition}
    >
      {children}
    </motion.div>
  );
}
