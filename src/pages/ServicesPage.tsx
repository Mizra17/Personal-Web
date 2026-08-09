import React from 'react';
import { ServicesSection } from '../components/public/ServicesSection';
import { BenefitsSection } from '../components/public/BenefitsSection';

export const ServicesPage: React.FC = () => {
  return (
    <div className="pt-4 pb-12 space-y-8">
      <ServicesSection />
      <BenefitsSection />
    </div>
  );
};
