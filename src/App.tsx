import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { PublicLayout } from './layouts/PublicLayout';
import { AuthModal } from './components/auth/AuthModal';
import { PageLoader } from './components/common/PageLoader';
import { ShieldAlert, LogIn, Lock } from 'lucide-react';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage').then(m => ({ default: m.PortfolioPage })));
const TechStackPage = lazy(() => import('./pages/TechStackPage').then(m => ({ default: m.TechStackPage })));
const ProcessPage = lazy(() => import('./pages/ProcessPage').then(m => ({ default: m.ProcessPage })));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage').then(m => ({ default: m.CalculatorPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));

const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const ClientDashboardView = lazy(() => import('./components/client/ClientDashboardView').then(m => ({ default: m.ClientDashboardView })));

const AdminGuard: React.FC = () => {
  const { currentUser, setShowAuthModal } = useApp();
  const navigate = useNavigate();
  const isUserAdmin = currentUser && currentUser.role === 'admin';

  if (!isUserAdmin) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 text-center font-sans space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-2xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl font-extrabold text-white">Acceso Restringido - Área Admin</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            No tienes permisos de administrador para acceder a esta ruta. Inicia sesión con una cuenta de administrador autorizada en Supabase.
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setShowAuthModal(true)}
            className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <LogIn className="w-4 h-4" />
            <span>Iniciar Sesión</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Volver al Sitio Público
          </button>
        </div>
        <AuthModal />
      </div>
    );
  }

  return (
    <Suspense fallback={<PageLoader message="Cargando panel de administración..." />}>
      <AdminLayout />
    </Suspense>
  );
};

const DashboardGuard: React.FC = () => {
  const { currentUser, setShowAuthModal } = useApp();
  const navigate = useNavigate();
  const isUserAdmin = currentUser && currentUser.role === 'admin';

  if (isUserAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 text-center font-sans space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-2xl">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl font-extrabold text-white">Inicio de Sesión Requerido</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Para acceder a tu portal de proyectos debes iniciar sesión o registrar una cuenta.
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setShowAuthModal(true)}
            className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <LogIn className="w-4 h-4" />
            <span>Iniciar Sesión / Registrarse</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Volver al Inicio
          </button>
        </div>
        <AuthModal />
      </div>
    );
  }

  return (
    <Suspense fallback={<PageLoader message="Cargando portal de cliente..." />}>
      <ClientDashboardView />
    </Suspense>
  );
};

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with PublicLayout */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="inicio" element={<HomePage />} />
            <Route path="sobre-mi" element={<AboutPage />} />
            <Route path="servicios" element={<ServicesPage />} />
            <Route path="portafolio" element={<PortfolioPage />} />
            <Route path="tecnologias" element={<TechStackPage />} />
            <Route path="proceso" element={<ProcessPage />} />
            <Route path="calculadora" element={<CalculatorPage />} />
            <Route path="contacto" element={<ContactPage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route path="/admin/*" element={<AdminGuard />} />

          {/* Protected Client Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardGuard />} />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
