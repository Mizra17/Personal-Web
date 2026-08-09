import React from 'react';
import { HeroSection } from '../components/public/HeroSection';
import { AboutSection } from '../components/public/AboutSection';
import { ServicesSection } from '../components/public/ServicesSection';
import { PortfolioSection } from '../components/public/PortfolioSection';
import { ContactSection } from '../components/public/ContactSection';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <ContactSection />
    </div>
  );
};
