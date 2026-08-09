import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { techStackList } from '../../data/initialData';
import { IconRenderer } from '../common/IconRenderer';
import { Code } from 'lucide-react';
import {
  AnimatedSection,
  AnimatedTitle,
  StaggerContainer,
  StaggerItem,
  AnimatedIcon
} from '../common/AnimatedSection';
import { TiltCard } from '../common/TiltCard';

export const TechStackSection: React.FC = () => {
  const { techStack } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('Todas');

  const categories = ['Todas', 'Frontend', 'Backend', 'Base de Datos', 'Herramientas & IA'];
  const currentTechList = techStack && techStack.length > 0 ? techStack : techStackList;

  const filteredTech = activeCategory === 'Todas'
    ? currentTechList
    : currentTechList.filter(t => t.category === activeCategory);

  return (
    <section id="tecnologias" className="py-20 bg-[#09090b]/60 backdrop-blur-sm border-t border-zinc-800/80 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <AnimatedSection variant="zoomIn" delay={0.05}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-blue-400 text-xs font-semibold">
              <Code className="w-3.5 h-3.5" />
              <span>Stack de Desarrollo de Última Generación</span>
            </div>
          </AnimatedSection>

          <AnimatedTitle delay={0.15}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tecnologías y herramientas que domino
            </h2>
          </AnimatedTitle>

          <AnimatedSection variant="fadeUp" delay={0.25}>
            <p className="text-zinc-300 text-base sm:text-lg">
              Utilizo los marcos de trabajo y lenguajes más modernos del mercado para garantizar velocidad, seguridad y escalabilidad en cada proyecto.
            </p>
          </AnimatedSection>
        </div>

        {/* Categories Pills */}
        <AnimatedSection variant="scaleIn" delay={0.3} className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </AnimatedSection>

        {/* Tech Grid with Stagger */}
        <StaggerContainer key={activeCategory} staggerDelay={0.05} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredTech.map((tech) => (
            <StaggerItem key={tech.name} variant="scale">
              <div className="p-4 rounded-2xl bg-[#121215]/90 backdrop-blur-xl border border-zinc-800/80 text-center space-y-2 flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400">
                  <IconRenderer name={tech.iconName} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {tech.name}
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {tech.category}
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
