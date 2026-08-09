import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { isReducedMotion, EASINGS } from '../../lib/animations';

// 1. Reusable Animated Section Wrapper with variant types
export type AnimationVariant = 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'zoomIn' | 'scaleIn';

interface AnimatedSectionProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  className?: string;
  delay?: number;
  id?: string;
}

const sectionVariants: Record<AnimationVariant, { hidden: any; visible: any }> = {
  fadeUp: {
    hidden: { opacity: 0, y: isReducedMotion ? 0 : 40 },
    visible: { opacity: 1, y: 0 }
  },
  fadeLeft: {
    hidden: { opacity: 0, x: isReducedMotion ? 0 : -50 },
    visible: { opacity: 1, x: 0 }
  },
  fadeRight: {
    hidden: { opacity: 0, x: isReducedMotion ? 0 : 50 },
    visible: { opacity: 1, x: 0 }
  },
  zoomIn: {
    hidden: { opacity: 0, scale: isReducedMotion ? 1 : 0.92 },
    visible: { opacity: 1, scale: 1 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: isReducedMotion ? 1 : 0.95, y: isReducedMotion ? 0 : 25 },
    visible: { opacity: 1, scale: 1, y: 0 }
  }
};

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  variant = 'fadeUp',
  className = '',
  delay = 0,
  id
}) => {
  return (
    <motion.div
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: isReducedMotion ? 0.2 : 0.7,
        delay: isReducedMotion ? 0 : delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      variants={sectionVariants[variant]}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 2. Title Animation with Scale, Rise, and Word-by-Word Staggered Reveal
export const AnimatedTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  if (typeof children === 'string') {
    const words = children.split(' ');
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: isReducedMotion ? 0 : 0.05,
              delayChildren: isReducedMotion ? 0 : delay
            }
          }
        }}
        className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: isReducedMotion ? 0 : 20, filter: 'blur(8px)' },
              visible: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] }
              }
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: isReducedMotion ? 0 : 25, scale: isReducedMotion ? 1 : 0.96, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: isReducedMotion ? 0.2 : 0.65,
        delay: isReducedMotion ? 0 : delay,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 3. Stagger Containers and Items for Cards and Grids
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
}> = ({ children, className = '', staggerDelay = 0.1, delay = 0 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: isReducedMotion ? 0 : staggerDelay,
            delayChildren: isReducedMotion ? 0 : delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'up' | 'scale' | 'slideRight';
}> = ({ children, className = '', variant = 'up' }) => {
  const variantsMap = {
    up: {
      hidden: { opacity: 0, y: isReducedMotion ? 0 : 30 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1.0] }
      }
    },
    scale: {
      hidden: { opacity: 0, scale: isReducedMotion ? 1 : 0.92, y: isReducedMotion ? 0 : 15 },
      show: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' }
      }
    },
    slideRight: {
      hidden: { opacity: 0, x: isReducedMotion ? 0 : -25 },
      show: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: 'easeOut' }
      }
    }
  };

  return (
    <motion.div variants={variantsMap[variant]} className={className}>
      {children}
    </motion.div>
  );
};

// 4. Interactive Card with Elevation and Border Glow on Hover
export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverScale?: number;
  hoverY?: number;
}> = ({ children, className = '', onClick, hoverScale = 1.015, hoverY = -5 }) => {
  return (
    <motion.div
      whileHover={
        isReducedMotion
          ? {}
          : {
              y: hoverY,
              scale: hoverScale,
              boxShadow: '0 20px 35px -10px rgba(37, 99, 235, 0.15)',
              transition: { duration: 0.25, ease: 'easeOut' }
            }
      }
      whileTap={isReducedMotion ? {} : { scale: 0.985 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 5. Interactive Button with Hover & Tap Feedback
export const AnimatedButton: React.FC<{
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  title?: string;
}> = ({ children, onClick, className = '', type = 'button', disabled = false, title }) => {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      whileHover={
        isReducedMotion || disabled
          ? {}
          : {
              scale: 1.03,
              boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.35)',
              transition: { duration: 0.2, ease: 'easeOut' }
            }
      }
      whileTap={isReducedMotion || disabled ? {} : { scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// 6. Number Counter Animation (counts from 0 to target when in view)
export const AnimatedCounter: React.FC<{
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}> = ({ target, prefix = '', suffix = '', duration = 1.8, className = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease out cubic function
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

// 7. Progress Bar Animation
export const AnimatedProgressBar: React.FC<{
  percentage: number;
  colorClass?: string;
  className?: string;
}> = ({ percentage, colorClass = 'bg-gradient-to-r from-blue-600 to-cyan-400', className = '' }) => {
  return (
    <div className={`w-full bg-zinc-800/80 rounded-full h-2.5 overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: '0%' }}
        whileInView={{ width: `${percentage}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className={`h-full rounded-full ${colorClass}`}
      />
    </div>
  );
};

// 8. Animated Icon with Spring Bounce & Rotate
export const AnimatedIcon: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
      whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 18,
        delay: 0.1
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 9. Image Reveal Animation with Zoom-Out Effect
export const AnimatedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}> = ({ src, alt, className = '', imgClassName = '' }) => {
  return (
    <div className={`overflow-hidden relative ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 1.1, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`w-full h-full object-cover ${imgClassName}`}
        loading="lazy"
      />
    </div>
  );
};

// 10. Floating Parallax Element (Slight Y Float on scroll / hover)
export const ParallaxFloating: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}> = ({ children, className = '', intensity = 10 }) => {
  return (
    <motion.div
      animate={{
        y: [0, -intensity, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
