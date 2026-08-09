import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Inbox,
  FolderGit2,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Eye,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AdminDashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const { projects, quoteRequests, users, analytics } = useApp();

  const pendingRequests = quoteRequests.filter(r => r.status === 'pendiente').length;

  const statusPieData = [
    { name: 'Pendiente', value: quoteRequests.filter(r => r.status === 'pendiente').length, color: '#f59e0b' },
    { name: 'En revisión', value: quoteRequests.filter(r => r.status === 'en_revision').length, color: '#3b82f6' },
    { name: 'En proceso', value: quoteRequests.filter(r => r.status === 'en_proceso').length, color: '#8b5cf6' },
    { name: 'Finalizado', value: quoteRequests.filter(r => r.status === 'finalizado').length, color: '#10b981' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Panel Principal de Control</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Resumen en tiempo real de visitas, solicitudes de cotización y estado de la plataforma.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('requests')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20"
          >
            <Inbox className="w-4 h-4" />
            <span>Ver Solicitudes ({pendingRequests} pendientes)</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Visitas Mensuales</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{analytics.monthlyVisits}</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14% comparado con mes anterior</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Solicitudes / Leads</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{quoteRequests.length}</div>
          <div className="text-[10px] text-amber-400">
            {pendingRequests} pendientes de respuesta
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Proyectos Publicados</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{projects.length}</div>
          <div className="text-[10px] text-zinc-400">
            {projects.filter(p => p.featured).length} destacados en la portada
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Usuarios / Clientes</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{users.length}</div>
          <div className="text-[10px] text-emerald-400">
            Tasa de Conversión: {analytics.conversionRate}%
          </div>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Trend Area Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#121215] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Tendencia de Visitas y Cotizaciones</h3>
              <p className="text-xs text-zinc-400">Histórico de tráfico del sitio público</p>
            </div>
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
              2026
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthlyTrend}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121215', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="visits" stroke="#2563eb" fillOpacity={1} fill="url(#colorVisits)" name="Visitas" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requests Status Distribution */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#121215] border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Estado de Solicitudes</h3>
            <p className="text-xs text-zinc-400">Distribución de cotizaciones</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#121215', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {statusPieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-zinc-300">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Lead Requests List */}
      <div className="p-6 rounded-3xl bg-[#121215] border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Últimas Solicitudes Recibidas</h3>
          <button
            onClick={() => onNavigate('requests')}
            className="text-xs text-blue-400 hover:underline"
          >
            Ver todas
          </button>
        </div>

        <div className="space-y-2">
          {quoteRequests.slice(0, 3).map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-2xl bg-[#09090b] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-bold text-white text-sm">{req.clientName}</div>
                <div className="text-zinc-400">{req.email} • {req.projectType}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">{req.estimatedBudget}</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  req.status === 'pendiente' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {req.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
