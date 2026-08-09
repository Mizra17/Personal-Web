import React from 'react';
import { benefitsList } from '../../data/initialData';
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  AnimatedSection,
  AnimatedTitle,
  AnimatedIcon,
  StaggerContainer,
  StaggerItem
} from '../common/AnimatedSection';
import { TiltCard } from '../common/TiltCard';

export const BenefitsSection: React.FC = () => {
  return (
    <section className="py-20 bg-transparent border-t border-zinc-800/80 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <AnimatedSection variant="zoomIn" delay={0.05}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-blue-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ventaja Competitiva</span>
            </div>
          </AnimatedSection>

          <AnimatedTitle delay={0.15}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ¿Por qué trabajar conmigo?
            </h2>
          </AnimatedTitle>

          <AnimatedSection variant="fadeUp" delay={0.25}>
            <p className="text-zinc-300 text-base sm:text-lg">
              Garantizo valor tangible para tu inversión a través de mejores prácticas de ingeniería de software y un servicio de excelencia.
            </p>
          </AnimatedSection>
        </div>

        {/* Benefits Grid */}
        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {benefitsList.map((item, index) => (
            <StaggerItem key={index} variant="up">
              <div className="p-5 rounded-2xl bg-[#121215]/90 backdrop-blur-xl border border-zinc-800/80 space-y-2 flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 text-blue-400 flex items-center justify-center font-extrabold text-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
