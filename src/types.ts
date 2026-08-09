export interface SiteSettings {
  developerName: string;
  title: string;
  bio: string;
  heroTitle: string;
  heroSubtitle: string;
  experienceYears: number;
  completedProjectsCount: number;
  satisfiedClientsCount: number;
  location: string;
  workingHours: string;
  email: string;
  phone: string;
  whatsapp: string;
  profilePhoto: string;
  cvUrl: string;
  socials: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  branding: {
    primaryColor: string;
    logoText: string;
    footerText: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: 'Web' | 'Móvil' | 'Sistema Admin' | 'eCommerce' | 'Dashboard' | 'API/Backend';
  mainImage: string;
  gallery: string[];
  videoUrl?: string;
  technologies: string[];
  status: 'Entregado' | 'En proceso' | 'Demo en vivo';
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface IdeaPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
  keyFeatures: string[];
  sampleMetrics: { label: string; value: string }[];
  previewType: 'corporate' | 'ecommerce' | 'admin' | 'mobile' | 'education' | 'crm' | 'booking' | 'inventory' | 'blog' | 'courses' | 'agenda' | 'portfolio' | 'landing';
  recommendedTech: string[];
  estimatedWeeks: string;
}

export interface QuoteRequest {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  projectType: string;
  estimatedBudget: string;
  description: string;
  estimatedDate: string;
  status: 'pendiente' | 'en_revision' | 'en_proceso' | 'finalizado';
  attachments?: string[];
  internalNotes?: string;
  createdAt: string;
  calculatedEstimate?: {
    complexityScore: number;
    estimatedWeeks: string;
    suggestedStack: string[];
  };
}

export interface Testimonial {
  id: string;
  name: string;
  roleOrCompany: string;
  photoUrl: string;
  projectName: string;
  comment: string;
  rating: number; // 1-5
  featured: boolean;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user' | 'cliente' | 'visitante';
  status: 'activo' | 'bloqueado' | 'pendiente';
  projectsCount?: number;
  registeredAt: string;
}

export interface ServiceItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
  benefits: string[];
  popular?: boolean;
  estimatedTime?: string;
  startingPrice?: string;
  deliverables?: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface TechStackItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Base de Datos' | 'Móvil' | 'Herramientas & IA';
  iconName: string;
  proficiency: number; // 1-100
  description: string;
}

export interface AnalyticsStats {
  totalVisits: number;
  monthlyVisits: number;
  quoteRequestsCount: number;
  conversionRate: number;
  deviceBreakdown: { device: string; percentage: number; count: number }[];
  countryBreakdown: { country: string; code: string; visits: number }[];
  mostViewedProjects: { projectId: string; title: string; views: number }[];
  monthlyTrend: { month: string; visits: number; leads: number }[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'nuevo' | 'leido' | 'respondido';
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
  projectId?: string;
  createdAt: string;
}
