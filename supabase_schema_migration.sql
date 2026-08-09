-- ====================================================================
-- SUPABASE COMPLETE MIGRATION SCRIPT FOR PROFESSIONAL PORTFOLIO & CMS
-- ====================================================================
-- Safe, idempotent execution script.
-- Prepared for Production with RLS, Auth Integration, Storage, and Realtime.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. HELPER & SECURITY FUNCTIONS
-- --------------------------------------------------------------------

-- Function to check if current authenticated user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check role in public.users matching auth.uid() or matching auth jwt email
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE (id::text = auth.uid()::text OR email = auth.jwt() ->> 'email')
      AND role = 'admin'
      AND status = 'activo'
  );
END;
$$;

-- Trigger to auto-update 'updated_at' columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- --------------------------------------------------------------------
-- 2. CORE USERS & PROFILES TABLE
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT DEFAULT '',
  role TEXT DEFAULT 'cliente' CHECK (role IN ('admin', 'cliente')),
  status TEXT DEFAULT 'activo' CHECK (status IN ('activo', 'bloqueado', 'pendiente')),
  projects_count INT DEFAULT 0,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to sync auth.users inserts to public.users automatically as 'cliente'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role, status, registered_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'cliente', -- PUBLIC REGISTRATIONS ARE STRICTLY CLIENTS
    'activo',
    NOW()
  )
  ON CONFLICT (email) DO UPDATE
  SET id = EXCLUDED.id,
      name = COALESCE(public.users.name, EXCLUDED.name);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------------
-- 3. SITE SETTINGS, APPEARANCE & SEO (CMS)
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  developer_name TEXT DEFAULT 'Mizrahim Web',
  developer_title TEXT DEFAULT 'Full Stack Software Engineer & Cloud Architect',
  developer_bio TEXT DEFAULT 'Desarrollador apasionado por crear aplicaciones web modernas, rápidas y escalables con IA y arquitecturas Cloud.',
  email TEXT DEFAULT 'contacto@mizrahimweb.com',
  phone TEXT DEFAULT '+52 55 1234 5678',
  location TEXT DEFAULT 'Ciudad de México, México',
  availability TEXT DEFAULT 'Disponible para proyectos',
  years_experience INT DEFAULT 5,
  completed_projects INT DEFAULT 45,
  satisfied_clients INT DEFAULT 38,
  code_lines TEXT DEFAULT '250,000+',
  custom_admin_password TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_appearance (
  id TEXT PRIMARY KEY DEFAULT 'default',
  primary_color TEXT DEFAULT '#2563eb',
  dark_mode BOOLEAN DEFAULT TRUE,
  font_family TEXT DEFAULT 'Plus Jakarta Sans',
  animations_enabled BOOLEAN DEFAULT TRUE,
  custom_css TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_seo (
  id TEXT PRIMARY KEY DEFAULT 'default',
  title TEXT DEFAULT 'Mizrahim Web | Software Engineer & Cloud Solutions',
  meta_description TEXT DEFAULT 'Desarrollo de software a medida, aplicaciones web, APIs escalables y soluciones cloud.',
  keywords TEXT[] DEFAULT ARRAY['Desarrollo Web', 'Software Architecture', 'React', 'TypeScript', 'Node.js', 'Cloud'],
  og_title TEXT DEFAULT 'Mizrahim Web - Portfolio & Desarrollo de Software',
  og_description TEXT DEFAULT 'Transforma tus ideas en soluciones tecnológicas escalables y de alto impacto.',
  og_image TEXT DEFAULT '',
  twitter_card TEXT DEFAULT 'summary_large_image',
  canonical_url TEXT DEFAULT '',
  robots TEXT DEFAULT 'index, follow',
  favicon_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. CURRICULUM, SKILLS & TIMELINE
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.work_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  period TEXT NOT NULL,
  location TEXT DEFAULT '',
  description TEXT DEFAULT '',
  achievements TEXT[] DEFAULT ARRAY[]::TEXT[],
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  period TEXT NOT NULL,
  status TEXT DEFAULT 'Completado',
  description TEXT DEFAULT '',
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT DEFAULT '',
  credential_id TEXT DEFAULT '',
  credential_url TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INT DEFAULT 85,
  icon TEXT DEFAULT '',
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'Sparkles',
  category TEXT DEFAULT 'hito',
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. PORTFOLIO, CATEGORIES & TECHNOLOGIES
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'General',
  icon TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Web',
  description TEXT NOT NULL,
  full_description TEXT DEFAULT '',
  client_name TEXT DEFAULT '',
  completion_date TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  live_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  featured BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Normalized relational join table for project technologies
CREATE TABLE IF NOT EXISTS public.project_technologies (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  technology_id UUID REFERENCES public.technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, technology_id)
);

-- Normalized project gallery images
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Normalized project statistics
CREATE TABLE IF NOT EXISTS public.project_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL
);

-- --------------------------------------------------------------------
-- 6. SERVICES, GALLERY, TESTIMONIALS & CONTENT
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'Code2',
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  estimated_days TEXT DEFAULT '5-10 días',
  starting_price NUMERIC DEFAULT 0,
  popular BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'UI Design',
  image_url TEXT NOT NULL,
  description TEXT DEFAULT '',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  likes INT DEFAULT 0,
  views INT DEFAULT 0,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_role TEXT DEFAULT 'Cliente',
  company TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  content TEXT NOT NULL,
  rating INT DEFAULT 5,
  verified BOOLEAN DEFAULT TRUE,
  project_title TEXT DEFAULT '',
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'borrador' CHECK (status IN ('borrador', 'en_desarrollo', 'publicado')),
  likes INT DEFAULT 0,
  category TEXT DEFAULT 'General',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT NOT NULL,
  cover_image TEXT DEFAULT '',
  category TEXT DEFAULT 'General',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  published BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. MESSAGES, QUOTATIONS & ATTACHMENTS
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'no_leido' CHECK (status IN ('no_leido', 'leido', 'respondido', 'archivado')),
  read BOOLEAN DEFAULT FALSE,
  is_important BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.contact_messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT '',
  file_size INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT DEFAULT '',
  project_type TEXT NOT NULL,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  priority TEXT DEFAULT 'media' CHECK (priority IN ('baja', 'media', 'alta', 'urgente')),
  budget_range TEXT DEFAULT '',
  estimated_days INT DEFAULT 7,
  estimated_price NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_revision', 'aprobada', 'rechazada', 'en_desarrollo', 'completada')),
  notes TEXT DEFAULT '',
  assigned_to TEXT DEFAULT 'Mizrahim Web',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quotation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE CASCADE,
  previous_status TEXT DEFAULT '',
  new_status TEXT NOT NULL,
  changed_by TEXT DEFAULT 'Sistema',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quotation_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT '',
  file_size INT DEFAULT 0
);

-- --------------------------------------------------------------------
-- 8. NAVIGATION, SOCIAL, NOTIFICATIONS & AUDIT LOGS
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.navigation_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  location TEXT DEFAULT 'navbar',
  is_active BOOLEAN DEFAULT TRUE,
  order_index INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'danger')),
  is_read BOOLEAN DEFAULT FALSE,
  link_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_email TEXT DEFAULT '',
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  details JSONB DEFAULT '{}'::JSONB,
  ip_address TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  content_data JSONB NOT NULL,
  version_number INT DEFAULT 1,
  created_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 9. INDEXES FOR HIGH-PERFORMANCE QUERIES
-- --------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects(order_index);
CREATE INDEX IF NOT EXISTS idx_services_order ON public.services(order_index);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_quotations_user_id ON public.quotations(user_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON public.quotations(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- --------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_appearance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;

-- Helper to safely recreate policy
DO $$
BEGIN
  -- PUBLIC READ POLICIES FOR CONTENT
  EXECUTE 'CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read Technologies" ON public.technologies FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read Gallery" ON public.gallery_items FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read Testimonials" ON public.testimonials FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read FAQs" ON public.faqs FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read Ideas" ON public.ideas FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read Blog" ON public.blog_posts FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read Appearance" ON public.site_appearance FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read SEO" ON public.site_seo FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read WorkExperience" ON public.work_experience FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read Education" ON public.education FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read Certifications" ON public.certifications FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read Timeline" ON public.timeline_events FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read SocialLinks" ON public.social_links FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Public Read NavLinks" ON public.navigation_links FOR SELECT USING (true)';

  -- PUBLIC INSERT POLICIES FOR FORMS
  EXECUTE 'CREATE POLICY "Public Insert Messages" ON public.contact_messages FOR INSERT WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Public Insert Quotations" ON public.quotations FOR INSERT WITH CHECK (true)';

  -- ADMIN ALL PERMISSIONS POLICIES
  EXECUTE 'CREATE POLICY "Admin All Projects" ON public.projects FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All Categories" ON public.categories FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All Technologies" ON public.technologies FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All Services" ON public.services FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All Gallery" ON public.gallery_items FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All Testimonials" ON public.testimonials FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All FAQs" ON public.faqs FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All Ideas" ON public.ideas FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All Blog" ON public.blog_posts FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All Settings" ON public.site_settings FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All Appearance" ON public.site_appearance FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All SEO" ON public.site_seo FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All WorkExperience" ON public.work_experience FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All Education" ON public.education FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All Certifications" ON public.certifications FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All Skills" ON public.skills FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All Timeline" ON public.timeline_events FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All Messages" ON public.contact_messages FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All Quotations" ON public.quotations FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All Users" ON public.users FOR ALL USING (public.is_admin())';
  EXECUTE 'CREATE POLICY "Admin All AuditLogs" ON public.audit_logs FOR ALL USING (public.is_admin())';

  -- CLIENT USER SELF-ACCESS POLICIES
  EXECUTE 'CREATE POLICY "Users Self Select" ON public.users FOR SELECT USING (id::text = auth.uid()::text OR email = auth.jwt()->>''email'')';
  EXECUTE 'CREATE POLICY "Quotations User Select" ON public.quotations FOR SELECT USING (user_id::text = auth.uid()::text OR client_email = auth.jwt()->>''email'')';
  EXECUTE 'CREATE POLICY "Notifications User Select" ON public.notifications FOR SELECT USING (user_id::text = auth.uid()::text)';
EXCEPTION
  WHEN OTHERS THEN NULL; -- Ignore policy already exists errors safely
END $$;

-- --------------------------------------------------------------------
-- 11. SUPABASE STORAGE BUCKETS PROVISIONING
-- --------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('portfolio', 'portfolio', true),
  ('gallery', 'gallery', true),
  ('logos', 'logos', true),
  ('documents', 'documents', false),
  ('quotations', 'quotations', false)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Read Policies
DO $$
BEGIN
  EXECUTE 'CREATE POLICY "Public Read Storage" ON storage.objects FOR SELECT USING (bucket_id IN (''avatars'', ''portfolio'', ''gallery'', ''logos''))';
  EXECUTE 'CREATE POLICY "Admin Manage Storage" ON storage.objects FOR ALL USING (public.is_admin())';
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- --------------------------------------------------------------------
-- 12. SEED INITIAL DATA (DEFAULT SINGLETON RECORD)
-- --------------------------------------------------------------------

INSERT INTO public.site_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.site_appearance (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.site_seo (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- MIGRATION COMPLETE & READY FOR PRODUCTION
-- ====================================================================
