import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart2, Eye, Smartphone, Laptop, Tablet, Globe, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminAnalyticsView: React.FC = () => {
  const { analytics } = useApp();

  const deviceData = [
    { name: 'Móvil', value: analytics.deviceBreakdown.mobile, color: '#10b981' },
    { name: 'Escritorio', value: analytics.deviceBreakdown.desktop, color: '#3b82f6' },
    { name: 'Tablet', value: analytics.deviceBreakdown.tablet, color: '#8b5cf6' }
  ];

  const sourceData = [
    { source: 'Código QR Tarjeta', visits: 620, percent: '49%' },
    { source: 'Google / Buscadores', visits: 310, percent: '24%' },
    { source: 'Redes Sociales', visits: 200, percent: '16%' },
    { source: 'Recomendación Directa', visits: 130, percent: '11%' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Estadísticas & Análisis de Audiencia</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Métricas de comportamiento, dispositivos de origen y efectividad de escaneos de código QR.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800 space-y-2">
          <span className="text-xs text-zinc-400">Total de Escaneos QR / Visitas</span>
          <div className="text-3xl font-extrabold text-white">{analytics.monthlyVisits}</div>
          <div className="text-[10px] text-emerald-400 font-semibold">+18% respecto al mes previo</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800 space-y-2">
          <span className="text-xs text-zinc-400">Tasa de Conversión a Cotización</span>
          <div className="text-3xl font-extrabold text-blue-400">{analytics.conversionRate}%</div>
          <div className="text-[10px] text-zinc-400">1 de cada 20 visitantes solicita cotización</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800 space-y-2">
          <span className="text-xs text-zinc-400">PWA Instalaciones Activas</span>
          <div className="text-3xl font-extrabold text-emerald-400">42</div>
          <div className="text-[10px] text-zinc-400">Guardados como App en pantalla de inicio</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Device Breakdown Pie Chart */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#121215] border border-zinc-800 space-y-4">
          <h3 className="text-base font-bold text-white">Dispositivos de Acceso</h3>
          <p className="text-xs text-zinc-400">Predominio de escaneos desde dispositivos móviles</p>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 rounded-2xl bg-[#09090b] border border-zinc-800">
              <Smartphone className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="font-bold text-white">{analytics.deviceBreakdown.mobile}%</div>
              <div className="text-[10px] text-zinc-400">Móvil</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#09090b] border border-zinc-800">
              <Laptop className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <div className="font-bold text-white">{analytics.deviceBreakdown.desktop}%</div>
              <div className="text-[10px] text-zinc-400">Escritorio</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#09090b] border border-zinc-800">
              <Tablet className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <div className="font-bold text-white">{analytics.deviceBreakdown.tablet}%</div>
              <div className="text-[10px] text-zinc-400">Tablet</div>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#121215] border border-zinc-800 space-y-4">
          <h3 className="text-base font-bold text-white">Fuentes de Tráfico</h3>
          <p className="text-xs text-zinc-400">Canales de adquisición de clientes</p>

          <div className="space-y-3 pt-2">
            {sourceData.map((src, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#09090b] border border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{src.source}</div>
                  <div className="text-zinc-400 text-[10px]">{src.visits} visitas acumuladas</div>
                </div>
                <span className="font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-xl">
                  {src.percent}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
