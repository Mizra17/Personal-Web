import React from 'react';
import { processSteps } from '../../data/initialData';
import { GitCommit, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  AnimatedSection,
  AnimatedTitle,
  StaggerContainer,
  StaggerItem
} from '../common/AnimatedSection';
import { TiltCard } from '../common/TiltCard';

export const ProcessSection: React.FC = () => {
  return (
    <section id="proceso" className="py-20 bg-[#09090b]/70 backdrop-blur-sm border-t border-zinc-800/80 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <AnimatedSection variant="zoomIn" delay={0.05}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-blue-400 text-xs font-semibold">
              <GitCommit className="w-3.5 h-3.5" />
              <span>Metodología de Trabajo Transparente</span>
            </div>
          </AnimatedSection>

          <AnimatedTitle delay={0.15}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Paso a paso hacia el éxito de tu proyecto
            </h2>
          </AnimatedTitle>

          <AnimatedSection variant="fadeUp" delay={0.25}>
            <p className="text-zinc-300 text-base sm:text-lg">
              Sigo un proceso claro y estructurado de 7 pasos para asegurar que tu idea se convierta en una realidad digital sin sorpresas.
            </p>
          </AnimatedSection>
        </div>

        {/* Timeline Grid */}
        <div className="relative max-w-6xl mx-auto w-full">
          {/* Vertical Center Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-emerald-500 -translate-x-1/2"></div>

          <StaggerContainer staggerDelay={0.12} className="space-y-8 md:space-y-12">
            {processSteps.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <StaggerItem key={item.step} variant={isEven ? 'slideRight' : 'up'}>
                  <div
                    className={`relative flex flex-col md:flex-row items-center gap-8 ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Step Content Card */}
                    <div className="w-full md:w-1/2">
                      <div className="p-6 rounded-3xl bg-[#121215]/90 backdrop-blur-xl border border-zinc-800 shadow-md space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-blue-600/30">
                            0{item.step}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                            Etapa {item.step} de 7
                          </span>
                        </div>

                        <h3 className="text-xl font-extrabold text-white">
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Circle Badge in Center */}
                    <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex w-10 h-10 rounded-full bg-blue-600 border-4 border-[#09090b] text-white items-center justify-center text-xs font-extrabold shadow-lg z-10">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>

                    {/* Empty Spacer Column for layout symmetry */}
                    <div className="hidden md:block w-1/2"></div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
};
