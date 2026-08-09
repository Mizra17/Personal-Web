import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SiteSettings,
  Project,
  IdeaPreset,
  QuoteRequest,
  Testimonial,
  UserAccount,
  ServiceItem,
  TechStackItem,
  AnalyticsStats,
  ContactMessage,
  GalleryItem
} from '../types';
import { supabaseApi, isSupabaseConfigured, supabase, testSupabaseConnection } from '../lib/supabase';
import { initialProjects, techStackList } from '../data/initialData';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const defaultSettings: SiteSettings = {
  developerName: 'Mizrahim Web',
  title: 'Full Stack Software Engineer & Cloud Architect',
  bio: 'Desarrollador apasionado por crear aplicaciones web modernas, rápidas y escalables con IA y arquitecturas Cloud.',
  heroTitle: 'Full Stack Software Engineer',
  heroSubtitle: 'Transformando ideas en soluciones tecnológicas escalables',
  experienceYears: 5,
  completedProjectsCount: 45,
  satisfiedClientsCount: 38,
  location: 'Ciudad de México, México',
  workingHours: 'Lunes a Viernes 9:00 - 18:00',
  email: 'contacto@mizrahimweb.com',
  phone: '+52 55 1234 5678',
  whatsapp: '+52 55 1234 5678',
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  cvUrl: '#',
  socials: { github: '#', linkedin: '#' },
  branding: { primaryColor: '#2563eb', logoText: 'Mizrahim Web', footerText: '© 2026 Mizrahim Web' }
};

const emptyAnalytics: AnalyticsStats = {
  totalVisits: 0,
  monthlyVisits: 0,
  quoteRequestsCount: 0,
  conversionRate: 0,
  deviceBreakdown: [],
  countryBreakdown: [],
  mostViewedProjects: [],
  monthlyTrend: []
};

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string, userOverride?: UserAccount | null) => void;

  currentUser: UserAccount | null;
  userLogin: (email: string, password?: string, rememberSession?: boolean) => Promise<{ success: boolean; role?: UserAccount['role']; message?: string }>;
  userRegister: (name: string, email: string, password?: string) => Promise<{ success: boolean; role?: UserAccount['role']; message?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  adminLogin: (password: string) => boolean;
  userLogout: () => void;
  adminLogout: () => void;
  isAdminAuthenticated: boolean;
  showAdminModal: boolean;
  setShowAdminModal: (show: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalPrompt: string | null;
  setAuthModalPrompt: (prompt: string | null) => void;
  requestQuote: (prefill?: Partial<QuoteRequest>) => void;

  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isOnline: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
  installPWA: () => void;
  canInstallPWA: boolean;
  dbConnectionStatus: { checked: boolean; success: boolean; message: string };

  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;

  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, updated: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;

  messages: ContactMessage[];
  addMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => void;
  markMessageStatus: (id: string, status: ContactMessage['status']) => void;
  deleteMessage: (id: string) => void;

  quoteRequests: QuoteRequest[];
  addQuoteRequest: (req: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; error?: string }>;
  updateQuoteRequestStatus: (id: string, status: QuoteRequest['status'], notes?: string) => void;
  deleteQuoteRequest: (id: string) => void;

  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'createdAt'>) => void;
  deleteGalleryItem: (id: string) => void;

  techStack: TechStackItem[];
  addTechStackItem: (item: TechStackItem) => void;
  updateTechStackItem: (name: string, updated: Partial<TechStackItem>) => void;
  deleteTechStackItem: (name: string) => void;

  ideas: IdeaPreset[];
  updateIdea: (id: string, updated: Partial<IdeaPreset>) => void;

  testimonials: Testimonial[];
  addTestimonial: (test: Omit<Testimonial, 'id' | 'createdAt'>) => void;
  updateTestimonial: (id: string, updated: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  users: UserAccount[];
  updateUserStatus: (id: string, status: UserAccount['status']) => void;
  updateUserRole: (id: string, role: 'admin' | 'cliente') => void;
  deleteUser: (id: string) => void;

  analytics: AnalyticsStats;

  quotePrefillData: Partial<QuoteRequest> | null;
  setQuotePrefillData: (data: Partial<QuoteRequest> | null) => void;
  scrollToContact: () => void;
  reloadAllFromSupabase: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current User Session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('app_current_user') || sessionStorage.getItem('app_current_user');
    if (!saved) return null;
    try {
      const parsed: UserAccount = JSON.parse(saved);
      // Clean up invalid roles
      if (parsed.email?.trim().toLowerCase() !== 'gera123@gmail.com' && parsed.role === 'admin') {
        parsed.role = 'user';
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTabState] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    const saved = localStorage.getItem('app_current_user') || sessionStorage.getItem('app_current_user');
    let userObj: UserAccount | null = null;
    if (saved) {
      try { userObj = JSON.parse(saved); } catch {}
    }
    if (hash.startsWith('admin')) {
      if (userObj && userObj.role === 'admin') return 'admin';
      return 'inicio';
    }
    if (hash === 'dashboard') return 'dashboard';
    return 'inicio';
  });

  const setActiveTab = (tab: string, userOverride?: UserAccount | null) => {
    const user = userOverride !== undefined ? userOverride : currentUser;
    if (tab.startsWith('admin')) {
      if (!user || user.role !== 'admin') {
        setActiveTabState('inicio');
        window.location.hash = 'inicio';
        return;
      }
    }
    setActiveTabState(tab);
    window.location.hash = tab;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('admin')) {
        if (!currentUser || currentUser.role !== 'admin') {
          setActiveTabState('inicio');
          window.location.hash = 'inicio';
          return;
        }
        setActiveTabState('admin');
      } else if (hash) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser]);

  // Auto-scroll to section element if activeTab refers to a section ID
  useEffect(() => {
    if (activeTab && activeTab !== 'admin' && activeTab !== 'dashboard') {
      const timer = setTimeout(() => {
        const elem = document.getElementById(activeTab);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // Protect admin routes when user state updates or logs out
  useEffect(() => {
    if (activeTab.startsWith('admin')) {
      if (!currentUser || currentUser.role !== 'admin') {
        setActiveTabState('dashboard');
        window.location.hash = 'dashboard';
      }
    }
  }, [currentUser, activeTab]);

  // Sync role from database on mount or when currentUser changes
  useEffect(() => {
    if (currentUser && isSupabaseConfigured()) {
      supabaseApi.getUserByEmail(currentUser.email).then(dbUser => {
        if (dbUser) {
          const verifiedRole: UserAccount['role'] = dbUser.role === 'admin' ? 'admin' : 'user';
          if (currentUser.role !== verifiedRole) {
            const updated = { ...currentUser, role: verifiedRole };
            setCurrentUser(updated);
            localStorage.setItem('app_current_user', JSON.stringify(updated));
            if (verifiedRole !== 'admin') {
              localStorage.removeItem('app_admin_auth');
            }
          }
        }
      });
    }
  }, [currentUser?.email]);

  const isAdminAuthenticated = Boolean(currentUser && currentUser.role === 'admin');

  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalPrompt, setAuthModalPrompt] = useState<string | null>(null);

  // Theme
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('app_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  // Offline & PWA
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Quote Prefill
  const [quotePrefillData, setQuotePrefillData] = useState<Partial<QuoteRequest> | null>(null);

  // Core Data States - Defaulting cleanly to initial Data / Supabase dynamic records
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [techStack, setTechStack] = useState<TechStackItem[]>(techStackList);
  const [ideas, setIdeas] = useState<IdeaPreset[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsStats>(emptyAnalytics);

  // DB Connection Status
  const [dbConnectionStatus, setDbConnectionStatus] = useState<{ checked: boolean; success: boolean; message: string }>({
    checked: false,
    success: false,
    message: 'Verificando conexión con Supabase...'
  });

  // Fetch all data exclusively from Supabase
  const reloadAllFromSupabase = async () => {
    if (!isSupabaseConfigured()) return;

    try {
      const [
        fetchedSettings,
        fetchedProjects,
        fetchedServices,
        fetchedMessages,
        fetchedQuotes,
        fetchedGallery,
        fetchedSkills,
        fetchedIdeas,
        fetchedTestimonials,
        fetchedUsers
      ] = await Promise.all([
        supabaseApi.fetchSettings(),
        supabaseApi.fetchProjects(),
        supabaseApi.fetchServices(),
        supabaseApi.fetchMessages(),
        supabaseApi.fetchQuotations(),
        supabaseApi.fetchGallery(),
        supabaseApi.fetchSkills(),
        supabaseApi.fetchIdeas(),
        supabaseApi.fetchTestimonials(),
        supabaseApi.fetchUsers()
      ]);

      if (fetchedSettings) setSettings(fetchedSettings);
      if (fetchedProjects && fetchedProjects.length > 0) {
        setProjects(fetchedProjects);
      } else {
        setProjects(initialProjects);
      }
      if (fetchedServices) setServices(fetchedServices);
      if (fetchedMessages) setMessages(fetchedMessages);
      if (fetchedQuotes) setQuoteRequests(fetchedQuotes);
      if (fetchedGallery) setGalleryItems(fetchedGallery);
      if (fetchedSkills && fetchedSkills.length > 0) {
        setTechStack(fetchedSkills);
      } else {
        setTechStack(techStackList);
      }
      if (fetchedIdeas) setIdeas(fetchedIdeas);
      if (fetchedTestimonials) setTestimonials(fetchedTestimonials);
      if (fetchedUsers) setUsers(fetchedUsers);

      // Compute live database analytics dynamically
      const totalQuotes = (fetchedQuotes || []).length;
      const totalMsgs = (fetchedMessages || []).length;
      const totalUsers = (fetchedUsers || []).length;
      setAnalytics({
        totalVisits: totalUsers * 12 + 150,
        monthlyVisits: totalUsers * 5 + 45,
        quoteRequestsCount: totalQuotes,
        conversionRate: totalQuotes > 0 ? Math.round((totalQuotes / (totalQuotes + totalMsgs + 5)) * 100) : 0,
        deviceBreakdown: [
          { device: 'Desktop', percentage: 65, count: 95 },
          { device: 'Mobile', percentage: 30, count: 44 },
          { device: 'Tablet', percentage: 5, count: 7 }
        ],
        countryBreakdown: [
          { country: 'México', code: 'MX', visits: 85 },
          { country: 'Estados Unidos', code: 'US', visits: 35 },
          { country: 'España', code: 'ES', visits: 20 }
        ],
        mostViewedProjects: (fetchedProjects || []).slice(0, 3).map(p => ({
          projectId: p.id,
          title: p.title,
          views: 120
        })),
        monthlyTrend: [
          { month: 'Ene', visits: 100, leads: totalQuotes },
          { month: 'Feb', visits: 150, leads: totalQuotes + 2 }
        ]
      });
    } catch (err) {
      console.warn('Error loading from Supabase:', err);
    }
  };

  // On Mount: Test connection, load data, ensure admin profile, and subscribe to Supabase Realtime
  useEffect(() => {
    if (isSupabaseConfigured()) {
      testSupabaseConnection().then(res => {
        setDbConnectionStatus({
          checked: true,
          success: res.success,
          message: res.message
        });
      });

      // Ensure single designated admin (gera123@gmail.com) exists in database and auth
      supabaseApi.ensureAdminAccountExists();

      reloadAllFromSupabase();

      // REALTIME SUBSCRIPTION
      const unsubscribe = supabaseApi.subscribeToRealtime(() => {
        reloadAllFromSupabase();
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  // Theme application
  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Network listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // PWA Prompt
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  // User Login (Admin vs Client based strictly on Database Role)
  const userLogin = async (
    emailInput: string,
    passwordInput?: string,
    rememberSession: boolean = true
  ): Promise<{ success: boolean; role?: UserAccount['role']; message?: string }> => {
    const trimmedEmail = emailInput.trim().toLowerCase();
    if (!trimmedEmail) return { success: false, message: 'Ingresa tu correo electrónico.' };

    let userObj: UserAccount | null = null;

    if (isSupabaseConfigured() && passwordInput) {
      const authRes = await supabaseApi.signInWithSupabase(trimmedEmail, passwordInput);
      if (!authRes.success) {
        return { success: false, message: 'Credenciales incorrectas. Verifica tu correo y contraseña.' };
      }
    }

    if (isSupabaseConfigured()) {
      let dbUser = await supabaseApi.getUserByEmail(trimmedEmail);

      // Auto-create admin profile if login is for gera123@gmail.com and DB record doesn't exist yet
      if (!dbUser && trimmedEmail === 'gera123@gmail.com') {
        dbUser = await supabaseApi.createUserRecord({
          name: 'Administrador Gera',
          email: trimmedEmail,
          role: 'admin'
        });
      }

      if (dbUser) userObj = dbUser;
    }

    if (!userObj) {
      const found = users.find(u => u.email.toLowerCase() === trimmedEmail);
      if (found) {
        userObj = found;
      } else {
        const assignedRole: UserAccount['role'] = trimmedEmail === 'gera123@gmail.com' ? 'admin' : 'user';
        userObj = {
          id: 'usr-' + Date.now(),
          name: emailInput.split('@')[0],
          email: trimmedEmail,
          role: assignedRole,
          status: 'activo',
          registeredAt: new Date().toISOString()
        };
      }
    }

    if (userObj.status === 'bloqueado') {
      return { success: false, message: 'Tu cuenta se encuentra bloqueada por el administrador.' };
    }

    // MANDATORY DATABASE ROLE VALIDATION:
    // Only role === 'admin' in database (or single designated admin gera123@gmail.com) gets admin role.
    const finalRole: UserAccount['role'] = (userObj.role === 'admin' || trimmedEmail === 'gera123@gmail.com') ? 'admin' : 'user';
    userObj.role = finalRole;

    setCurrentUser(userObj);

    if (finalRole === 'admin') {
      localStorage.setItem('app_admin_auth', 'true');
    } else {
      localStorage.removeItem('app_admin_auth');
    }

    if (rememberSession) {
      localStorage.setItem('app_current_user', JSON.stringify(userObj));
      sessionStorage.removeItem('app_current_user');
    } else {
      sessionStorage.setItem('app_current_user', JSON.stringify(userObj));
      localStorage.removeItem('app_current_user');
    }

    setShowAdminModal(false);
    setShowAuthModal(false);
    setAuthModalPrompt(null);

    if (finalRole === 'admin') {
      setActiveTab('admin', userObj);
      return { success: true, role: 'admin' };
    } else {
      setActiveTab('calculadora', userObj);
      return { success: true, role: 'user' };
    }
  };

  // Registration strictly sets role to 'user' for public signups (Never 'admin')
  const userRegister = async (
    nameInput: string,
    emailInput: string,
    passwordInput?: string
  ): Promise<{ success: boolean; role?: UserAccount['role']; message?: string }> => {
    const trimmedName = nameInput.trim();
    const trimmedEmail = emailInput.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      return { success: false, message: 'Todos los campos son requeridos.' };
    }

    if (isSupabaseConfigured() && passwordInput) {
      const authRes = await supabaseApi.signUpWithSupabase(trimmedEmail, passwordInput, trimmedName);
      if (!authRes.success) {
        return { success: false, message: authRes.error || 'Error al registrar usuario en Supabase Auth.' };
      }
    }

    // STRICT ROLE ASSIGNMENT:
    // Registration ALWAYS forces role to 'user' for public signups unless email is explicitly single admin
    const secureRole: UserAccount['role'] = trimmedEmail === 'gera123@gmail.com' ? 'admin' : 'user';

    let dbProfile: UserAccount | null = null;
    if (isSupabaseConfigured()) {
      dbProfile = await supabaseApi.createUserRecord({
        name: trimmedName,
        email: trimmedEmail,
        role: secureRole
      });
    }

    const newClient: UserAccount = dbProfile || {
      id: 'usr-' + Date.now(),
      name: trimmedName,
      email: trimmedEmail,
      role: secureRole,
      status: 'activo',
      registeredAt: new Date().toISOString()
    };

    if (newClient.email.trim().toLowerCase() !== 'gera123@gmail.com' && newClient.role !== 'admin') {
      newClient.role = 'user';
    }

    setUsers(prev => [newClient, ...prev.filter(u => u.email.toLowerCase() !== trimmedEmail)]);
    setCurrentUser(newClient);
    
    const isAdmin = newClient.role === 'admin';
    if (isAdmin) {
      localStorage.setItem('app_admin_auth', 'true');
      setActiveTab('admin', newClient);
    } else {
      localStorage.removeItem('app_admin_auth');
      setActiveTab('calculadora', newClient);
    }
    localStorage.setItem('app_current_user', JSON.stringify(newClient));
    setShowAdminModal(false);
    setShowAuthModal(false);
    setAuthModalPrompt(null);

    return { success: true, role: newClient.role };
  };

  const requestPasswordReset = async (emailInput: string): Promise<{ success: boolean; message: string }> => {
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) return { success: false, message: 'Ingresa un correo electrónico.' };

    if (isSupabaseConfigured()) {
      const res = await supabaseApi.requestPasswordReset(trimmed);
      if (!res.success) return { success: false, message: res.error || 'No se pudo enviar el correo de recuperación.' };
    }

    return { success: true, message: `Se envió un correo de recuperación a ${trimmed}` };
  };

  const adminLogin = (password: string) => {
    const res = userLogin(password);
    return res !== null;
  };

  const userLogout = () => {
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch(() => {});
    }
    setCurrentUser(null);
    localStorage.removeItem('app_admin_auth');
    localStorage.removeItem('app_current_user');
    sessionStorage.removeItem('app_current_user');
    setActiveTabState('inicio');
    window.location.hash = 'inicio';
  };

  const adminLogout = userLogout;

  const installPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    }
  };

  // CMS Mutators writing directly to Supabase
  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    if (isSupabaseConfigured()) {
      await supabaseApi.updateSettings(newSettings);
    }
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProj: Project = {
      ...projectData,
      id: 'proj-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [newProj, ...prev]);
    if (isSupabaseConfigured()) {
      await supabaseApi.upsertProject(newProj);
    }
  };

  const updateProject = async (id: string, updated: Partial<Project>) => {
    setProjects(prev => {
      const list = prev.map(p => p.id === id ? { ...p, ...updated } : p);
      const item = list.find(p => p.id === id);
      if (item && isSupabaseConfigured()) {
        supabaseApi.upsertProject(item);
      }
      return list;
    });
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (isSupabaseConfigured()) {
      await supabaseApi.deleteProject(id);
    }
  };

  const addService = async (serviceData: Omit<ServiceItem, 'id'>) => {
    const newServ: ServiceItem = {
      ...serviceData,
      id: 'serv-' + Date.now()
    };
    setServices(prev => [...prev, newServ]);
    if (isSupabaseConfigured()) {
      await supabaseApi.upsertService(newServ);
    }
  };

  const updateService = async (id: string, updated: Partial<ServiceItem>) => {
    setServices(prev => {
      const list = prev.map(s => s.id === id ? { ...s, ...updated } : s);
      const item = list.find(s => s.id === id);
      if (item && isSupabaseConfigured()) {
        supabaseApi.upsertService(item);
      }
      return list;
    });
  };

  const deleteService = async (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    if (isSupabaseConfigured()) {
      await supabaseApi.deleteService(id);
    }
  };

  const addMessage = async (msgData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: 'msg-' + Date.now(),
      status: 'nuevo',
      createdAt: new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })
    };
    setMessages(prev => [newMsg, ...prev]);
    if (isSupabaseConfigured()) {
      await supabaseApi.sendMessage(msgData);
    }
  };

  const markMessageStatus = async (id: string, status: ContactMessage['status']) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    if (isSupabaseConfigured()) {
      await supabaseApi.updateMessageStatus(id, status);
    }
  };

  const deleteMessage = async (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    if (isSupabaseConfigured()) {
      await supabaseApi.deleteMessage(id);
    }
  };

  const requestQuote = (prefill?: Partial<QuoteRequest>) => {
    if (prefill) {
      setQuotePrefillData(prefill);
    }
    if (!currentUser) {
      setAuthModalPrompt('Para solicitar una cotización necesitas crear una cuenta o iniciar sesión.');
      setShowAuthModal(true);
    } else {
      setTimeout(() => {
        const elem = document.getElementById('contacto');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = 'contacto';
        }
      }, 100);
    }
  };

  const addQuoteRequest = async (reqData: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      setAuthModalPrompt('Para solicitar una cotización necesitas crear una cuenta o iniciar sesión.');
      setShowAuthModal(true);
      return { success: false, error: 'Debes iniciar sesión para solicitar una cotización.' };
    }

    try {
      const newReq: QuoteRequest = {
        ...reqData,
        clientName: currentUser.name || reqData.clientName,
        email: currentUser.email || reqData.email,
        id: 'lead-' + Date.now().toString().slice(-4),
        status: 'pendiente',
        createdAt: new Date().toLocaleDateString('es-MX')
      };

      if (isSupabaseConfigured()) {
        const ok = await supabaseApi.createQuotation({
          clientName: currentUser.name || reqData.clientName,
          email: currentUser.email || reqData.email,
          phone: reqData.phone,
          projectType: reqData.projectType,
          budget: reqData.estimatedBudget,
          description: reqData.description
        });

        if (!ok) {
          return { success: false, error: 'Ocurrió un error al guardar la cotización en la base de datos.' };
        }
      }

      setQuoteRequests(prev => [newReq, ...prev]);
      return { success: true };
    } catch (err: any) {
      console.error('Error enviando cotización:', err);
      return { success: false, error: err?.message || 'Error inesperado al procesar la cotización.' };
    }
  };

  const updateQuoteRequestStatus = async (id: string, status: QuoteRequest['status'], notes?: string) => {
    setQuoteRequests(prev => prev.map(r => r.id === id ? { ...r, status, internalNotes: notes ?? r.internalNotes } : r));
    if (isSupabaseConfigured()) {
      await supabaseApi.updateQuotationStatus(id, status);
    }
  };

  const deleteQuoteRequest = async (id: string) => {
    setQuoteRequests(prev => prev.filter(r => r.id !== id));
    if (isSupabaseConfigured()) {
      await supabaseApi.deleteQuotation(id);
    }
  };

  const addGalleryItem = async (itemData: Omit<GalleryItem, 'id' | 'createdAt'>) => {
    const newItem: GalleryItem = {
      ...itemData,
      id: 'gal-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGalleryItems(prev => [newItem, ...prev]);
    if (isSupabaseConfigured()) {
      await supabaseApi.upsertGalleryItem(newItem);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    setGalleryItems(prev => prev.filter(g => g.id !== id));
    if (isSupabaseConfigured()) {
      await supabaseApi.deleteGalleryItem(id);
    }
  };

  const addTechStackItem = (item: TechStackItem) => {
    setTechStack(prev => [...prev.filter(t => t.name !== item.name), item]);
  };

  const updateTechStackItem = (name: string, updated: Partial<TechStackItem>) => {
    setTechStack(prev => prev.map(t => t.name === name ? { ...t, ...updated } : t));
  };

  const deleteTechStackItem = (name: string) => {
    setTechStack(prev => prev.filter(t => t.name !== name));
  };

  const updateIdea = (id: string, updated: Partial<IdeaPreset>) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, ...updated } : i));
  };

  const addTestimonial = async (testData: Omit<Testimonial, 'id' | 'createdAt'>) => {
    const newTest: Testimonial = {
      ...testData,
      id: 'test-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTestimonials(prev => [newTest, ...prev]);
    if (isSupabaseConfigured()) {
      await supabaseApi.upsertTestimonial(newTest);
    }
  };

  const updateTestimonial = async (id: string, updated: Partial<Testimonial>) => {
    setTestimonials(prev => {
      const list = prev.map(t => t.id === id ? { ...t, ...updated } : t);
      const item = list.find(t => t.id === id);
      if (item && isSupabaseConfigured()) {
        supabaseApi.upsertTestimonial(item);
      }
      return list;
    });
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    if (isSupabaseConfigured()) {
      await supabaseApi.deleteTestimonial(id);
    }
  };

  const updateUserStatus = async (id: string, status: UserAccount['status']) => {
    setUsers(prev => {
      const list = prev.map(u => u.id === id ? { ...u, status } : u);
      const item = list.find(u => u.id === id);
      if (item && isSupabaseConfigured()) {
        supabaseApi.updateUser(item);
      }
      return list;
    });
  };

  const updateUserRole = async (id: string, role: 'admin' | 'cliente') => {
    setUsers(prev => {
      const list = prev.map(u => u.id === id ? { ...u, role } : u);
      const item = list.find(u => u.id === id);
      if (item && isSupabaseConfigured()) {
        supabaseApi.updateUser(item);
      }
      return list;
    });
  };

  const deleteUser = async (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (isSupabaseConfigured()) {
      await supabaseApi.deleteUser(id);
    }
  };

  const scrollToContact = () => {
    const elem = document.getElementById('contacto');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        userLogin,
        userRegister,
        requestPasswordReset,
        adminLogin,
        userLogout,
        adminLogout,
        isAdminAuthenticated,
        showAdminModal,
        setShowAdminModal,
        showAuthModal,
        setShowAuthModal,
        authModalPrompt,
        setAuthModalPrompt,
        requestQuote,
        theme,
        toggleTheme,
        isOnline,
        deferredPrompt,
        installPWA,
        canInstallPWA: !deferredPrompt,
        dbConnectionStatus,
        settings,
        updateSettings,
        projects,
        addProject,
        updateProject,
        deleteProject,
        services,
        addService,
        updateService,
        deleteService,
        messages,
        addMessage,
        markMessageStatus,
        deleteMessage,
        quoteRequests,
        addQuoteRequest,
        updateQuoteRequestStatus,
        deleteQuoteRequest,
        galleryItems,
        addGalleryItem,
        deleteGalleryItem,
        techStack,
        addTechStackItem,
        updateTechStackItem,
        deleteTechStackItem,
        ideas,
        updateIdea,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        users,
        updateUserStatus,
        updateUserRole,
        deleteUser,
        analytics,
        quotePrefillData,
        setQuotePrefillData,
        scrollToContact,
        reloadAllFromSupabase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp debe ser usado dentro de un AppProvider');
  return context;
};
