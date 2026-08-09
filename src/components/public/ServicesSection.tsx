import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import {
  Wrench,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Tag,
  FileCheck,
  Send,
  X
} from 'lucide-react';
import {
  AnimatedSection,
  AnimatedTitle,
  AnimatedButton,
  StaggerContainer,
  StaggerItem
} from '../common/AnimatedSection';
import { TiltCard } from '../common/TiltCard';

export const ServicesSection: React.FC = () => {
  const { services, requestQuote } = useApp();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const handleQuoteService = (service: ServiceItem) => {
    setSelectedService(null);
    requestQuote({
      projectType: service.title,
      description: `Hola, me interesa contratar o cotizar el servicio de "${service.title}".`,
      estimatedBudget: service.startingPrice || '$15,000 - $30,000 MXN'
    });
    navigate('/calculadora');
  };

  return (
    <section id="servicios" className="py-20 bg-transparent border-t border-zinc-800/80 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <AnimatedSection variant="zoomIn" delay={0.05}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-blue-400 text-xs font-semibold">
              <Wrench className="w-3.5 h-3.5" />
              <span>Servicios Especializados</span>
            </div>
          </AnimatedSection>

          <AnimatedTitle delay={0.15}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Soluciones digitales de principio a fin
            </h2>
          </AnimatedTitle>

          <AnimatedSection variant="fadeUp" delay={0.25}>
            <p className="text-zinc-300 text-base sm:text-lg">
              Cubro cada etapa del desarrollo tecnológico para que tu empresa o proyecto cuente con herramientas modernas, seguras y escalables.
            </p>
          </AnimatedSection>
        </div>

        {/* Services Cards Grid with Stagger */}
        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <StaggerItem key={service.id} variant="up">
              <div
                className={`relative rounded-2xl bg-[#121215]/90 backdrop-blur-xl p-6 border flex flex-col justify-between h-full ${
                  service.popular
                    ? 'border-blue-500/80 shadow-md shadow-blue-500/10'
                    : 'border-zinc-800/90'
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Popular</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400">
                      <IconRenderer name={service.iconName} className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-snug">
                        {service.title}
                      </h3>
                      {service.startingPrice && (
                        <span className="text-xs font-semibold text-emerald-400">
                          Desde {service.startingPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  {/* Benefits List */}
                  <div className="pt-2 space-y-1.5">
                    {service.benefits.slice(0, 3).map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-6 mt-4 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-blue-600 hover:text-white text-zinc-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Más información</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-[#121215] border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <IconRenderer name={selectedService.iconName} className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">
                    {selectedService.title}
                  </h3>
                  <span className="text-xs text-blue-400 font-semibold">
                    Servicio Especializado
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-300 leading-relaxed">
                {selectedService.description}
              </p>

              {/* Price & Time Specs */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="space-y-1">
                  <div className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Inversión Estimada</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {selectedService.startingPrice || 'Consultar'}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Tiempo Estimado</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {selectedService.estimatedTime || 'A definir'}
                  </div>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Beneficios Principales
                </h4>
                <div className="space-y-2">
                  {selectedService.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              {selectedService.deliverables && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-blue-400" />
                    <span>Entregables Incluidos</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
                    {selectedService.deliverables.map((del, i) => (
                      <div key={i} className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 font-medium">
                        • {del}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-2 flex items-center gap-3">
                <AnimatedButton
                  onClick={() => handleQuoteService(selectedService)}
                  className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Solicitar Cotización de este Servicio</span>
                </AnimatedButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
