// Shared animation constants - use these everywhere, never hardcode values

export const DURATION = {
  fast: 0.15,
  normal: 0.2,
  slow: 0.4,
} as const;

export const EASE = {
  default: "easeOut",
  spring: { type: "spring", stiffness: 400, damping: 30 },
  springGentle: { type: "spring", stiffness: 250, damping: 25 },
} as const;

export const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.normal, ease: EASE.default },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE.default },
  },
};

export const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const buttonHover = { scale: 1.02 };
export const buttonTap = { scale: 0.97 };
export const buttonTransition = { duration: DURATION.fast };

export const fadeVariants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1, transition: { duration: DURATION.normal } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: DURATION.fast } },
};

export const slideInVariants = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0, transition: { duration: DURATION.normal, ease: EASE.default } },
  exit: { opacity: 0, x: -16, transition: { duration: DURATION.fast } },
};
