import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Code2, Github, Linkedin, Facebook, Instagram, ShieldCheck, X, Sparkles, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useApp();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <footer className="relative bg-[#09090b] text-zinc-300 border-t border-zinc-800/80 pt-16 pb-12 sm:pt-20 sm:pb-16 overflow-hidden">
      {/* Static Backlight Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
          {/* Logo & Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-600/30">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                {settings.branding.logoText || settings.developerName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              Plataforma profesional de desarrollo web, aplicaciones móviles y soluciones digitales a la medida. Construida con arquitectura Progressive Web App (PWA) de alto desempeño.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-400">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>Disponible para Consultoría & Proyectos</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-widest text-zinc-200 flex items-center gap-1.5">
              <span>Navegación Rápida</span>
            </div>
            <ul className="space-y-2.5 text-xs font-medium text-zinc-400">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                  <span>Inicio</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                </Link>
              </li>
              <li>
                <Link to="/sobre-mi" className="hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                  <span>Sobre Mí</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                  <span>Servicios</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                </Link>
              </li>
              <li>
                <Link to="/portafolio" className="hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                  <span>Portafolio</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                </Link>
              </li>
              <li>
                <Link to="/calculadora" className="hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                  <span>Calculadora de Proyecto</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-widest text-zinc-200">
              Contacto & Redes
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              {settings.email} | {settings.phone}
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              {settings.socials.github && (
                <a href={settings.socials.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:bg-blue-600 hover:border-blue-500 text-zinc-300 hover:text-white transition-colors shadow-md inline-block">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings.socials.linkedin && (
                <a href={settings.socials.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:bg-blue-600 hover:border-blue-500 text-zinc-300 hover:text-white transition-colors shadow-md inline-block">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings.socials.instagram && (
                <a href={settings.socials.instagram} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:bg-blue-600 hover:border-blue-500 text-zinc-300 hover:text-white transition-colors shadow-md inline-block">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.socials.facebook && (
                <a href={settings.socials.facebook} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:bg-blue-600 hover:border-blue-500 text-zinc-300 hover:text-white transition-colors shadow-md inline-block">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            {settings.branding.footerText || "© 2026 Mizrahim Web. Todos los derechos reservados."}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-blue-400 transition-colors"
            >
              Aviso de Privacidad
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => setShowTermsModal(true)}
              className="hover:text-blue-400 transition-colors"
            >
              Términos y Condiciones
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121215] text-zinc-100 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button onClick={() => setShowPrivacyModal(false)} className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span>Aviso de Privacidad</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              En cumplimiento con las normativas de protección de datos personales, le informamos que la información recopilada mediante los formularios de este sitio web será utilizada exclusivamente para responder a sus solicitudes de cotización, brindar asesoría tecnológica y enviar propuestas de proyecto. Sus datos personales nunca serán vendidos, compartidos ni cedidos a terceros sin su consentimiento explícito.
            </p>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121215] text-zinc-100 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button onClick={() => setShowTermsModal(false)} className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span>Términos y Condiciones del Servicio</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Todas las propuestas de desarrollo, entregables y derechos de propiedad intelectual sobre el código fuente personalizado quedan regulados bajo contrato de prestación de servicios. Los tiempos de entrega están condicionados a la entrega oportuna de contenidos por parte del cliente y a las etapas de revisión estipuladas.
            </p>
          </div>
        </div>
      )}
    </footer>
  );
};
