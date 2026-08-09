import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Cargando...',
  fullScreen = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`${
        fullScreen ? 'fixed inset-0 z-50 min-h-screen' : 'w-full py-20 min-h-[320px]'
      } bg-[#09090b]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden`}
    >
      {/* Background Glow Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Custom Loader graphic element */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <div className="py-2">
          <span className="loader"></span>
        </div>

        {/* Message Pill */}
        {message && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-mono font-medium text-zinc-300 backdrop-blur-md shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>{message}</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
