import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Save, CheckCircle2, RefreshCw } from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socials: { ...prev.socials, [key]: value }
    }));
  };

  const handleBrandingChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      branding: { ...prev.branding, [key]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Configuración del Sitio Público</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Modifica la información personal, encabezado hero, redes sociales y textos. Los cambios se actualizan en vivo en la plataforma.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>¡Configuración guardada e impresa en el sitio!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile & Hero Branding */}
        <div className="p-6 rounded-3xl bg-[#121215] border border-zinc-800 space-y-4 text-xs">
          <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-3">
            1. Perfil Personal & Títulos del Hero
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Nombre del Desarrollador</label>
              <input
                type="text"
                value={formData.developerName}
                onChange={e => handleChange('developerName', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Título Profesional</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => handleChange('title', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-zinc-300">Título Principal en la Portada (Hero)</label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={e => handleChange('heroTitle', e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white font-bold focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-zinc-300">Subtítulo de Portada</label>
            <textarea
              rows={2}
              value={formData.heroSubtitle}
              onChange={e => handleChange('heroSubtitle', e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-zinc-300">Biografía / Presentación (Sobre Mí)</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={e => handleChange('bio', e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Años de Experiencia</label>
              <input
                type="number"
                value={formData.experienceYears}
                onChange={e => handleChange('experienceYears', parseInt(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Proyectos Entregados</label>
              <input
                type="number"
                value={formData.completedProjectsCount}
                onChange={e => handleChange('completedProjectsCount', parseInt(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">URL Foto de Perfil</label>
              <input
                type="text"
                value={formData.profilePhoto}
                onChange={e => handleChange('profilePhoto', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Channels */}
        <div className="p-6 rounded-3xl bg-[#121215] border border-zinc-800 space-y-4 text-xs">
          <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-3">
            2. Canales de Contacto Directos
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Correo Electrónico</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Teléfono / WhatsApp (ej. 525584329102)</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => handleChange('phone', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Ubicación</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => handleChange('location', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Horarios de Atención</label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={e => handleChange('workingHours', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Social Networks & Branding */}
        <div className="p-6 rounded-3xl bg-[#121215] border border-zinc-800 space-y-4 text-xs">
          <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-3">
            3. Redes Sociales & Identidad de Marca
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300">GitHub URL</label>
              <input
                type="text"
                value={formData.socials.github || ''}
                onChange={e => handleSocialChange('github', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">LinkedIn URL</label>
              <input
                type="text"
                value={formData.socials.linkedin || ''}
                onChange={e => handleSocialChange('linkedin', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Texto del Logo (Navbar)</label>
              <input
                type="text"
                value={formData.branding.logoText}
                onChange={e => handleBrandingChange('logoText', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300">Texto del Pie de Página (Footer)</label>
              <input
                type="text"
                value={formData.branding.footerText}
                onChange={e => handleBrandingChange('footerText', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          <span>Guardar y Aplicar Cambios al Sitio Público</span>
        </button>
      </form>
    </div>
  );
};
