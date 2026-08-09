import {
  SiteSettings,
  Project,
  IdeaPreset,
  QuoteRequest,
  Testimonial,
  UserAccount,
  ServiceItem,
  FAQItem,
  TechStackItem,
  AnalyticsStats,
  ContactMessage,
  GalleryItem
} from '../types';

export const initialSettings: SiteSettings = {
  developerName: 'Mizrahim Web',
  title: 'Full Stack Software Engineer & Cloud Architect',
  bio: 'Desarrollador de software apasionado por crear aplicaciones web modernas, rápidas y escalables con IA y arquitecturas Cloud.',
  heroTitle: 'Transformo ideas en soluciones digitales.',
  heroSubtitle: 'Desarrollo páginas web, aplicaciones y sistemas modernos que convierten ideas en proyectos reales.',
  experienceYears: 5,
  completedProjectsCount: 0,
  satisfiedClientsCount: 0,
  location: 'Ciudad de México, México',
  workingHours: 'Lunes a Viernes: 09:00 AM - 06:00 PM',
  email: 'contacto@mizrahimweb.com',
  phone: '+52 55 1234 5678',
  whatsapp: '525512345678',
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  cvUrl: '#',
  socials: {
    linkedin: 'https://linkedin.com',
    github: 'https://github.com'
  },
  branding: {
    primaryColor: '#2563eb',
    logoText: 'Mizrahim Web',
    footerText: `© ${new Date().getFullYear()} Mizrahim Web. Todos los derechos reservados.`
  }
};

export const initialProjects: Project[] = [
  {
    id: 'proj-gourmetpos',
    title: 'GourmetPOS - Sistema de Gestión para Restaurantes',
    description: 'Sistema integral para restaurantes con comandas en tiempo real, control de inventario de insumos, gestión de mesas y reportes de ventas.',
    fullDescription: 'GourmetPOS es una solución web de alto rendimiento diseñada para la industria gastronómica. Permite a los meseros tomar pedidos directamente desde tablets o teléfonos, sincronizando la cocina al instante. Incluye panel de control para administradores con gráficos de ventas, corte de caja diario, facturación electrónica y módulo de inventarios con alertas de insumos bajos.',
    category: 'Sistema Admin',
    mainImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000'
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS'],
    status: 'Entregado',
    liveUrl: 'https://gourmetpos-demo.com',
    repoUrl: 'https://github.com/mizrahimweb/gourmetpos',
    featured: true,
    order: 1,
    createdAt: '2025'
  },
  {
    id: 'proj-auramarket',
    title: 'AuraMarket - Tienda en Línea & eCommerce',
    description: 'Plataforma de comercio electrónico de alta conversión con catálogo dinámico, carrito interactivo, pasarela de pagos y gestión de envíos.',
    fullDescription: 'AuraMarket es una tienda en línea moderna optimizada para máxima conversión y velocidad. Implementa un diseño ultra responsivo, búsquedas instantáneas con filtros dinámicos, pasarela de pagos en línea, generación automatizada de guías de envío y panel de administración completo para gestionar productos, pedidos y cupones de descuento.',
    category: 'eCommerce',
    mainImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Node.js'],
    status: 'En proceso',
    liveUrl: 'https://auramarket-demo.com',
    repoUrl: 'https://github.com/mizrahimweb/auramarket',
    featured: true,
    order: 2,
    createdAt: '2025'
  },
  {
    id: 'proj-erpenterprise',
    title: 'ERP Enterprise - Dashboard & Gestión Empresarial',
    description: 'Sistema ERP corporativo para administración de nómina, seguimiento de clientes CRM, métricas financieras y automatización de procesos.',
    fullDescription: 'ERP Enterprise es un ecosistema administrativo empresarial diseñado para corporativos. Ofrece tableros analíticos interactivos en tiempo real con D3/Recharts, módulo CRM para seguimiento de oportunidades comerciales, control de nómina y facturación, gestión documental segura y asignación de permisos por roles de usuario.',
    category: 'Dashboard',
    mainImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000'
    ],
    technologies: ['React', 'TypeScript', 'Express', 'PostgreSQL', 'Tailwind CSS', 'Firebase'],
    status: 'Entregado',
    liveUrl: 'https://erpenterprise-demo.com',
    repoUrl: 'https://github.com/mizrahimweb/erp-enterprise',
    featured: true,
    order: 3,
    createdAt: '2026'
  },
  {
    id: 'proj-taskflowpro',
    title: 'TaskFlow Pro - App Móvil de Productividad',
    description: 'Aplicación de productividad para gestión de proyectos, hábitos y metas diarias con temporizador Pomodoro y sincronización en la nube.',
    fullDescription: 'TaskFlow Pro ayuda a profesionales y equipos a organizar sus proyectos diarios. Integra un organizador Kanban intuitivo, temporizador Pomodoro integrado con estadísticas de enfoque, recordatorios automatizados, seguimiento de hábitos acumulativos y modo offline con sincronización en tiempo real.',
    category: 'Móvil',
    mainImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=1000'
    ],
    technologies: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS', 'Vite'],
    status: 'Demo en vivo',
    liveUrl: 'https://taskflowpro-demo.com',
    repoUrl: 'https://github.com/mizrahimweb/taskflow-pro',
    featured: true,
    order: 4,
    createdAt: '2025'
  },
  {
    id: 'proj-devfoliopro',
    title: 'DevFolio Pro - Plataforma Web para Portafolio Profesional',
    description: 'Plataforma web profesional para desarrolladores y creativos con sistema interactivo de cotizaciones y panel de control de clientes.',
    fullDescription: 'DevFolio Pro es una solución web de marca personal que combina un portafolio de alto impacto estético con herramientas de negocio. Cuenta con una calculadora interactiva de presupuestos en pesos mexicanos, portal privado para clientes con seguimiento de proyectos en tiempo real, blog integrado y panel de administración para edición de contenido.',
    category: 'Web',
    mainImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000'
    ],
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase'],
    status: 'En proceso',
    liveUrl: 'https://devfoliopro-demo.com',
    repoUrl: 'https://github.com/mizrahimweb/devfolio-pro',
    featured: true,
    order: 5,
    createdAt: '2026'
  }
];

export const initialIdeas: IdeaPreset[] = [];
export const initialQuoteRequests: QuoteRequest[] = [];
export const initialTestimonials: Testimonial[] = [];
export const initialUsers: UserAccount[] = [];
export const initialServices: ServiceItem[] = [];
export const initialMessages: ContactMessage[] = [];
export const initialGallery: GalleryItem[] = [];

export const techStackList: TechStackItem[] = [
  // Frontend
  { name: 'HTML5', category: 'Frontend', iconName: 'Code2', proficiency: 98, description: 'Estructuración semántica moderna y estándar W3C' },
  { name: 'CSS3', category: 'Frontend', iconName: 'Palette', proficiency: 95, description: 'Estilos avanzados, animaciones y diseño adaptable' },
  { name: 'JavaScript', category: 'Frontend', iconName: 'Terminal', proficiency: 95, description: 'Desarrollo dinámico, ES6+ y lógica asíncrona' },
  { name: 'TypeScript', category: 'Frontend', iconName: 'Code', proficiency: 92, description: 'Tipado estático y arquitectura segura a gran escala' },
  { name: 'React', category: 'Frontend', iconName: 'Atom', proficiency: 95, description: 'Creación de interfaces interactivas y componentes reusables' },
  { name: 'Vite', category: 'Frontend', iconName: 'Zap', proficiency: 90, description: 'Entorno de compilación ultra rápido y empaquetado optimizado' },
  { name: 'Tailwind CSS', category: 'Frontend', iconName: 'Layers', proficiency: 98, description: 'Diseño ultra responsivo con utilidades CSS modernas' },

  // Backend
  { name: 'Node.js', category: 'Backend', iconName: 'Server', proficiency: 90, description: 'Entorno de ejecución backend no bloqueante e I/O de alto rendimiento' },
  { name: 'Express', category: 'Backend', iconName: 'Cpu', proficiency: 88, description: 'Creación de APIs RESTful robustas y microservicios escalables' },

  // Base de datos
  { name: 'PostgreSQL', category: 'Base de Datos', iconName: 'Database', proficiency: 85, description: 'Base de datos relacional avanzada y modelado de datos complejo' },
  { name: 'Supabase', category: 'Base de Datos', iconName: 'Zap', proficiency: 92, description: 'BaaS con autenticación, base de datos en tiempo real y RLS' },
  { name: 'Firebase', category: 'Base de Datos', iconName: 'Flame', proficiency: 88, description: 'Firestore, autenticación y servicios cloud integrados' },

  // Herramientas
  { name: 'Git', category: 'Herramientas & IA', iconName: 'GitBranch', proficiency: 92, description: 'Control de versiones distribuido y gestión de ramas' },
  { name: 'GitHub', category: 'Herramientas & IA', iconName: 'Github', proficiency: 92, description: 'Colaboración de código, CI/CD y despliegues automatizados' },
  { name: 'Visual Studio Code', category: 'Herramientas & IA', iconName: 'Monitor', proficiency: 95, description: 'IDE principal configurado con extensiones de desarrollo avanzadas' },
  { name: 'Figma', category: 'Herramientas & IA', iconName: 'Layout', proficiency: 85, description: 'Diseño de interfaces UI/UX, prototipado y maquetación de pantallas' }
];

export const faqsList: FAQItem[] = [];
export const faqList: FAQItem[] = [];

export const benefitsList = [
  { title: 'Código Limpio', desc: 'Arquitectura escalable y mantenible', description: 'Arquitectura escalable y mantenible' },
  { title: 'Diseño Moderno', desc: 'Interfaces intuitivas y responsivas', description: 'Interfaces intuitivas y responsivas' },
  { title: 'Seguridad First', desc: 'Protección de datos y autenticación RLS', description: 'Protección de datos y autenticación RLS' },
  { title: 'Rendimiento Óptimo', desc: 'Tiempos de carga ultra rápidos', description: 'Tiempos de carga ultra rápidos' },
  { title: 'Soporte Continuo', desc: 'Acompañamiento post-entrega', description: 'Acompañamiento post-entrega' }
];

export const processSteps = [
  { step: '01', title: 'Toma de Requerimientos', desc: 'Analizamos tus necesidades e ideas', description: 'Analizamos tus necesidades e ideas' },
  { step: '02', title: 'Diseño & Prototipado', desc: 'Definimos la arquitectura e interfaz', description: 'Definimos la arquitectura e interfaz' },
  { step: '03', title: 'Desarrollo Frontend & Backend', desc: 'Escribimos el código de producción', description: 'Escribimos el código de producción' },
  { step: '04', title: 'Pruebas & Optimización', desc: 'Aseguramos la máxima calidad y seguridad', description: 'Aseguramos la máxima calidad y seguridad' },
  { step: '05', title: 'Despliegue & Producción', desc: 'Lanzamos tu solución al mercado', description: 'Lanzamos tu solución al mercado' }
];

export const initialAnalytics: AnalyticsStats = {
  totalVisits: 0,
  monthlyVisits: 0,
  quoteRequestsCount: 0,
  conversionRate: 0,
  deviceBreakdown: [],
  countryBreakdown: [],
  mostViewedProjects: [],
  monthlyTrend: []
};
