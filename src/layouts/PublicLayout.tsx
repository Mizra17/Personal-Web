import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CustomCursor } from '../components/common/CustomCursor';
import { CinematicPreloader } from '../components/common/CinematicPreloader';
import { AmbientBackground } from '../components/common/AmbientBackground';
import { ScrollToTop } from '../components/common/ScrollToTop';
import { PageLoader } from '../components/common/PageLoader';
import { Navbar } from '../components/public/Navbar';
import { Footer } from '../components/public/Footer';
import { WhatsAppButton } from '../components/public/WhatsAppButton';
import { AuthModal } from '../components/auth/AuthModal';

export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const currentOutlet = useOutlet();
  const [isNavigating, setIsNavigating] = useState(false);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setIsNavigating(true);

      window.scrollTo(0, 0);

      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      <CustomCursor />
      <CinematicPreloader />
      <AmbientBackground />
      <ScrollToTop />

      {/* Navigation PageLoader overlay */}
      <AnimatePresence>
        {isNavigating && (
          <PageLoader key="route-loader" message="Cargando página..." fullScreen={true} />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="w-full"
            >
              <Suspense fallback={<PageLoader message="Cargando vista..." fullScreen={false} />}>
                {currentOutlet}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <WhatsAppButton />
        <AuthModal />
      </div>
    </div>
  );
};
