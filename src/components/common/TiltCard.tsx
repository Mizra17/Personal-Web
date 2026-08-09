import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { usePerformanceTier } from '../../lib/performance';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees (default 8)
  glareOpacity?: number;
  onClick?: () => void;
  id?: string;
  showGlassSweep?: boolean;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 8,
  glareOpacity = 0.2,
  onClick,
  id,
  showGlassSweep = true
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const { enableTilt } = usePerformanceTier();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [sweepKey, setSweepKey] = useState(0);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setSweepKey(prev => prev + 1);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = Math.max(0, Math.min(1, mouseX / width));
    const yPct = Math.max(0, Math.min(1, mouseY / height));

    const rotateX = (0.5 - yPct) * (maxTilt * 2);
    const rotateY = (xPct - 0.5) * (maxTilt * 2);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      setTilt({ rotateX, rotateY });
      setGlare({ x: xPct * 100, y: yPct * 100, opacity: glareOpacity });
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!enableTilt) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTilt({ rotateX: 0, rotateY: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  // Dynamic rim border shadow based on glare position
  const rimX = glare.x - 50;
  const rimY = glare.y - 50;
  const borderGlow = isHovered
    ? `${rimX * 0.3}px ${rimY * 0.3}px 30px rgba(59, 130, 246, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.25)`
    : '0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)';

  return (
    <div className="perspective-1000" style={{ perspective: '1200px' }}>
      <motion.div
        id={id}
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transformStyle: 'preserve-3d'
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 22, mass: 0.6 }}
        whileHover={{ scale: 1.018 }}
        whileTap={{ scale: 0.985 }}
        style={{
          boxShadow: borderGlow,
          willChange: 'transform, box-shadow'
        }}
        className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#121217]/90 backdrop-blur-2xl transition-all duration-300 ${className}`}
        data-tilt
      >
        {children}

        {/* Glass Reflection Beam / Sweep line on hover */}
        {showGlassSweep && isHovered && (
          <div
            key={sweepKey}
            className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
          >
            <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-[25deg] animate-glass-sweep" />
          </div>
        )}

        {/* Dynamic Specular Glass Glare Reflection following cursor */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out z-20"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle 280px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.3) 0%, rgba(59, 130, 246, 0.15) 35%, transparent 70%)`
          }}
        />

        {/* Subdued ambient rim sheen */}
        <div className={`pointer-events-none absolute inset-0 rounded-3xl border border-white/10 transition-opacity duration-300 ${isHovered ? 'opacity-100 border-blue-400/40' : 'opacity-0'}`} />
      </motion.div>
    </div>
  );
};

