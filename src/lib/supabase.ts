import { createClient } from '@supabase/supabase-js';
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

const SUPABASE_URL_DEFAULT = 'https://axqngxqjdvwljbtlzlpq.supabase.co';
const SUPABASE_ANON_KEY_DEFAULT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4cW5neHFqZHZ3bGpidGx6bHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4OTYxMDAsImV4cCI6MjEwMTQ3MjEwMH0.iWfg6nTQQLMtQF0bRynTbsycww5zUhYPCUUEKMS9EZs';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL_DEFAULT;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY_DEFAULT;

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co');
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string; details?: any }> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      return { success: false, message: `Error al conectar con Supabase: ${error.message}` };
    }
    return { success: true, message: 'Conexión exitosa a Supabase (https://axqngxqjdvwljbtlzlpq.supabase.co)', details: data };
  } catch (err: any) {
    return { success: false, message: `Excepción al intentar conectar: ${err?.message || err}` };
  }
};

// Supabase API helper methods
export const supabaseApi = {
  // --- REALTIME SUBSCRIPTIONS ---
  subscribeToRealtime(onTableChange: (tableName: string) => void) {
    if (!isSupabaseConfigured()) return () => {};
    const channel = supabase
      .channel('public-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        if (payload.table) {
          onTableChange(payload.table);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // --- AUTH & USERS ---
  async getUserByEmail(email: string): Promise<UserAccount | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const trimmed = email.trim().toLowerCase();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', trimmed)
        .maybeSingle();
      if (error || !data) return null;

      // STRICT ROLE DETERMINATION: Only role === 'admin' (or gera123@gmail.com) gets admin role. All others get 'user'.
      const role: UserAccount['role'] = (data.role === 'admin' || trimmed === 'gera123@gmail.com') ? 'admin' : 'user';

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role,
        status: (data.status || 'activo') as 'activo' | 'bloqueado' | 'pendiente',
        projectsCount: data.projects_count || 0,
        registeredAt: data.registered_at || new Date().toISOString()
      };
    } catch {
      return null;
    }
  },

  async getUserById(id: string): Promise<UserAccount | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error || !data) return null;

      const role: UserAccount['role'] = (data.role === 'admin' || data.email?.trim().toLowerCase() === 'gera123@gmail.com') ? 'admin' : 'user';

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role,
        status: (data.status || 'activo') as 'activo' | 'bloqueado' | 'pendiente',
        projectsCount: data.projects_count || 0,
        registeredAt: data.registered_at || new Date().toISOString()
      };
    } catch {
      return null;
    }
  },

  async fetchUsers(): Promise<UserAccount[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase.from('users').select('*').order('registered_at', { ascending: false });
      if (error || !data) return null;
      return data.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: (u.role === 'admin' || u.email?.trim().toLowerCase() === 'gera123@gmail.com' ? 'admin' : 'user') as UserAccount['role'],
        status: (u.status || 'activo') as 'activo' | 'bloqueado' | 'pendiente',
        projectsCount: u.projects_count || 0,
        registeredAt: u.registered_at
      }));
    } catch {
      return null;
    }
  },

  async createUserRecord(user: { id?: string; name: string; email: string; phone?: string; role?: 'admin' | 'user' | 'cliente' }): Promise<UserAccount | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const trimmedEmail = user.email.trim().toLowerCase();
      // ENFORCE STRICT ROLE ASSIGNMENT:
      // Only 'gera123@gmail.com' can be assigned the 'admin' role.
      // Every other user registration is strictly forced to 'user'.
      const secureRole = trimmedEmail === 'gera123@gmail.com' ? 'admin' : 'user';

      const record = {
        name: user.name,
        email: trimmedEmail,
        phone: user.phone || '',
        role: secureRole,
        status: 'activo',
        registered_at: new Date().toISOString()
      };

      let data: any = null;
      const upsertRes = await supabase
        .from('users')
        .upsert(record, { onConflict: 'email' })
        .select('*')
        .maybeSingle();

      if (upsertRes.data) {
        data = upsertRes.data;
      } else {
        const fetchExisting = await supabase
          .from('users')
          .select('*')
          .eq('email', trimmedEmail)
          .maybeSingle();

        if (fetchExisting.data) {
          data = fetchExisting.data;
        } else {
          const insertRes = await supabase
            .from('users')
            .insert(record)
            .select('*')
            .maybeSingle();
          data = insertRes.data;
        }
      }

      if (!data) return null;

      const finalRole: UserAccount['role'] = (data.role === 'admin' || trimmedEmail === 'gera123@gmail.com') ? 'admin' : 'user';

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: finalRole,
        status: (data.status || 'activo') as 'activo' | 'bloqueado' | 'pendiente',
        registeredAt: data.registered_at
      };
    } catch {
      return null;
    }
  },

  async updateUser(user: UserAccount): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      // Prevent demoting or promoting non-gera123 users to admin accidentally
      const secureRole = user.email.trim().toLowerCase() === 'gera123@gmail.com' ? 'admin' : (user.role === 'admin' ? 'user' : user.role);
      const { error } = await supabase.from('users').update({
        name: user.name,
        phone: user.phone,
        role: secureRole,
        status: user.status,
        projects_count: user.projectsCount
      }).eq('id', user.id);
      return !error;
    } catch {
      return false;
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  async signInWithSupabase(email: string, password: string) {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase no configurado' };
    const trimmedEmail = email.trim().toLowerCase();
    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password
      });

      // Special auto-provisioning for admin account if gera123@gmail.com with 123456
      if (error && trimmedEmail === 'gera123@gmail.com' && password === '123456') {
        await supabase.auth.signUp({
          email: trimmedEmail,
          password: '123456',
          options: { data: { name: 'Administrador Gera' } }
        });
        const retryRes = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: '123456'
        });
        if (!retryRes.error) {
          data = retryRes.data;
          error = null;
        }
      }

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error de autenticación' };
    }
  },

  async signUpWithSupabase(email: string, password: string, name: string) {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase no configurado' };
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { name } }
      });
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error al registrar usuario' };
    }
  },

  async ensureAdminAccountExists() {
    if (!isSupabaseConfigured()) return;
    try {
      const adminEmail = 'gera123@gmail.com';
      const adminPass = '123456';

      const dbUser = await this.getUserByEmail(adminEmail);
      if (!dbUser) {
        await this.createUserRecord({
          name: 'Administrador Gera',
          email: adminEmail,
          role: 'admin'
        });
      } else if (dbUser.role !== 'admin') {
        await supabase.from('users').update({ role: 'admin' }).eq('email', adminEmail);
      }

      // Try registering in Auth if missing
      await supabase.auth.signUp({
        email: adminEmail,
        password: adminPass,
        options: { data: { name: 'Administrador Gera' } }
      }).catch(() => {});
    } catch (err) {
      console.error('Error seeding admin account:', err);
    }
  },

  async requestPasswordReset(email: string) {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase no configurado' };
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/#reset-password`
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error al solicitar recuperación' };
    }
  },

  // --- SITE SETTINGS ---
  async fetchSettings(): Promise<SiteSettings | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'default').single();
      if (error || !data) return null;

      const rawName = data.developer_name;
      const devName = (!rawName || rawName === 'Alexander Dev' || rawName === 'Alexander.dev') ? 'Mizrahim Web' : rawName;

      if (rawName === 'Alexander Dev' || rawName === 'Alexander.dev') {
        supabase.from('site_settings').update({ developer_name: 'Mizrahim Web' }).eq('id', 'default').then(() => {});
      }

      return {
        developerName: devName,
        title: data.developer_title || data.title,
        bio: data.developer_bio || data.bio,
        heroTitle: data.developer_title || 'Software Engineer',
        heroSubtitle: data.developer_bio || '',
        experienceYears: data.years_experience || 5,
        completedProjectsCount: data.completed_projects || 45,
        satisfiedClientsCount: data.satisfied_clients || 38,
        location: data.location || 'México',
        workingHours: 'Lunes a Viernes 9:00 - 18:00',
        email: data.email === 'contacto@alexanderdev.com' ? 'contacto@mizrahimweb.com' : data.email,
        phone: data.phone,
        whatsapp: data.phone,
        profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        cvUrl: '#',
        socials: { github: '#', linkedin: '#' },
        branding: { primaryColor: '#2563eb', logoText: devName, footerText: `© ${new Date().getFullYear()} ${devName}. Todos los derechos reservados.` }
      };
    } catch {
      return null;
    }
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('site_settings').upsert({
        id: 'default',
        developer_name: settings.developerName,
        developer_title: settings.title,
        developer_bio: settings.bio,
        email: settings.email,
        phone: settings.phone,
        location: settings.location,
        years_experience: settings.experienceYears,
        completed_projects: settings.completedProjectsCount,
        satisfied_clients: settings.satisfiedClientsCount
      });
      return !error;
    } catch {
      return false;
    }
  },

  // --- PROJECTS ---
  async fetchProjects(): Promise<Project[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase.from('projects').select('*').order('order_index', { ascending: true });
      if (error || !data) return null;
      return data.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        fullDescription: p.full_description || p.description,
        category: (p.category || 'Web') as any,
        mainImage: p.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
        gallery: [p.image_url].filter(Boolean),
        videoUrl: '',
        technologies: p.category ? [p.category] : ['React', 'TypeScript'],
        status: 'Entregado',
        liveUrl: p.live_url || '',
        repoUrl: p.github_url || '',
        featured: Boolean(p.featured),
        order: p.order_index || 0,
        createdAt: p.created_at || new Date().toISOString()
      }));
    } catch {
      return null;
    }
  },

  async upsertProject(project: Project): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('projects').upsert({
        id: project.id.length > 20 ? project.id : undefined,
        title: project.title,
        category: project.category,
        description: project.description,
        full_description: project.fullDescription,
        image_url: project.mainImage,
        live_url: project.liveUrl,
        github_url: project.repoUrl,
        featured: project.featured,
        order_index: project.order
      });
      return !error;
    } catch {
      return false;
    }
  },

  async deleteProject(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // --- SERVICES ---
  async fetchServices(): Promise<ServiceItem[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase.from('services').select('*').order('order_index', { ascending: true });
      if (error || !data) return null;
      return data.map(s => ({
        id: s.id,
        iconName: s.icon || 'Code2',
        title: s.title,
        description: s.description,
        benefits: s.features || [],
        popular: Boolean(s.popular),
        estimatedTime: s.estimated_days || '5-10 días',
        startingPrice: s.starting_price ? (s.starting_price.includes('MXN') || s.starting_price.includes('USD') ? s.starting_price.replace('USD', 'MXN') : `$${s.starting_price} MXN`) : '$8,000 MXN',
        deliverables: s.features || []
      }));
    } catch {
      return null;
    }
  },

  async upsertService(service: ServiceItem): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('services').upsert({
        id: service.id.length > 20 ? service.id : undefined,
        title: service.title,
        description: service.description,
        icon: service.iconName,
        features: service.benefits,
        estimated_days: service.estimatedTime,
        starting_price: parseFloat((service.startingPrice || '0').replace(/[^0-9.]/g, '')) || 0,
        popular: service.popular
      });
      return !error;
    } catch {
      return false;
    }
  },

  async deleteService(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // --- MESSAGES ---
  async fetchMessages(): Promise<ContactMessage[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (error || !data) return null;
      return data.map(m => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        subject: m.subject || 'Consulta Web',
        message: m.message,
        status: (m.status === 'no_leido' ? 'nuevo' : m.status) as any,
        createdAt: m.created_at
      }));
    } catch {
      return null;
    }
  },

  async sendMessage(msg: { name: string; email: string; phone?: string; subject?: string; message: string }): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: msg.name,
        email: msg.email,
        phone: msg.phone || '',
        subject: msg.subject || 'Mensaje de contacto',
        message: msg.message,
        status: 'no_leido'
      });
      return !error;
    } catch {
      return false;
    }
  },

  async updateMessageStatus(id: string, status: 'nuevo' | 'leido' | 'respondido'): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const dbStatus = status === 'nuevo' ? 'no_leido' : status;
      const { error } = await supabase.from('contact_messages').update({ status: dbStatus, read: status !== 'nuevo' }).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  async deleteMessage(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // --- QUOTATIONS ---
  async fetchQuotations(): Promise<QuoteRequest[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) return [];

      const userEmail = authData.user.email?.toLowerCase();
      const isAdmin = userEmail === 'gera123@gmail.com';

      let query = supabase.from('quotations').select('*').order('created_at', { ascending: false });
      if (!isAdmin && userEmail) {
        query = query.eq('client_email', userEmail);
      }

      const { data, error } = await query;
      if (error || !data) return null;
      return data.map(q => ({
        id: q.id,
        clientName: q.client_name,
        email: q.client_email,
        phone: q.client_phone || '',
        projectType: q.project_type,
        estimatedBudget: q.budget_range ? q.budget_range.replace('USD', 'MXN') : (q.estimated_price ? `$${q.estimated_price} MXN` : '$15,000 - $30,000 MXN'),
        description: q.notes || 'Cotización de proyecto',
        estimatedDate: `${q.estimated_days || 10} días`,
        status: (q.status === 'pendiente' ? 'pendiente' : q.status === 'en_revision' ? 'en_revision' : q.status === 'en_desarrollo' ? 'en_proceso' : 'finalizado') as any,
        attachments: [],
        internalNotes: q.notes,
        createdAt: q.created_at
      }));
    } catch {
      return null;
    }
  },

  async createQuotation(q: { clientName: string; email: string; phone?: string; projectType: string; budget?: string; description: string }): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        console.warn('Acceso denegado: Creación de cotización requiere sesión activa');
        return false;
      }
      const { error } = await supabase.from('quotations').insert({
        user_id: authData.user.id,
        client_name: q.clientName,
        client_email: q.email || authData.user.email,
        client_phone: q.phone || '',
        project_type: q.projectType,
        budget_range: q.budget || '$15,000 - $30,000 MXN',
        notes: q.description,
        status: 'pendiente'
      });
      return !error;
    } catch {
      return false;
    }
  },

  async updateQuotationStatus(id: string, status: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('quotations').update({ status }).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  async deleteQuotation(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('quotations').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // --- GALLERY ---
  async fetchGallery(): Promise<GalleryItem[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase.from('gallery_items').select('*').order('order_index', { ascending: true });
      if (error || !data) return null;
      return data.map(g => ({
        id: g.id,
        title: g.title,
        category: g.category || 'General',
        imageUrl: g.image_url,
        caption: g.description || '',
        createdAt: g.created_at
      }));
    } catch {
      return null;
    }
  },

  async upsertGalleryItem(item: GalleryItem): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('gallery_items').upsert({
        id: item.id.length > 20 ? item.id : undefined,
        title: item.title,
        category: item.category,
        image_url: item.imageUrl,
        description: item.caption
      });
      return !error;
    } catch {
      return false;
    }
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('gallery_items').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // --- SKILLS & TECH STACK ---
  async fetchSkills(): Promise<TechStackItem[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase.from('skills').select('*').order('order_index', { ascending: true });
      if (error || !data) return null;
      return data.map(s => ({
        name: s.name,
        category: (s.category || 'Frontend') as any,
        iconName: s.icon || 'Code2',
        proficiency: s.proficiency || 85,
        description: `${s.name} profesional`
      }));
    } catch {
      return null;
    }
  },

  // --- TESTIMONIALS ---
  async fetchTestimonials(): Promise<Testimonial[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase.from('testimonials').select('*').order('order_index', { ascending: true });
      if (error || !data) return null;
      return data.map(t => ({
        id: t.id,
        name: t.client_name,
        roleOrCompany: t.company || t.client_role || 'Cliente',
        photoUrl: t.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        projectName: t.project_title || 'Proyecto Web',
        comment: t.content,
        rating: t.rating || 5,
        featured: Boolean(t.verified),
        createdAt: t.created_at
      }));
    } catch {
      return null;
    }
  },

  async upsertTestimonial(t: Testimonial): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('testimonials').upsert({
        id: t.id.length > 20 ? t.id : undefined,
        client_name: t.name,
        company: t.roleOrCompany,
        avatar_url: t.photoUrl,
        project_title: t.projectName,
        content: t.comment,
        rating: t.rating,
        verified: t.featured
      });
      return !error;
    } catch {
      return false;
    }
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // --- IDEAS ---
  async fetchIdeas(): Promise<IdeaPreset[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase.from('ideas').select('*').order('order_index', { ascending: true });
      if (error || !data) return null;
      return data.map(i => ({
        id: i.id,
        name: i.title,
        category: i.category || 'General',
        description: i.description,
        iconName: 'Sparkles',
        keyFeatures: i.tags || [],
        sampleMetrics: [],
        previewType: 'corporate' as any,
        recommendedTech: ['React', 'TypeScript', 'Node.js'],
        estimatedWeeks: '2-4 semanas'
      }));
    } catch {
      return null;
    }
  }
};
