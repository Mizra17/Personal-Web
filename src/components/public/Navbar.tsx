import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  Menu,
  X,
  Code2,
  Send,
  Lock,
  WifiOff,
  User,
  LogIn,
  LogOut,
  LayoutDashboard,
  Home,
  FolderGit2,
  Cpu,
  Workflow,
  Calculator,
  Mail,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { AnimatedButton } from '../common/AnimatedSection';
import { MagneticElement } from '../common/MagneticElement';

export const Navbar: React.FC = () => {
  const {
    settings,
    currentUser,
    userLogout,
    setShowAuthModal,
    requestQuote,
    isOnline
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: 'Inicio', path: '/', icon: Home, desc: 'Vista principal' },
    { name: 'Sobre Mí', path: '/sobre-mi', icon: User, desc: 'Perfil & Trayectoria' },
    { name: 'Servicios', path: '/servicios', icon: Sparkles, desc: 'Soluciones Web' },
    { name: 'Portafolio', path: '/portafolio', icon: FolderGit2, desc: 'Proyectos & Casos' },
    { name: 'Tecnologías', path: '/tecnologias', icon: Cpu, desc: 'Tech Stack & Dev' },
    { name: 'Proceso', path: '/proceso', icon: Workflow, desc: 'Metodología Agile' },
    { name: 'Calculadora', path: '/calculadora', icon: Calculator, desc: 'Cotización Online' },
    { name: 'Contacto', path: '/contacto', icon: Mail, desc: 'Escríbeme un mensaje' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-close menu on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isLinkActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/inicio';
    }
    return location.pathname === path;
  };

  const handleQuoteClick = () => {
    requestQuote();
    navigate('/calculadora');
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-500 ${
        scrolled
          ? 'bg-[#09090b]/90 backdrop-blur-2xl border-b border-zinc-800/80 shadow-[0_12px_32px_rgba(0,0,0,0.6)] py-0.5'
          : 'bg-gradient-to-b from-[#09090b]/95 via-[#09090b]/80 to-transparent backdrop-blur-md border-b border-zinc-800/30 py-2'
      }`}
    >
      {/* Top Ambient Backlight Glow matching Footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-16 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none -z-10" />
      <div className="absolute top-0 right-1/4 w-72 h-12 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none -z-10" />

      {!isOnline && (
        <div className="bg-amber-500/90 text-zinc-950 text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2 backdrop-blur-md">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Modo Sin Conexión (PWA activa) — Navegación básica en caché.</span>
        </div>
      )}

      <div className={`w-full px-4 sm:px-6 lg:px-10 xl:px-12 flex items-center justify-between gap-4 transition-all duration-300 ${
        scrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
      }`}>
        {/* Brand Logo */}
        <MagneticElement>
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.06, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-blue-600/25 group-hover:shadow-blue-500/40 transition-all duration-300"
            >
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-blue-400 font-bold text-lg">
                <Code2 className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </motion.div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5 group-hover:text-blue-300 transition-colors">
                {settings.branding.logoText || settings.developerName}
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" title="Disponible para proyectos"></span>
              </span>
              <span className="text-[10px] text-blue-400/90 font-mono font-medium tracking-wide uppercase">
                Dev & Software Engineer
              </span>
            </div>
          </Link>
        </MagneticElement>

        {/* Desktop Navigation Links with Animated Pill */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-zinc-900/60 p-1.5 rounded-2xl border border-zinc-800/80 backdrop-blur-xl shadow-inner shadow-black/40">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-3 py-1.5 text-xs xl:text-sm font-medium rounded-xl transition-all duration-300 ${
                  active
                    ? 'text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="navbarActivePill"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-[0_0_14px_rgba(37,99,235,0.45)] border border-blue-400/30 z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Unified Authentication & User Portal Controls */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              {currentUser.role === 'admin' ? (
                <MagneticElement>
                  <AnimatedButton
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 border border-blue-400/30"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Panel Admin</span>
                  </AnimatedButton>
                </MagneticElement>
              ) : (
                <MagneticElement>
                  <AnimatedButton
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 border border-blue-400/30"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Mi Panel</span>
                  </AnimatedButton>
                </MagneticElement>
              )}

              <button
                onClick={userLogout}
                className="p-2 rounded-xl bg-zinc-900/80 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors border border-zinc-800 hover:border-zinc-700"
                title="Cerrar Sesión"
                aria-label="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <MagneticElement>
              <AnimatedButton
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-bold border border-zinc-800/90 hover:border-zinc-700 shadow-sm transition-all"
                title="Iniciar Sesión"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span>Iniciar Sesión</span>
              </AnimatedButton>
            </MagneticElement>
          )}

          {/* Quote Button CTA */}
          <MagneticElement className="hidden sm:inline-block">
            <AnimatedButton
              onClick={handleQuoteClick}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:brightness-110 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Cotizar Proyecto</span>
            </AnimatedButton>
          </MagneticElement>

          {/* Mobile Menu Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2.5 rounded-xl border transition-all duration-300 relative overflow-hidden ${
              mobileMenuOpen
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                : 'bg-zinc-900/90 text-zinc-300 hover:bg-zinc-800 hover:text-white border-zinc-800'
            }`}
            aria-label="Abrir Menú"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Glassmorphic Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden border-b border-zinc-800/80 bg-[#09090b]/96 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative z-50"
          >
            {/* Ambient inner glow accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-4 relative z-10">
              {/* Header Status inside Menu */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse" />
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Navegación
                  </span>
                </div>
                <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded-full">
                  Disponible
                </span>
              </div>

              {/* Grid of Navigation Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {navLinks.map((link, idx) => {
                  const active = isLinkActive(link.path);
                  const IconComponent = link.icon;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.025 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group relative flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 overflow-hidden ${
                          active
                            ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white border-blue-400/40 shadow-lg shadow-blue-600/25'
                            : 'bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-300 hover:text-white border-zinc-800/80 hover:border-zinc-700/80 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3 relative z-10 min-w-0">
                          <div
                            className={`p-2 rounded-xl transition-all duration-300 ${
                              active
                                ? 'bg-white/20 text-white'
                                : 'bg-zinc-800/90 text-blue-400 group-hover:bg-blue-600/20 group-hover:text-blue-300 group-hover:scale-110'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span
                              className={`text-sm font-semibold truncate ${
                                active ? 'text-white' : 'text-zinc-200 group-hover:text-white'
                              }`}
                            >
                              {link.name}
                            </span>
                            <span
                              className={`text-[11px] truncate ${
                                active ? 'text-blue-100/80' : 'text-zinc-500 group-hover:text-zinc-400'
                              }`}
                            >
                              {link.desc}
                            </span>
                          </div>
                        </div>

                        <div className="relative z-10 ml-2 shrink-0">
                          <ChevronRight
                            className={`w-4 h-4 transition-transform duration-300 ${
                              active
                                ? 'text-white translate-x-0.5'
                                : 'text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-1'
                            }`}
                          />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom Actions Bar */}
              <div className="pt-2 border-t border-zinc-800/60 flex flex-col sm:flex-row gap-2.5">
                {currentUser ? (
                  <div className="flex items-center gap-2 w-full">
                    <button
                      onClick={() => {
                        navigate(currentUser.role === 'admin' ? '/admin' : '/dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs shadow-md shadow-blue-600/25 border border-blue-400/30"
                    >
                      {currentUser.role === 'admin' ? (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Panel Admin</span>
                        </>
                      ) : (
                        <>
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Mi Portal</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        userLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 border border-zinc-800 transition-colors"
                      title="Cerrar Sesión"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-xs border border-zinc-800 transition-all"
                  >
                    <LogIn className="w-4 h-4 text-blue-400" />
                    <span>Iniciar Sesión</span>
                  </button>
                )}

                <AnimatedButton
                  onClick={() => {
                    handleQuoteClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Cotizar Proyecto</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </AnimatedButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

