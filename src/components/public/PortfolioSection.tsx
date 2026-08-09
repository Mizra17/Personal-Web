import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { initialProjects } from '../../data/initialData';
import { Project } from '../../types';
import {
  FolderGit2,
  ExternalLink,
  Github,
  CheckCircle,
  Clock,
  Eye,
  X,
  Sparkles,
  Grid,
  Layers3,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ArrowRight
} from 'lucide-react';
import {
  AnimatedSection,
  AnimatedTitle,
  AnimatedButton,
  StaggerContainer,
  StaggerItem
} from '../common/AnimatedSection';
import { TiltCard } from '../common/TiltCard';

export const PortfolioSection: React.FC = () => {
  const { projects } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [viewMode, setViewMode] = useState<'stage' | 'grid'>('stage');
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);
  const [selectedModalImage, setSelectedModalImage] = useState<string | null>(null);

  const categories = ['Todas', 'Web', 'Móvil', 'Sistema Admin', 'eCommerce', 'Dashboard', 'API/Backend'];

  const displayProjects = projects && projects.length > 0 ? projects : initialProjects;

  const filteredProjects = selectedCategory === 'Todas'
    ? displayProjects
    : displayProjects.filter(p => p.category === selectedCategory);

  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);

  // Mouse tilt tracking state for active 3D screen
  const [mouseTilt, setMouseTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [isHoveredActive, setIsHoveredActive] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const handleActiveMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const yPct = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const rotateX = (0.5 - yPct) * 12; // degrees tilt X
    const rotateY = (xPct - 0.5) * 12; // degrees tilt Y

    setMouseTilt({
      rotateX,
      rotateY,
      glareX: xPct * 100,
      glareY: yPct * 100
    });
  };

  const handleActiveMouseLeave = () => {
    setIsHoveredActive(false);
    setMouseTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const openProjectModal = (proj: Project) => {
    setActiveProjectModal(proj);
    setSelectedModalImage(proj.mainImage);
  };

  const nextProject = () => {
    setActiveStageIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  const prevProject = () => {
    setActiveStageIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  return (
    <section id="portafolio" className="py-24 bg-transparent border-t border-zinc-800/80 transition-colors duration-300 relative overflow-hidden">
      {/* Ambient Background Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 relative z-10 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <AnimatedSection variant="zoomIn" delay={0.05}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-blue-400 text-xs font-semibold shadow-inner">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Casos de Éxito & Trabajos Realizados</span>
            </div>
          </AnimatedSection>

          <AnimatedTitle delay={0.15}>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Explora mis proyectos más recientes
            </h2>
          </AnimatedTitle>

          <AnimatedSection variant="fadeUp" delay={0.25}>
            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
              Galería espacial 3D interactiva. Haz clic en las pantallas o usa los controles para navegar con efecto cristal y movimiento tridimensional.
            </p>
          </AnimatedSection>
        </div>

        {/* View Mode Switcher & Category Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 border-b border-zinc-800/80 pb-6">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveStageIndex(0);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                    : 'bg-zinc-900/90 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800 shadow-inner shrink-0">
            <button
              onClick={() => setViewMode('stage')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'stage'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers3 className="w-3.5 h-3.5" />
              <span>Galería Espacial 3D</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Rejilla Cristal 3D</span>
            </button>
          </div>
        </div>

        {/* VIEW MODE 1: SPATIAL 3D ACCORDION GALLERY */}
        {viewMode === 'stage' && filteredProjects.length > 0 && (
          <div className="space-y-6">
            {/* 3D Scene Viewport */}
            <div
              ref={stageRef}
              className="relative w-full h-[580px] sm:h-[660px] flex items-center justify-center overflow-visible py-8"
              style={{ perspective: '1100px', transformStyle: 'preserve-3d' }}
            >
              {/* 3D Circular Orbit Ground Ring */}
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[720px] h-[220px] rounded-[50%] border border-blue-500/25 bg-gradient-to-b from-blue-600/10 via-indigo-500/5 to-transparent blur-xs pointer-events-none transition-all duration-700 shadow-[0_0_40px_rgba(59,130,246,0.15)]"
                style={{ transform: 'rotateX(78deg) translateZ(-100px)' }}
              />

              {filteredProjects.map((project, idx) => {
                const delta = idx - activeStageIndex;
                const isActive = delta === 0;
                const absDelta = Math.abs(delta);

                // Calculate 3D Orbital / Circular Cylinder Trajectory Coordinates
                const stepAngleDeg = 28; // Degrees offset per position on 3D wheel
                const angleDeg = delta * stepAngleDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const radius = 580; // Radius of 3D circular orbit in px

                // Base circular position along arc
                const baseX = Math.sin(angleRad) * radius;
                const baseZ = (Math.cos(angleRad) - 1) * radius + (isActive ? 140 : -30);

                // Weightless floating dispersion: unique vertical offset (Y) per card
                const floatYOffset = isActive ? -12 : (1 - Math.cos(angleRad)) * 38 + ((idx % 3) * 12 - 12);
                const yTranslate = floatYOffset;

                // Tangent rotation along orbit with slight unique tilt per card
                let rotateYAngle = -angleDeg * 0.92;
                if (isActive) {
                  rotateYAngle += mouseTilt.rotateY;
                } else {
                  // Organic Y rotation variance (+/- 4 to 5 deg) for zero-gravity floating feel
                  rotateYAngle += (idx % 2 === 0 ? 5 : -4);
                }

                // X and Z tilt angles: weightless spatial tumbling / floating
                const rotateXAngle = isActive
                  ? mouseTilt.rotateX
                  : (1 - Math.cos(angleRad)) * 12 + ((idx % 2 === 0) ? 6 : -5);

                const rotateZAngle = isActive
                  ? mouseTilt.rotateY * 0.08
                  : Math.sin(angleRad) * -4 + ((idx % 2 === 0) ? 3.5 : -3);

                // Scale, Opacity & Depth Order on the orbital ring
                const cosFactor = Math.max(0.35, Math.cos(angleRad));
                const cardScale = isActive ? 1 : Math.max(0.58, cosFactor * 0.85);
                const cardOpacity = isActive ? 1 : Math.max(0.3, cosFactor * 0.8);
                const cardZIndex = 50 - Math.round(absDelta * 10);

                // Depth of Field (Blur according to distance / depth)
                const blurAmount = isActive ? 0 : Math.min(5.5, absDelta * 1.6 + 0.4);

                return (
                  <motion.div
                    key={project.id}
                    onClick={() => {
                      if (!isActive) setActiveStageIndex(idx);
                    }}
                    onMouseEnter={() => {
                      if (isActive) setIsHoveredActive(true);
                    }}
                    onMouseMove={isActive ? handleActiveMouseMove : undefined}
                    onMouseLeave={isActive ? handleActiveMouseLeave : undefined}
                    animate={{
                      x: baseX,
                      y: yTranslate,
                      z: baseZ,
                      rotateY: rotateYAngle,
                      rotateX: rotateXAngle,
                      rotateZ: rotateZAngle,
                      scale: cardScale,
                      opacity: cardOpacity,
                      filter: `blur(${blurAmount}px)`,
                      zIndex: cardZIndex
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 170,
                      damping: 22,
                      mass: 0.85,
                      restDelta: 0.001
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      willChange: 'transform, opacity, filter'
                    }}
                    className={`absolute w-[92%] sm:w-[82%] max-w-[680px] h-[500px] sm:h-[560px] rounded-3xl cursor-pointer border backdrop-blur-2xl transition-shadow duration-500 overflow-hidden ${
                      isActive
                        ? 'border-blue-400/80 bg-[#121217]/95 shadow-[0_40px_100px_rgba(0,0,0,0.95),0_0_70px_rgba(59,130,246,0.45)]'
                        : 'border-white/10 bg-[#101014]/90 hover:border-blue-400/60 hover:opacity-100 shadow-[0_25px_60px_rgba(0,0,0,0.85)]'
                    }`}
                  >
                    {/* Floating 3D Ambient Ground Shadow */}
                    <div
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[85%] h-12 bg-black/70 rounded-full blur-xl pointer-events-none transition-all duration-500"
                      style={{
                        transform: `rotateX(85deg) translateZ(-40px) scale(${isActive ? 1.1 : 0.85})`,
                        opacity: isActive ? 0.8 : 0.4
                      }}
                    />
                    {/* Glass Sweep Beam Effect on Active Screen */}
                    {isActive && isHoveredActive && (
                      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
                        <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-[25deg] animate-glass-sweep" />
                      </div>
                    )}

                    {/* Specular Radial Glare on Active Screen */}
                    {isActive && (
                      <div
                        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-20"
                        style={{
                          opacity: isHoveredActive ? 0.38 : 0.12,
                          background: `radial-gradient(circle 380px at ${mouseTilt.glareX}% ${mouseTilt.glareY}%, rgba(255, 255, 255, 0.45) 0%, rgba(59, 130, 246, 0.25) 40%, transparent 75%)`
                        }}
                      />
                    )}

                    {/* Project Screen Top Header Image */}
                    <div
                      className="relative h-64 sm:h-76 overflow-hidden bg-zinc-950"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <img
                        src={project.mainImage}
                        alt={project.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          isActive && isHoveredActive ? 'scale-105' : 'scale-100'
                        }`}
                        style={{ transform: 'translateZ(15px)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-[#121217]/40 to-black/30" />

                      {/* Top Badges (Popped in 3D Space) */}
                      <div
                        className="absolute top-4 left-4 z-10 flex items-center gap-2"
                        style={{ transform: 'translateZ(40px)' }}
                      >
                        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-xl backdrop-blur-md ${
                          project.status === 'Entregado'
                            ? 'bg-emerald-500/90 text-white border border-emerald-400/40'
                            : project.status === 'Demo en vivo'
                            ? 'bg-blue-600/90 text-white border border-blue-400/40'
                            : 'bg-amber-500/90 text-white border border-amber-400/40'
                        }`}>
                          {project.status === 'Entregado' && <CheckCircle className="w-3.5 h-3.5" />}
                          {project.status === 'Demo en vivo' && <Sparkles className="w-3.5 h-3.5" />}
                          {project.status === 'En proceso' && <Clock className="w-3.5 h-3.5" />}
                          <span>{project.status}</span>
                        </span>
                      </div>

                      <div
                        className="absolute top-4 right-4 z-10"
                        style={{ transform: 'translateZ(40px)' }}
                      >
                        <span className="px-3.5 py-1.5 rounded-xl bg-zinc-900/90 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-xl">
                          {project.category}
                        </span>
                      </div>

                      {/* Overlay title preview for stacked 3D cards */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-end p-6">
                          <h4 className="text-xl font-extrabold text-white tracking-wide drop-shadow-lg">
                            {project.title}
                          </h4>
                        </div>
                      )}
                    </div>

                    {/* Project Active Body Info */}
                    <div
                      className="p-6 sm:p-7 space-y-4 flex flex-col justify-between h-[calc(100%-256px)] sm:h-[calc(100%-304px)]"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="space-y-2" style={{ transform: 'translateZ(25px)' }}>
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
                            {project.title}
                          </h3>
                          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
                            0{idx + 1} / 0{filteredProjects.length}
                          </span>
                        </div>

                        <p className="text-sm text-zinc-300 line-clamp-2 leading-relaxed">
                          {project.fullDescription || project.description}
                        </p>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-2" style={{ transform: 'translateZ(30px)' }}>
                        {project.technologies.slice(0, 5).map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-lg bg-zinc-900/90 text-zinc-200 text-xs font-medium border border-zinc-800 shadow-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3" style={{ transform: 'translateZ(45px)' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openProjectModal(project);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Ver Detalles Completos</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {project.repoUrl && (
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2.5 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors"
                              title="Ver Código"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}

                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-4 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-white text-xs font-bold border border-zinc-700 flex items-center gap-1.5 transition-all hover:scale-105"
                            >
                              <span>Demo</span>
                              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Stage Direct Controls & Indicator Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800/80">
              {/* Previous / Next Arrow Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={prevProject}
                  className="p-3 rounded-2xl bg-zinc-900/90 hover:bg-blue-600 text-white border border-zinc-800 hover:border-blue-500 transition-all shadow-lg active:scale-95 flex items-center gap-2 text-xs font-bold"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <button
                  onClick={nextProject}
                  className="p-3 rounded-2xl bg-zinc-900/90 hover:bg-blue-600 text-white border border-zinc-800 hover:border-blue-500 transition-all shadow-lg active:scale-95 flex items-center gap-2 text-xs font-bold"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Numbered Indicator Thumbnails */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0">
                {filteredProjects.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveStageIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      idx === activeStageIndex
                        ? 'bg-blue-600 text-white shadow-md scale-105 border border-blue-400'
                        : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODE 2: 3D CRYSTAL GRID */}
        {viewMode === 'grid' && (
          <StaggerContainer key={selectedCategory} staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <StaggerItem key={project.id} variant="up">
                <TiltCard
                  maxTilt={8}
                  glareOpacity={0.25}
                  showGlassSweep={true}
                  className="group rounded-3xl bg-[#121217]/90 backdrop-blur-2xl border border-white/10 overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-500/60 transition-all duration-300 flex flex-col justify-between h-full preserve-3d"
                >
                  {/* Main Image Header */}
                  <div className="relative h-60 overflow-hidden bg-zinc-950 preserve-3d">
                    <img
                      src={project.mainImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out translate-z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-black/30 opacity-90 group-hover:opacity-50 transition-opacity" />

                    {/* Floating Status Badge */}
                    <div className="absolute top-3.5 left-3.5 z-10 translate-z-30">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-lg backdrop-blur-md ${
                        project.status === 'Entregado'
                          ? 'bg-emerald-500/90 text-white border border-emerald-400/40'
                          : project.status === 'Demo en vivo'
                          ? 'bg-blue-600/90 text-white border border-blue-400/40'
                          : 'bg-amber-500/90 text-white border border-amber-400/40'
                      }`}>
                        {project.status === 'Entregado' && <CheckCircle className="w-3 h-3" />}
                        {project.status === 'Demo en vivo' && <Sparkles className="w-3 h-3" />}
                        {project.status === 'En proceso' && <Clock className="w-3 h-3" />}
                        <span>{project.status}</span>
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3.5 right-3.5 z-10 translate-z-30">
                      <span className="px-3 py-1 rounded-xl bg-zinc-900/90 backdrop-blur-md text-white text-[10px] font-semibold border border-white/15 shadow-md">
                        {project.category}
                      </span>
                    </div>

                    {/* Quick View Button Overlay */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-xs">
                      <button
                        onClick={() => openProjectModal(project)}
                        className="px-5 py-2.5 rounded-2xl bg-white/95 text-zinc-950 font-extrabold text-xs shadow-2xl flex items-center gap-2 transform translate-y-3 group-hover:translate-y-0 transition-all hover:scale-105 active:scale-95"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span>Ver Detalles Completos</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between translate-z-20">
                    <div className="space-y-2">
                      <h3 className="text-lg font-extrabold text-white leading-snug group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900/90 text-zinc-200 text-[11px] font-medium border border-zinc-800 shadow-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 text-[10px] font-bold">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Card Footer Links */}
                    <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => openProjectModal(project)}
                        className="text-blue-400 font-semibold hover:text-blue-300 flex items-center gap-1 transition-colors group/btn"
                      >
                        <span>Ver Proyecto</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>

                      <div className="flex items-center gap-2">
                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors"
                            title="Ver Código en GitHub"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}

                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
                          >
                            <span>Demo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {activeProjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-[#121217] border border-white/10 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveProjectModal(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="space-y-2 pr-8">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-950 border border-blue-800 text-blue-300 font-bold">
                    {activeProjectModal.category}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-400 font-medium">
                    Estado: {activeProjectModal.status}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-400 font-medium">
                    Año: {activeProjectModal.createdAt || '2025'}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {activeProjectModal.title}
                </h3>
              </div>

              {/* Gallery Image Display */}
              <div className="space-y-3">
                <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
                  <img
                    src={selectedModalImage || activeProjectModal.mainImage}
                    alt={activeProjectModal.title}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                </div>

                {/* Thumbnails */}
                {activeProjectModal.gallery.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {activeProjectModal.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedModalImage(img)}
                        className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          selectedModalImage === img ? 'border-blue-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">Descripción del Proyecto</h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {activeProjectModal.fullDescription || activeProjectModal.description}
                </p>
              </div>

              {/* Tech Stack Used */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">Tecnologías Utilizadas</h4>
                <div className="flex flex-wrap gap-2">
                  {activeProjectModal.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-zinc-900 text-zinc-200 text-xs font-semibold border border-zinc-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {activeProjectModal.liveUrl && (
                    <AnimatedButton
                      onClick={() => window.open(activeProjectModal.liveUrl, '_blank')}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-600/30"
                    >
                      <span>Visitar Sitio / Demo</span>
                      <ExternalLink className="w-4 h-4" />
                    </AnimatedButton>
                  )}

                  {activeProjectModal.repoUrl && (
                    <a
                      href={activeProjectModal.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      <span>Repositorio</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setActiveProjectModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium hover:bg-zinc-800"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

