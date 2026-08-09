import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface MagneticElementProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // Distance modifier for magnetic pull (default 0.2)
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const MagneticElement: React.FC<MagneticElementProps> = ({
  children,
  className = '',
  strength = 0.22,
  onClick
}) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!elementRef.current) return;
    const { left, top, width, height } = elementRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={elementRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.5 }}
      className={`inline-block cursor-pointer ${className}`}
      data-cursor="pointer"
    >
      {children}
    </motion.div>
  );
};
