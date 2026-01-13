/**
 * Durées d'animation standard (en secondes)
 */
export const DURATION = {
  FAST: 0.15,
  NORMAL: 0.3,
  SLOW: 0.5,
} as const;

/**
 * Easing functions pour Framer Motion
 */
export const EASING = {
  EASE_IN_OUT: [0.4, 0, 0.2, 1],
  EASE_OUT: [0, 0, 0.2, 1],
  EASE_IN: [0.4, 0, 1, 1],
  SPRING: { type: "spring", stiffness: 300, damping: 30 },
} as const;

/**
 * Variants Framer Motion réutilisables
 */
export const FADE_IN_VARIANT = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.NORMAL } },
};

export const SLIDE_UP_VARIANT = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.NORMAL, ease: EASING.EASE_OUT },
  },
};

export const SCALE_VARIANT = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.FAST, ease: EASING.EASE_OUT },
  },
};
