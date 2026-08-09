import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminProjectsView } from './AdminProjectsView';
import { AdminRequestsView } from './AdminRequestsView';
import { AdminUsersView } from './AdminUsersView';
import { AdminSettingsView } from './AdminSettingsView';
import { AdminAnalyticsView } from './AdminAnalyticsView';
import { AdminServicesView } from './AdminServicesView';
import { AdminMessagesView } from './AdminMessagesView';
import { AdminGalleryView } from './AdminGalleryView';
import { AdminTechStackView } from './AdminTechStackView';
import { AdminProfileView } from './AdminProfileView';
import {
  LayoutDashboard,
  FolderGit2,
  Lightbulb,
  Inbox,
  Users,
  Settings,
  BarChart2,
  LogOut,
  Globe,
  ChevronRight,
  Menu,
  X,
  Shield,
  Briefcase,
  Mail,
  Image as ImageIcon,
  Cpu,
  UserCheck
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { userLogout, setActiveTab, settings, currentUser, messages, setShowAuthModal } = useApp();
  const [adminSubTab, setAdminSubTab] = useState<
    | 'dashboard'
    | 'users'
    | 'projects'
    | 'services'
    | 'messages'
    | 'requests'
    | 'gallery'
    | 'techstack'
    | 'settings'
    | 'analytics'
    | 'profile'
  >('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // STRICT AUTHORIZATION GUARD:
  // If user is not authenticated or role is not 'admin', block access and render 403 Access Denied
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 text-center font-sans space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-2xl">
          <Shield className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl font-extrabold text-white">403 - Acceso Denegado</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            No posees privilegios de administrador para visualizar esta sección. Se requiere una cuenta con el rol <code className="text-rose-400 font-mono bg-rose-500/10 px-1 py-0.5 rounded">admin</code> asignado en la base de datos.
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
          >
            Volver a Mi Panel de Usuario
          </button>
          <button
            onClick={() => setActiveTab('inicio')}
            className="py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs transition-all"
          >
            Ir al Inicio
          </button>
        </div>
      </div>
    );
  }

  const unreadMessagesCount = messages.filter(m => m.status === 'nuevo').length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard General', icon: LayoutDashboard },
    { id: 'users', label: 'Usuarios & Roles', icon: Users },
    { id: 'projects', label: 'Portafolio & Proyectos', icon: FolderGit2 },
    { id: 'services', label: 'Servicios & Oferta', icon: Briefcase },
    { id: 'messages', label: 'Mensajes de Contacto', icon: Mail, badge: unreadMessagesCount },
    { id: 'requests', label: 'Cotizaciones / Leads', icon: Inbox },
    { id: 'gallery', label: 'Galería Multimedia', icon: ImageIcon },
    { id: 'techstack', label: 'Stack Tecnológico', icon: Cpu },
    { id: 'settings', label: 'Configuración del Sitio', icon: Settings },
    { id: 'analytics', label: 'Estadísticas & Visitas', icon: BarChart2 },
    { id: 'profile', label: 'Perfil de Admin', icon: UserCheck }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col lg:flex-row font-sans">
      {/* Mobile Header Bar */}
      <div className="lg:hidden p-4 bg-[#121215] border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sm text-white">
          <Shield className="w-5 h-5 text-blue-500" />
          <span>Panel Admin CMS</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('inicio')}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300"
          >
            Ver Sitio
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`w-full lg:w-64 bg-[#121215] border-r border-zinc-800 flex flex-col justify-between shrink-0 ${
        sidebarOpen ? 'block' : 'hidden lg:flex'
      }`}>
        <div className="p-6 space-y-6">
          {/* Admin Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">CMS Admin</div>
              <div className="text-[11px] text-blue-400 font-medium truncate max-w-[130px]">
                {currentUser?.name || settings.developerName}
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminSubTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setAdminSubTab(item.id as any);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && item.badge > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white font-extrabold text-[10px]">
                        {item.badge}
                      </span>
                    ) : null}
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-800 space-y-2">
          <button
            onClick={() => setActiveTab('inicio')}
            className="w-full py-2.5 px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Volver al Sitio Público</span>
          </button>

          <button
            onClick={userLogout}
            className="w-full py-2.5 px-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors flex items-center gap-2 border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión Admin</span>
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {adminSubTab === 'dashboard' && <AdminDashboardView onNavigate={(tab) => setAdminSubTab(tab as any)} />}
        {adminSubTab === 'users' && <AdminUsersView />}
        {adminSubTab === 'projects' && <AdminProjectsView />}
        {adminSubTab === 'services' && <AdminServicesView />}
        {adminSubTab === 'messages' && <AdminMessagesView />}
        {adminSubTab === 'requests' && <AdminRequestsView />}
        {adminSubTab === 'gallery' && <AdminGalleryView />}
        {adminSubTab === 'techstack' && <AdminTechStackView />}
        {adminSubTab === 'settings' && <AdminSettingsView />}
        {adminSubTab === 'analytics' && <AdminAnalyticsView />}
        {adminSubTab === 'profile' && <AdminProfileView />}
      </main>
    </div>
  );
};
