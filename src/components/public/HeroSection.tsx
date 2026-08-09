import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  Send,
  Code2,
  CheckCircle2,
  Layers,
  Terminal,
  Cpu,
  Smartphone,
  ShieldCheck,
  Star
} from 'lucide-react';
import {
  AnimatedSection,
  AnimatedTitle,
  AnimatedButton,
  AnimatedCounter,
  AnimatedCard,
  ParallaxFloating,
  StaggerContainer,
  StaggerItem
} from '../common/AnimatedSection';
import { MagneticElement } from '../common/MagneticElement';
import { TiltCard } from '../common/TiltCard';
import { Hero3DCanvas } from '../common/Hero3DCanvas';

export const HeroSection: React.FC = () => {
  const { settings, requestQuote } = useApp();
  const navigate = useNavigate();
  const [activeView, setActiveView] = React.useState<'3d' | 'code'>('3d');

  const handleScrollTo = (target: string) => {
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/${target}`);
    }
  };

  const handleQuote = () => {
    requestQuote();
    navigate('/calculadora');
  };

  return (
    <section id="inicio" className="relative pt-8 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-transparent">
      {/* Background Decorative Glow Gradients with subtle pulsing animation */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.15, 0.22, 0.15]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.18, 0.1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
        className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-indigo-600/10 blur-[110px] rounded-full pointer-events-none"
      />

      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Action CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Availability Badge */}
            <AnimatedSection variant="fadeUp" delay={0.05}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-blue-400 text-xs font-semibold tracking-wide shadow-sm backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Desarrollo Web & Móvil Profesional</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-zinc-400 font-normal">Disponible para nuevos proyectos</span>
              </div>
            </AnimatedSection>

            {/* Main Headline */}
            <AnimatedTitle delay={0.15}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                {settings.heroTitle || "Transformo ideas en soluciones digitales."}
              </h1>
            </AnimatedTitle>

            {/* Subtitle */}
            <AnimatedSection variant="fadeUp" delay={0.25}>
              <p className="text-lg sm:text-xl text-zinc-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {settings.heroSubtitle || "Desarrollo páginas web, aplicaciones y sistemas modernos que convierten ideas en proyectos reales."}
              </p>
            </AnimatedSection>

            {/* Quick Benefits Bullet Badges */}
            <StaggerContainer delay={0.35} staggerDelay={0.08} className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-4 text-xs sm:text-sm text-zinc-400">
              <StaggerItem variant="slideRight">
                <span className="flex items-center gap-1.5 bg-zinc-900/40 px-3 py-1 rounded-full border border-zinc-800/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Personalizado</span>
                </span>
              </StaggerItem>
              <StaggerItem variant="slideRight">
                <span className="flex items-center gap-1.5 bg-zinc-900/40 px-3 py-1 rounded-full border border-zinc-800/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Rendimiento Extremo</span>
                </span>
              </StaggerItem>
              <StaggerItem variant="slideRight">
                <span className="flex items-center gap-1.5 bg-zinc-900/40 px-3 py-1 rounded-full border border-zinc-800/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Progressive Web App (PWA)</span>
                </span>
              </StaggerItem>
            </StaggerContainer>

            {/* Action Buttons */}
            <AnimatedSection variant="fadeUp" delay={0.45} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <MagneticElement className="w-full sm:w-auto">
                <AnimatedButton
                  onClick={() => handleScrollTo('portafolio')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm sm:text-base shadow-xl shadow-blue-600/30 border border-blue-500/40 flex items-center justify-center gap-2 group transition-all"
                >
                  <span>Ver Portafolio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </AnimatedButton>
              </MagneticElement>

              <MagneticElement className="w-full sm:w-auto">
                <AnimatedButton
                  onClick={handleQuote}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 font-semibold text-sm sm:text-base shadow-lg shadow-white/10 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4 text-blue-600" />
                  <span>Solicitar Cotización</span>
                </AnimatedButton>
              </MagneticElement>

              <MagneticElement className="w-full sm:w-auto">
                <AnimatedButton
                  onClick={() => handleScrollTo('contacto')}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 font-medium text-sm border border-zinc-800 flex items-center justify-center transition-all"
                >
                  <span>Contactarme</span>
                </AnimatedButton>
              </MagneticElement>
            </AnimatedSection>

            {/* Live Stats with Number Counters */}
            <AnimatedSection variant="scaleIn" delay={0.55} className="pt-8 border-t border-zinc-800/80 max-w-lg mx-auto lg:mx-0">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/40 text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">
                    +<AnimatedCounter target={settings.experienceYears || 5} /> Años
                  </div>
                  <div className="text-xs text-zinc-400 font-medium mt-0.5">
                    Experiencia Profesional
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/40 text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">
                    +<AnimatedCounter target={settings.completedProjectsCount || 45} /> Proyectos
                  </div>
                  <div className="text-xs text-zinc-400 font-medium mt-0.5">
                    Completados con Éxito
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/40 text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">
                    <AnimatedCounter target={100} suffix="%" />
                  </div>
                  <div className="text-xs text-zinc-400 font-medium mt-0.5">
                    Garantía & Satisfacción
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column: High Quality Interactive Code / App Graphic Frame */}
          <AnimatedSection variant="fadeLeft" delay={0.3} className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Card Container with Glassmorphism */}
              <div className="relative rounded-2xl bg-[#121215]/90 text-zinc-100 p-5 sm:p-6 shadow-2xl border border-zinc-800/90 overflow-hidden backdrop-blur-xl">
                {/* Header Bar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                  </div>

                  {/* Mode Selector Tabs */}
                  <div className="flex items-center gap-1 bg-zinc-950/90 p-1 rounded-xl border border-zinc-800">
                    <button
                      onClick={() => setActiveView('3d')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-mono font-semibold flex items-center gap-1.5 transition-all ${
                        activeView === '3d'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Cpu className="w-3 h-3" />
                      <span>Nucleo 3D</span>
                    </button>
                    <button
                      onClick={() => setActiveView('code')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-mono font-semibold flex items-center gap-1.5 transition-all ${
                        activeView === 'code'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Terminal className="w-3 h-3" />
                      <span>AppArchitecture.tsx</span>
                    </button>
                  </div>
                </div>

                {/* View Content */}
                {activeView === '3d' ? (
                  <div className="relative overflow-hidden rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <Hero3DCanvas />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 text-[10px] font-mono text-zinc-400 pointer-events-none">
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Sparkles className="w-3 h-3" /> 3D WebGL Engine
                      </span>
                      <span className="text-zinc-500">Mueve el cursor para interactuar</span>
                    </div>
                  </div>
                ) : (
                  /* Simulated Code & Visual Preview */
                  <div className="font-mono text-xs space-y-2.5 text-zinc-300 py-2">
                    <p className="text-zinc-500">// Arquitectura PWA & Sistema Escalable</p>
                    <p>
                      <span className="text-purple-400">const</span> <span className="text-blue-300">solucionDigital</span> = <span className="text-amber-300">async</span> () ={'>'} {'{'}
                    </p>
                    <p className="pl-4 text-emerald-400">
                      <span className="text-purple-400">return</span> {'{'}
                    </p>
                    <p className="pl-8">tipo: <span className="text-amber-200">'PWA_Web_And_Mobile'</span>,</p>
                    <p className="pl-8">diseno: <span className="text-amber-200">'Premium_Responsive_Glassmorphism'</span>,</p>
                    <p className="pl-8">rendimiento: <span className="text-amber-200">'100_Lighthouse_Score'</span>,</p>
                    <p className="pl-8">backend: <span className="text-amber-200">'Cloud_Serverless_Ready'</span></p>
                    <p className="pl-4 text-emerald-400">{'}'};</p>
                    <p>{'}'};</p>
                  </div>
                )}

                {/* Sub Features Grid Overlay */}
                <div className="mt-6 pt-5 border-t border-zinc-800/80 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Full Stack</div>
                      <div className="text-[10px] text-zinc-400">React, Node, DB</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">PWA Ready</div>
                      <div className="text-[10px] text-zinc-400">Modo Offline</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Micro Badges with ParallaxFloating */}
              <ParallaxFloating intensity={8} className="hidden sm:block absolute -bottom-5 -left-5 z-20">
                <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Código Seguro & Limpio</div>
                    <div className="text-[10px] text-zinc-400">OWASP Standards</div>
                  </div>
                </div>
              </ParallaxFloating>

              <ParallaxFloating intensity={12} className="hidden sm:block absolute -top-4 -right-4 z-20">
                <div className="bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-2xl shadow-xl flex items-center gap-2 backdrop-blur-md">
                  <div className="flex -space-x-1">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">5★</span>
                  </div>
                  <div className="text-xs font-semibold text-zinc-200 pr-1">
                    Reseñas 5.0
                  </div>
                </div>
              </ParallaxFloating>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
