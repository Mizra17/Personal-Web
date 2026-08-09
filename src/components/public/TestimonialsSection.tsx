import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Star, Quote } from 'lucide-react';
import {
  AnimatedSection,
  AnimatedTitle,
  StaggerContainer,
  StaggerItem
} from '../common/AnimatedSection';
import { TiltCard } from '../common/TiltCard';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useApp();

  const featuredTestimonials = testimonials.filter(t => t.featured);

  return (
    <section className="py-20 bg-[#09090b]/60 backdrop-blur-sm border-t border-zinc-800/80 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <AnimatedSection variant="zoomIn" delay={0.05}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-blue-400 text-xs font-semibold">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>Opiniones & Experiencias de Clientes</span>
            </div>
          </AnimatedSection>

          <AnimatedTitle delay={0.15}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Lo que dicen quienes han trabajado conmigo
            </h2>
          </AnimatedTitle>

          <AnimatedSection variant="fadeUp" delay={0.25}>
            <p className="text-zinc-300 text-base sm:text-lg">
              La mejor garantía de calidad es la satisfacción de las empresas y emprendedores que confían en mis servicios.
            </p>
          </AnimatedSection>
        </div>

        {/* Testimonials Grid */}
        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(featuredTestimonials.length > 0 ? featuredTestimonials : testimonials).map((item) => (
            <StaggerItem key={item.id} variant="up">
              <div
                className="p-8 rounded-3xl bg-[#121215]/90 backdrop-blur-xl border border-zinc-800/80 shadow-md flex flex-col justify-between space-y-6 relative h-full"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-zinc-800 pointer-events-none" />

                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-zinc-300 leading-relaxed italic">
                    "{item.comment}"
                  </p>
                </div>

                {/* Author Footer */}
                <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
                  <img
                    src={item.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {item.name}
                    </h3>
                    <p className="text-xs text-blue-400 font-medium">
                      {item.roleOrCompany}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      Proyecto: {item.projectName}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
