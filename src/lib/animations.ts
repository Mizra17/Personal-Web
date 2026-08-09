// Unified Animation Presets for Production Quality
export const isReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

// Standard Easing Curves & Durations
export const EASINGS = {
  smooth: [0.16, 1, 0.3, 1] as const,
  outCubic: [0.33, 1, 0.68, 1] as const,
  easeInOut: [0.65, 0, 0.35, 1] as const,
  spring: { type: 'spring', stiffness: 350, damping: 28 } as const,
  gentleSpring: { type: 'spring', stiffness: 220, damping: 22 } as const
};

export const DURATIONS = {
  fast: isReducedMotion ? 0.1 : 0.2,
  normal: isReducedMotion ? 0.15 : 0.35,
  slow: isReducedMotion ? 0.2 : 0.6,
  page: isReducedMotion ? 0.15 : 0.5
};

// Motion Variants
export const fadeInVariants = {
  hidden: { opacity: 0, y: isReducedMotion ? 0 : 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.smooth
    }
  }
};

export const modalVariants = {
  hidden: { opacity: 0, scale: isReducedMotion ? 1 : 0.95, y: isReducedMotion ? 0 : 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: DURATIONS.fast,
      ease: EASINGS.smooth
    }
  },
  exit: {
    opacity: 0,
    scale: isReducedMotion ? 1 : 0.95,
    y: isReducedMotion ? 0 : 10,
    transition: {
      duration: DURATIONS.fast,
      ease: EASINGS.outCubic
    }
  }
};

export const hoverScaleProps = {
  whileHover: isReducedMotion ? {} : { scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } },
  whileTap: isReducedMotion ? {} : { scale: 0.98 }
};

export const hoverCardProps = {
  whileHover: isReducedMotion
    ? {}
    : {
        y: -4,
        scale: 1.01,
        transition: { duration: 0.25, ease: EASINGS.smooth }
      },
  whileTap: isReducedMotion ? {} : { scale: 0.99 }
};
