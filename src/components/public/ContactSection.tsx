import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  Mail,
  Phone,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  Calendar,
  DollarSign,
  User,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  MapPin,
  Clock,
  Sparkles,
  LayoutDashboard,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  AnimatedSection,
  AnimatedTitle,
  AnimatedButton
} from '../common/AnimatedSection';
import { TiltCard } from '../common/TiltCard';
import { MagneticElement } from '../common/MagneticElement';

export const ContactSection: React.FC = () => {
  const {
    settings,
    addQuoteRequest,
    quotePrefillData,
    setQuotePrefillData,
    currentUser,
    setActiveTab,
    setAuthModalPrompt,
    setShowAuthModal
  } = useApp();

  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('Sitio Corporativo');
  const [estimatedBudget, setEstimatedBudget] = useState('$15,000 - $30,000 MXN');
  const [description, setDescription] = useState('');
  const [estimatedDate, setEstimatedDate] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sync current logged in user details if available
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !clientName) setClientName(currentUser.name);
      if (currentUser.email && !email) setEmail(currentUser.email);
    }
  }, [currentUser]);

  // Sync prefill from calculator or service
  useEffect(() => {
    if (quotePrefillData) {
      if (quotePrefillData.projectType) setProjectType(quotePrefillData.projectType);
      if (quotePrefillData.estimatedBudget) setEstimatedBudget(quotePrefillData.estimatedBudget);
      if (quotePrefillData.description) setDescription(quotePrefillData.description);
    }
  }, [quotePrefillData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // CRITICAL: If user is not authenticated, stop execution immediately and show auth modal!
    if (!currentUser) {
      setAuthModalPrompt('Para solicitar una cotización necesitas crear una cuenta o iniciar sesión.');
      setShowAuthModal(true);
      return; // STOP! Do not submit, do not set isSubmitted, do not clear state.
    }

    const finalName = currentUser.name || clientName;
    const finalEmail = currentUser.email || email;

    if (!finalName || !finalEmail || !description) {
      setSubmitError('Por favor completa todos los campos requeridos (*).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await addQuoteRequest({
        clientName: finalName,
        email: finalEmail,
        phone: phone || 'No proporcionado',
        projectType,
        estimatedBudget,
        description,
        estimatedDate: estimatedDate || 'Flexible',
        attachments
      });

      if (res && res.success) {
        setIsSubmitted(true);
        setQuotePrefillData(null);
      } else {
        setSubmitError(res?.error || 'No se pudo guardar la cotización. Por favor reintenta.');
      }
    } catch (err: any) {
      setSubmitError('Ocurrió un error inesperado al enviar la cotización.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setAttachments(prev => [...prev, fileName]);
    }
  };

  return (
    <section id="contacto" className="py-20 bg-[#09090b]/60 backdrop-blur-sm border-t border-zinc-800/80 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <AnimatedSection variant="zoomIn" delay={0.05}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-blue-400 text-xs font-semibold">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Contacto Directo & Cotizaciones</span>
            </div>
          </AnimatedSection>

          <AnimatedTitle delay={0.15}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Hablemos de tu próximo proyecto
            </h2>
          </AnimatedTitle>

          <AnimatedSection variant="fadeUp" delay={0.25}>
            <p className="text-zinc-300 text-base sm:text-lg">
              Envía tus datos para recibir un análisis preliminar y una propuesta formal sin ningún compromiso.
            </p>
          </AnimatedSection>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Permanent Contact Information Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-3xl bg-zinc-950/90 backdrop-blur-xl text-white border border-zinc-800 shadow-xl space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span>Información de Contacto</span>
              </h3>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Respondo personalmente a cada solicitud en un plazo máximo de 12 horas.
              </p>

              {/* Direct Channels List */}
              <div className="space-y-4">
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400 font-medium">WhatsApp Directo</div>
                    <div className="text-sm font-bold group-hover:text-emerald-400 transition-colors">
                      {settings.phone}
                    </div>
                  </div>
                </a>

                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400 font-medium">Correo Electrónico</div>
                    <div className="text-sm font-bold group-hover:text-blue-400 transition-colors">
                      {settings.email}
                    </div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400 font-medium">Ubicación</div>
                    <div className="text-sm font-bold">{settings.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400 font-medium">Horario de Atención</div>
                    <div className="text-sm font-bold">{settings.workingHours}</div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <div className="text-xs font-bold uppercase text-zinc-400">Redes Sociales</div>
                <div className="flex items-center gap-2">
                  {settings.socials.github && (
                    <a href={settings.socials.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-zinc-900 hover:bg-blue-600 text-zinc-300 hover:text-white transition-colors border border-zinc-800">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {settings.socials.linkedin && (
                    <a href={settings.socials.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-zinc-900 hover:bg-blue-600 text-zinc-300 hover:text-white transition-colors border border-zinc-800">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {settings.socials.instagram && (
                    <a href={settings.socials.instagram} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-zinc-900 hover:bg-blue-600 text-zinc-300 hover:text-white transition-colors border border-zinc-800">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {settings.socials.facebook && (
                    <a href={settings.socials.facebook} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-zinc-900 hover:bg-blue-600 text-zinc-300 hover:text-white transition-colors border border-zinc-800">
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Quote Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#121215] border border-zinc-800 shadow-lg">
            {isSubmitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">
                  ¡Solicitud Enviada con Éxito!
                </h3>
                <p className="text-sm text-zinc-300 max-w-md mx-auto">
                  Gracias por tu interés, {currentUser?.name || clientName}. He recibido los detalles de tu proyecto y me pondré en contacto contigo a la brevedad al correo <strong>{currentUser?.email || email}</strong>.
                </p>
                <div className="flex flex-wrap gap-3 justify-center pt-2">
                  {currentUser && (
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Ver mi cotización en Mi Panel</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors"
                  >
                    Enviar otra solicitud
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-lg font-bold text-white">
                    Formulario de Cotización
                  </h3>
                  <span className="text-xs text-blue-400 font-semibold">
                    *Campos obligatorios
                  </span>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span>Nombre Completo *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Juan Pérez"
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      <span>Correo Electrónico *</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="juan@empresa.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone & Project Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <span>Teléfono / WhatsApp</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+52 55 1234 5678"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">
                      Tipo de Proyecto
                    </label>
                    <select
                      value={projectType}
                      onChange={e => setProjectType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option className="bg-zinc-900 text-white">Sitio Corporativo</option>
                      <option className="bg-zinc-900 text-white">Landing Page</option>
                      <option className="bg-zinc-900 text-white">Tienda en Línea (e-Commerce)</option>
                      <option className="bg-zinc-900 text-white">Aplicación Web / SaaS</option>
                      <option className="bg-zinc-900 text-white">Aplicación Móvil (iOS & Android)</option>
                      <option className="bg-zinc-900 text-white">Sistema Administrativo / ERP</option>
                      <option className="bg-zinc-900 text-white">Otro / Consultoría</option>
                    </select>
                  </div>
                </div>

                {/* Error Banner */}
                {submitError && (
                  <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-400" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Budget & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Presupuesto Estimado</span>
                    </label>
                    <select
                      value={estimatedBudget}
                      onChange={e => setEstimatedBudget(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option className="bg-zinc-900 text-white">$7,500 - $15,000 MXN</option>
                      <option className="bg-zinc-900 text-white">$15,000 - $30,000 MXN</option>
                      <option className="bg-zinc-900 text-white">$30,000 - $60,000 MXN</option>
                      <option className="bg-zinc-900 text-white">$60,000 MXN o superior</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>Fecha Estimada de Lanzamiento</span>
                    </label>
                    <input
                      type="date"
                      value={estimatedDate}
                      onChange={e => setEstimatedDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">
                    Descripción del Proyecto *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe las características principales, objetivos y necesidades de tu solución..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  ></textarea>
                </div>

                {/* File Upload Simulation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                    <Paperclip className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Archivos Adjuntos (Opcional - Documentos, Logos, Wireframes)</span>
                  </label>
                  <div className="p-4 rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900 text-center space-y-2">
                    <input
                      type="file"
                      onChange={handleSimulatedFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer text-xs font-semibold text-blue-400 hover:underline">
                      Haz clic para adjuntar archivo
                    </label>
                    {attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center pt-1">
                        {attachments.map((file, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-950 text-blue-300 text-[11px] font-medium border border-blue-800">
                            📄 {file}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit CTA */}
                <MagneticElement className="w-full">
                  <AnimatedButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-extrabold text-base shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Procesando Solicitud...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Solicitar Cotización</span>
                      </>
                    )}
                  </AnimatedButton>
                </MagneticElement>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
