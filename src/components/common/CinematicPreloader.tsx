import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { usePerformanceTier } from '../../lib/performance';

interface CinematicPreloaderProps {
  onComplete?: () => void;
}

export const CinematicPreloader: React.FC<CinematicPreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const { fps, tier } = usePerformanceTier();
  const [loadingText, setLoadingText] = useState('Iniciando entorno adaptativo...');

  useEffect(() => {
    const textPhases = [
      'Iniciando entorno adaptativo de alto rendimiento...',
      'Cargando arquitectura de datos & Supabase...',
      `Calibrando tasa de refresco a ${fps} Hz (${tier.toUpperCase()})...`,
      'Sincronizando experiencia inmersiva...'
    ];

    let currentPhaseIndex = 0;
    const textInterval = setInterval(() => {
      currentPhaseIndex = (currentPhaseIndex + 1) % textPhases.length;
      setLoadingText(textPhases[currentPhaseIndex]);
    }, 450);

    const startTime = Date.now();
    const duration = 1800; // 1.8 seconds total preloader sequence

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(Math.floor((elapsed / duration) * 100), 100);

      setProgress(currentProgress);

      if (currentProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        clearInterval(textInterval);
        setTimeout(() => {
          setIsFinished(true);
          if (onComplete) onComplete();
        }, 200);
      }
    };

    const animId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(textInterval);
    };
  }, [onComplete, fps, tier]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] bg-[#09090b] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Ambient Radial Lights */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/15 rounded-full blur-[100px]" />

          {/* Grid Background */}
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

          {/* Center Monogram Logo with High Tech Rings */}
          <div className="relative z-10 flex flex-col items-center space-y-8 max-w-sm w-full text-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Spinning Outer Orbit Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-3xl border border-dashed border-blue-500/40"
              />
              {/* Counter Spinning Inner Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-2 rounded-2xl border border-indigo-400/30"
              />

              {/* Glowing Center Emblem */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-[0_0_35px_rgba(37,99,235,0.6)] text-white">
                <Code2 className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono tracking-widest uppercase">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>MIZRAHIM WEB • PORTAFOLIO PREMIUM</span>
              </div>

              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Estudio de Desarrollo Web & Software
              </h2>
            </div>

            {/* Progress Bar & Status Text */}
            <div className="w-full space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="text-zinc-500 flex items-center gap-1.5 truncate max-w-[240px]">
                  <Zap className="w-3.5 h-3.5 text-blue-400 animate-bounce flex-shrink-0" />
                  <span className="truncate">{loadingText}</span>
                </span>
                <span className="text-blue-400 font-bold ml-2">{progress}%</span>
              </div>

              {/* Glass Progress Track */}
              <div className="w-full h-1.5 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden p-0.5 relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-full shadow-[0_0_12px_#3b82f6]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 pt-4">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Optimizando experiencia adaptativa a {fps} Hz ({tier.toUpperCase()})</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
