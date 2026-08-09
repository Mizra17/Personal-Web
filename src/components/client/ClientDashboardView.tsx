import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Inbox,
  Clock,
  CheckCircle2,
  FileText,
  MessageSquare,
  PlusCircle,
  Globe,
  LogOut,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const ClientDashboardView: React.FC = () => {
  const { currentUser, userLogout, quoteRequests, setActiveTab, settings } = useApp();

  // Filter quote requests matching current logged in user email (or sample for preview)
  const clientRequests = quoteRequests.filter(r =>
    currentUser ? r.email.toLowerCase() === currentUser.email.toLowerCase() : true
  );

  const handleGoToCalculator = () => {
    setActiveTab('calculadora');
    setTimeout(() => {
      const elem = document.getElementById('calculadora');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = 'calculadora';
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">
      {/* Navigation Header */}
      <header className="bg-[#121215] border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white">
                Bienvenido, {currentUser ? currentUser.name : 'Cliente Portal'}
              </div>
              <div className="text-[11px] text-zinc-400">
                Portal de Seguimiento de Proyectos
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('inicio')}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Ver Sitio Web</span>
            </button>
            <button
              onClick={userLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-[#121215] to-purple-950/30 border border-zinc-800 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Portal de Cliente Activo
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Monitorea el Estado de tus Proyectos en Tiempo Real
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Desde este panel puedes consultar el avance de tus cotizaciones, revisar notas de desarrollo y solicitar nuevas soluciones tecnológicas directamente a {settings.developerName}.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={handleGoToCalculator}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Solicitar Nueva Cotización</span>
            </button>
            <a
              href={`https://wa.me/${settings.whatsapp}?text=Hola%20${encodeURIComponent(settings.developerName)},%20tengo%20una%20duda%20sobre%20mi%20proyecto.`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Soporte por WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Status Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Inbox className="w-5 h-5 text-blue-500" />
            <span>Mis Solicitudes de Cotización ({clientRequests.length})</span>
          </h2>

          {clientRequests.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#121215] border border-zinc-800 text-center space-y-4">
              <FileText className="w-12 h-12 text-zinc-600 mx-auto" />
              <p className="text-sm font-semibold text-zinc-300">Aún no tienes solicitudes registradas</p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Usa nuestra calculadora interactiva para generar una estimación de tu proyecto web o móvil.
              </p>
              <button
                onClick={handleGoToCalculator}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-2 transition-all shadow-md shadow-blue-600/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Ir a la Calculadora de Proyecto</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientRequests.map((req) => (
                <div key={req.id} className="p-6 rounded-3xl bg-[#121215] border border-zinc-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-zinc-400">{req.createdAt}</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] capitalize ${
                        req.status === 'pendiente' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        req.status === 'en_revision' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        req.status === 'en_proceso' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{req.projectType}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{req.description}</p>

                    <div className="p-3 rounded-2xl bg-[#09090b] border border-zinc-800 text-xs space-y-1">
                      <div className="flex justify-between text-zinc-400">
                        <span>Presupuesto Estimado:</span>
                        <span className="font-bold text-emerald-400">{req.estimatedBudget}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Fecha Meta:</span>
                        <span className="font-semibold text-white">{req.estimatedDate}</span>
                      </div>
                    </div>

                    {req.internalNotes && (
                      <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 space-y-1">
                        <span className="font-bold text-blue-400 text-[10px] uppercase block">Nota del Desarrollador:</span>
                        <p>{req.internalNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> Atendido por {settings.developerName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
