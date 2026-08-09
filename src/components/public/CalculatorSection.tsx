import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calculator, Check, ArrowRight, Sparkles, Clock, DollarSign, Layers } from 'lucide-react';
import {
  AnimatedSection,
  AnimatedTitle,
  AnimatedButton,
  AnimatedProgressBar
} from '../common/AnimatedSection';
import { TiltCard } from '../common/TiltCard';
import { MagneticElement } from '../common/MagneticElement';

export const CalculatorSection: React.FC = () => {
  const { requestQuote } = useApp();

  const [projectType, setProjectType] = useState<string>('Sitio Corporativo');
  const [screensCount, setScreensCount] = useState<string>('4 - 8 Pantallas');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Diseño Responsive Adaptativo',
    'Formulario de Contacto Interactivo'
  ]);
  const [urgency, setUrgency] = useState<string>('Estándar');

  const availableFeatures = [
    'Diseño Responsive Adaptativo',
    'Formulario de Contacto Interactivo',
    'Autenticación de Usuarios (Login/Registro)',
    'Pasarela de Pagos (Stripe/PayPal/MercadoPago)',
    'Base de Datos en Tiempo Real',
    'PWA Instalable / Modo Offline',
    'Soporte Multidioma',
    'Notificaciones Automáticas por WhatsApp/Email',
    'Integración con Inteligencia Artificial'
  ];

  const toggleFeature = (feat: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  };

  // Calculation Logic in Pesos Mexicanos (MXN)
  const getCalculation = () => {
    let basePrice = 15000;
    let weeks = 2;

    if (projectType === 'Landing Page') { basePrice = 8000; weeks = 1; }
    else if (projectType === 'Sitio Corporativo') { basePrice = 15000; weeks = 2; }
    else if (projectType === 'Tienda en Línea (e-Commerce)') { basePrice = 25000; weeks = 3; }
    else if (projectType === 'Sistema Administrativo / SaaS') { basePrice = 32000; weeks = 4; }
    else if (projectType === 'Aplicación Móvil (iOS & Android)') { basePrice = 42000; weeks = 5; }

    if (screensCount === '9 - 15 Pantallas') { basePrice += 7000; weeks += 1; }
    else if (screensCount === 'Más de 15 Pantallas') { basePrice += 15000; weeks += 2; }

    basePrice += (selectedFeatures.length * 2500);

    if (urgency === 'Urgente (Semanas reducidas)') {
      basePrice *= 1.25;
      weeks = Math.max(1, Math.round(weeks * 0.7));
    }

    const minPrice = Math.round(basePrice * 0.9);
    const maxPrice = Math.round(basePrice * 1.2);

    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    });

    return {
      priceRange: `${formatter.format(minPrice)} - ${formatter.format(maxPrice)} MXN`,
      estimatedWeeks: `${weeks} a ${weeks + 1} Semanas`,
      complexityScore: Math.min(100, Math.round((basePrice / 50000) * 100))
    };
  };

  const calc = getCalculation();

  const handleUseEstimate = () => {
    requestQuote({
      projectType: projectType,
      estimatedBudget: calc.priceRange,
      description: `Estimación desde Calculadora:\n- Tipo: ${projectType}\n- Pantallas: ${screensCount}\n- Funciones: ${selectedFeatures.join(', ')}\n- Urgencia: ${urgency}\n- Estimación Calculada: ${calc.priceRange}`
    });
  };

  return (
    <section id="calculadora" className="py-20 bg-transparent border-t border-zinc-800/80 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <AnimatedSection variant="zoomIn" delay={0.05}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-blue-400 text-xs font-semibold">
              <Calculator className="w-3.5 h-3.5" />
              <span>Estimador Interactivo de Proyectos</span>
            </div>
          </AnimatedSection>

          <AnimatedTitle delay={0.15}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Calculadora de Proyecto Digital
            </h2>
          </AnimatedTitle>

          <AnimatedSection variant="fadeUp" delay={0.25}>
            <p className="text-zinc-300 text-base sm:text-lg">
              Selecciona las características que deseas en tu sistema para obtener una estimación aproximada de complejidad, tiempo de entrega e inversión.
            </p>
          </AnimatedSection>
        </div>

        {/* Calculator Interactive Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Options Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#121215] border border-zinc-800 shadow-lg space-y-6">
            {/* 1. Tipo de Proyecto */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white block">
                1. Tipo de Solución
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Landing Page',
                  'Sitio Corporativo',
                  'Tienda en Línea (e-Commerce)',
                  'Sistema Administrativo / SaaS',
                  'Aplicación Móvil (iOS & Android)'
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setProjectType(type)}
                    className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all ${
                      projectType === type
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Número de Pantallas */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white block">
                2. Extensión / Número de Pantallas Vistas
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['1 - 3 Pantallas', '4 - 8 Pantallas', '9 - 15 Pantallas', 'Más de 15 Pantallas'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setScreensCount(num)}
                    className={`p-2.5 rounded-xl text-center text-xs font-medium border transition-all ${
                      screensCount === num
                        ? 'bg-blue-600 text-white border-blue-600 font-bold'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Funcionalidades Requeridas */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white block">
                3. Módulos & Funcionalidades
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableFeatures.map((feat) => {
                  const isChecked = selectedFeatures.includes(feat);
                  return (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => toggleFeature(feat)}
                      className={`p-3 rounded-xl text-left text-xs font-medium border flex items-center justify-between gap-2 transition-all ${
                        isChecked
                          ? 'bg-blue-950/60 border-blue-500 text-blue-200 font-bold'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      <span>{feat}</span>
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 ${
                        isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-zinc-700'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Urgencia */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white block">
                4. Tiempo de Entrega Requerido
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Estándar', 'Urgente (Semanas reducidas)'].map((urg) => (
                  <button
                    key={urg}
                    type="button"
                    onClick={() => setUrgency(urg)}
                    className={`p-3 rounded-xl text-center text-xs font-semibold border transition-all ${
                      urgency === urg
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                    }`}
                  >
                    {urg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Card Column */}
          <div className="lg:col-span-5 space-y-6">
            <TiltCard className="p-6 sm:p-8 rounded-3xl bg-zinc-950/90 backdrop-blur-xl text-white border border-zinc-800 hover:border-blue-500/50 shadow-2xl space-y-6 relative overflow-hidden transition-colors">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-sm">Resumen de Estimación</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                  Calculado
                </span>
              </div>

              {/* Price Estimate */}
              <div className="space-y-1">
                <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Inversión Estimada Aprox:</span>
                </div>
                <div className="text-3xl font-extrabold text-emerald-400">
                  {calc.priceRange}
                </div>
                <div className="text-[10px] text-zinc-500">
                  *Ajustable en base a especificaciones finales
                </div>
              </div>

              {/* Time Estimate */}
              <div className="space-y-1">
                <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Plazo Estimado de Entrega:</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {calc.estimatedWeeks}
                </div>
              </div>

              {/* Complexity Meter */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-400">Nivel de Complejidad Técnica:</span>
                  <span className="text-blue-400 font-mono">{calc.complexityScore}%</span>
                </div>
                <AnimatedProgressBar percentage={calc.complexityScore} colorClass="bg-gradient-to-r from-blue-500 to-indigo-500" />
              </div>

              {/* Summary List */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs text-zinc-300">
                <div>• <strong>Tipo:</strong> {projectType}</div>
                <div>• <strong>Pantallas:</strong> {screensCount}</div>
                <div>• <strong>Funciones ({selectedFeatures.length}):</strong> {selectedFeatures.join(', ')}</div>
              </div>

              {/* CTA Button */}
              <MagneticElement className="w-full">
                <AnimatedButton
                  onClick={handleUseEstimate}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 group transition-all"
                >
                  <span>Usar esta Estimación en la Cotización</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </AnimatedButton>
              </MagneticElement>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};
