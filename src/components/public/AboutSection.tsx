import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { techStackList } from '../../data/initialData';
import {
  User,
  Award,
  BookOpen,
  Briefcase,
  Target,
  Sparkles,
  Download,
  Code,
  MapPin,
  Clock,
  Mail,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users2,
  Calendar
} from 'lucide-react';
import {
  AnimatedSection,
  AnimatedTitle,
  AnimatedCard,
  AnimatedButton,
  AnimatedProgressBar,
  AnimatedCounter,
  AnimatedImage,
  StaggerContainer,
  StaggerItem
} from '../common/AnimatedSection';
import { TiltCard } from '../common/TiltCard';

export const AboutSection: React.FC = () => {
  const { settings, scrollToContact, techStack } = useApp();
  const [selectedTechCategory, setSelectedTechCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Frontend', 'Backend', 'Base de Datos', 'Herramientas & IA'];
  const currentSkills = techStack && techStack.length > 0 ? techStack : techStackList;

  const filteredSkills = selectedTechCategory === 'Todos'
    ? currentSkills
    : currentSkills.filter(t => t.category === selectedTechCategory);

  const careerTimeline = [
    {
      year: '2021 - 2022',
      title: 'Inicios & Desarrollo Frontend Especializado',
      role: 'Frontend Developer',
      description: 'Creación de sitios web dinámicos y maquetación de alta fidelidad con React, JavaScript y CSS moderno. Primeros clientes corporativos.'
    },
    {
      year: '2022 - 2023',
      title: 'Expansión Full-Stack & Arquitecturas Cloud',
      role: 'Full Stack Engineer',
      description: 'Desarrollo de APIs RESTful, integración de bases de datos relacionales (PostgreSQL) y NoSQL (Firebase, MongoDB), e implementación de autenticación segura.'
    },
    {
      year: '2023 - 2024',
      title: 'Sistemas Empresariales, SaaS & PWA',
      role: 'Senior Software Architect',
      description: 'Liderazgo técnico en proyectos de e-Commerce, dashboards administrativos y Progressive Web Apps con capacidad offline y rendimiento óptimo.'
    },
    {
      year: '2025 - 2026',
      title: 'Soluciones Inteligentes con IA & Cloud Scale',
      role: 'Lead Developer & Tech Consultant',
      description: 'Integración de modelos de Inteligencia Artificial (Gemini API), arquitecturas serverless de alta disponibilidad y soluciones de software de extremo a extremo.'
    }
  ];

  const agencyValues = [
    {
      icon: ShieldCheck,
      title: 'Transparencia Total',
      desc: 'Sin costos ocultos ni letras chiquitas. Comunicación constante en cada etapa del desarrollo.'
    },
    {
      icon: Zap,
      title: 'Rendimiento Máximo',
      desc: 'Código optimizado para tiempos de carga inferiores a 1.5 segundos y 100% puntuación Lighthouse.'
    },
    {
      icon: Award,
      title: 'Calidad & Seguridad',
      desc: 'Buenas prácticas OWASP, pruebas automatizadas y estándares modernos de la industria.'
    },
    {
      icon: Users2,
      title: 'Enfoque en el Cliente',
      desc: 'Compromiso con el éxito comercial de tu proyecto y acompañamiento post-lanzamiento.'
    }
  ];

  return (
    <section id="sobre-mi" className="py-24 bg-[#09090b]/80 backdrop-blur-sm border-t border-zinc-800/80 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 space-y-20">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <AnimatedSection variant="zoomIn" delay={0.05}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-blue-400 text-xs font-semibold">
              <User className="w-3.5 h-3.5" />
              <span>Perfil Profesional & Trayectoria</span>
            </div>
          </AnimatedSection>

          <AnimatedTitle delay={0.15}>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Conoce la experiencia detrás de cada línea de código
            </h2>
          </AnimatedTitle>

          <AnimatedSection variant="fadeUp" delay={0.25}>
            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
              Combinación de ingeniería de software avanzada, arquitectura en la nube y visión de negocio para convertir ideas en soluciones digitales competitivas.
            </p>
          </AnimatedSection>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Profile Photo / Tech Avatar & Personal Info Card */}
          <AnimatedSection variant="fadeLeft" delay={0.2} className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden bg-[#0d0d11] border border-zinc-800 shadow-2xl h-[440px] flex flex-col justify-between">
              {/* If custom non-sample photo is provided */}
              {settings.profilePhoto && !settings.profilePhoto.includes('unsplash.com') ? (
                <img
                  src={settings.profilePhoto}
                  alt={settings.developerName}
                  className="w-full h-[440px] object-cover object-top"
                />
              ) : (
                /* Modern Futuristic Tech Avatar Placeholder */
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#121218] via-[#09090e] to-[#09090b] overflow-hidden">
                  {/* Background Grid Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                  
                  {/* Ambient Backlight Glows */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

                  {/* Top Floating Glass Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Perfil Activo</span>
                  </div>

                  {/* Central Stylized Avatar Circle */}
                  <div className="relative mb-6">
                    {/* Glowing Gradient Border Ring */}
                    <div className="p-1 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 shadow-[0_0_35px_rgba(37,99,235,0.3)]">
                      <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-[#121218] border border-zinc-700/80 backdrop-blur-xl flex items-center justify-center relative overflow-hidden shadow-inner">
                        {/* Internal Subtle Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
                        
                        {/* User Avatar Vector Icon */}
                        <div className="relative z-10 p-4 rounded-full bg-zinc-900/90 border border-zinc-800 text-blue-400 shadow-md">
                          <User className="w-14 h-14 sm:w-16 sm:h-16 text-blue-400" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Overlay Code Badge */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-zinc-900 border border-blue-500/40 text-[10px] font-mono font-semibold text-blue-300 shadow-lg flex items-center gap-1 whitespace-nowrap">
                      <Code className="w-3 h-3 text-blue-400" />
                      <span>FULLSTACK</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Overlay Info */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent p-6 text-white pointer-events-none">
                <div className="text-2xl font-extrabold">{settings.developerName}</div>
                <div className="text-sm text-blue-400 font-semibold mt-0.5">{settings.title}</div>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    {settings.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    {settings.workingHours}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Specs Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1.5">
                <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  <span>Experiencia</span>
                </div>
                <div className="text-xl font-extrabold text-white">
                  +<AnimatedCounter target={settings.experienceYears || 5} /> Años
                </div>
                <div className="text-[11px] text-zinc-500">Desarrollo Profesional</div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1.5">
                <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Proyectos</span>
                </div>
                <div className="text-xl font-extrabold text-white">
                  +<AnimatedCounter target={settings.completedProjectsCount || 45} /> Entregados
                </div>
                <div className="text-[11px] text-zinc-500">100% a Satisfacción</div>
              </div>
            </div>
          </AnimatedSection>

          {/* Bio Story & Work Philosophy */}
          <AnimatedSection variant="fadeRight" delay={0.3} className="lg:col-span-7 space-y-8">
            {/* Story & Biography */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <span>Mi Historia & Enfoque</span>
              </h3>
              <p className="text-zinc-300 text-base leading-relaxed">
                {settings.bio}
              </p>
              <p className="text-zinc-300 text-base leading-relaxed">
                Mi objetivo es eliminar la brecha entre las necesidades estratégicas de un negocio y la complejidad técnica del desarrollo de software. Trabajo de manera directa con cada cliente para diseñar e implementar plataformas modernas, rápidas e inmunes a errores que impulsan el crecimiento real.
              </p>
            </div>

            {/* Work Philosophy & Objectives */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatedCard className="p-5 rounded-2xl bg-blue-950/30 border border-blue-900/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-300">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <span>Filosofía de Trabajo</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  "Código limpio, comunicación transparente y entregas puntuales. Cada sistema debe ser fácil de mantener, veloz e intuitivo para el usuario final."
                </p>
              </AnimatedCard>

              <AnimatedCard className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-900/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <Target className="w-5 h-5 text-emerald-400" />
                  <span>Objetivo Principal</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Superar las expectativas comerciales y de rendimiento en cada entregable, convirtiendo especificaciones abstractas en activos digitales de alto valor.
                </p>
              </AnimatedCard>
            </div>

            {/* Skills Progress Showcase */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-400" />
                  <span>Especialidades & Nivel de Dominio</span>
                </h4>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedTechCategory(cat)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                        selectedTechCategory === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Bars List with Stagger */}
              <StaggerContainer key={selectedTechCategory} staggerDelay={0.06} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {filteredSkills.slice(0, 8).map((skill) => (
                  <StaggerItem key={skill.name} variant="scale">
                    <AnimatedCard className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-200">
                        <span>{skill.name}</span>
                        <span className="text-blue-400 font-mono">{skill.proficiency}%</span>
                      </div>
                      <AnimatedProgressBar percentage={skill.proficiency} />
                      <p className="text-[11px] text-zinc-400 truncate">
                        {skill.description}
                      </p>
                    </AnimatedCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-4">
              <AnimatedButton
                onClick={scrollToContact}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Iniciar Conversación</span>
              </AnimatedButton>

              {settings.cvUrl && (
                <a
                  href={settings.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium text-sm border border-zinc-800 transition-colors flex items-center gap-2 hover:scale-105 active:scale-95 duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar CV Profesional</span>
                </a>
              )}
            </div>
          </AnimatedSection>
        </div>

        {/* Career Timeline Section */}
        <div className="space-y-10 pt-10 border-t border-zinc-800/80">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-400 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Línea de Tiempo Profesional</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Evolución & Hitos Principales
            </h3>
            <p className="text-sm text-zinc-400">
              Trayectoria constante de crecimiento técnico y proyectos entregados a lo largo de los años.
            </p>
          </div>

          <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {careerTimeline.map((item, idx) => (
              <StaggerItem key={idx} variant="up">
                <TiltCard className="p-6 rounded-2xl bg-[#121215] border border-zinc-800/90 hover:border-blue-500/50 shadow-lg space-y-3 h-full flex flex-col justify-between group transition-colors">
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold">
                      {item.year}
                    </span>
                    <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                    <div className="text-xs text-blue-300 font-semibold">
                      {item.role}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-zinc-800/60 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Hito Completado</span>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Agency Work Values Grid */}
        <div className="space-y-8 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-extrabold text-white">
              Principios & Valores de Desarrollo
            </h3>
            <p className="text-sm text-zinc-400">
              Garantizamos que cada proyecto se entregue bajo estándares éticos y de alta calidad.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {agencyValues.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <TiltCard key={idx} className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 space-y-3 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white">{val.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{val.desc}</p>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

