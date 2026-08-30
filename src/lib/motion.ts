import { useReducedMotion } from 'framer-motion';

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const reducedPageTransition = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: 0 },
  transition: { duration: 0 },
};

export const tapScale = { scale: 0.97 };
export const hoverLift = { scale: 1.02 };

export const cardContainerStagger = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export function getAdaptiveStagger(itemCount: number) {
  const maxTotalDuration = 0.4;
  const baseDelay = 0.05;
  const cappedDelay =
    itemCount > 8 ? Math.min(baseDelay, maxTotalDuration / itemCount) : baseDelay;

  return {
    animate: {
      transition: {
        staggerChildren: cappedDelay,
      },
    },
  };
}

export const cardItemFade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: 'easeOut' },
};

export function usePageTransition() {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedPageTransition : pageTransition;
}
