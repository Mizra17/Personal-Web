import React from 'react';
import { AboutSection } from '../components/public/AboutSection';
import { TestimonialsSection } from '../components/public/TestimonialsSection';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-4 pb-12 space-y-8">
      <AboutSection />
      <TestimonialsSection />
    </div>
  );
};
