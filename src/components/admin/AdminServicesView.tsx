import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import { Plus, Edit2, Trash2, Check, Star, Clock, DollarSign, X } from 'lucide-react';

export const AdminServicesView: React.FC = () => {
  const { services, addService, updateService, deleteService } = useApp();
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Code');
  const [startingPrice, setStartingPrice] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [popular, setPopular] = useState(false);
  const [benefitsText, setBenefitsText] = useState('');
  const [deliverablesText, setDeliverablesText] = useState('');

  const openCreate = () => {
    setTitle('');
    setDescription('');
    setIconName('Code');
    setStartingPrice('$8,000 MXN');
    setEstimatedTime('2 a 3 semanas');
    setPopular(false);
    setBenefitsText('Diseño 100% responsivo\nSoporte por 30 días');
    setDeliverablesText('Código fuente\nManual de usuario');
    setEditingService(null);
    setIsCreating(true);
  };

  const openEdit = (service: ServiceItem) => {
    setEditingService(service);
    setTitle(service.title);
    setDescription(service.description);
    setIconName(service.iconName);
    setStartingPrice(service.startingPrice || '');
    setEstimatedTime(service.estimatedTime || '');
    setPopular(service.popular || false);
    setBenefitsText((service.benefits || []).join('\n'));
    setDeliverablesText((service.deliverables || []).join('\n'));
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const benefits = benefitsText.split('\n').filter(b => b.trim().length > 0);
    const deliverables = deliverablesText.split('\n').filter(d => d.trim().length > 0);

    if (isCreating) {
      addService({
        title,
        description,
        iconName,
        startingPrice,
        estimatedTime,
        popular,
        benefits,
        deliverables
      });
    } else if (editingService) {
      updateService(editingService.id, {
        title,
        description,
        iconName,
        startingPrice,
        estimatedTime,
        popular,
        benefits,
        deliverables
      });
    }

    setEditingService(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Gestión de Servicios</h2>
          <p className="text-xs text-zinc-400">Administra la oferta de servicios, precios iniciales y entregables en el sitio público</p>
        </div>
        <button
          onClick={openCreate}
          className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`p-5 rounded-3xl bg-[#121215] border ${
              service.popular ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : 'border-zinc-800'
            } space-y-4 flex flex-col justify-between relative`}
          >
            {service.popular && (
              <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-blue-400" /> Destacado
              </span>
            )}

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white pr-16">{service.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{service.description}</p>

              <div className="flex items-center gap-4 text-xs font-semibold pt-2 border-t border-zinc-800/80">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{service.startingPrice || 'A cotizar'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{service.estimatedTime || 'Consultar'}</span>
                </div>
              </div>

              {service.benefits && service.benefits.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Beneficios Clave:</span>
                  <ul className="space-y-1 text-[11px] text-zinc-300">
                    {service.benefits.slice(0, 3).map((b, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="truncate">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-zinc-800">
              <button
                onClick={() => openEdit(service)}
                className="w-full py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => deleteService(service.id)}
                className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                title="Eliminar servicio"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Edit/Create */}
      {(isCreating || editingService) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 text-white relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setIsCreating(false); setEditingService(null); }}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold">
              {isCreating ? 'Agregar Nuevo Servicio' : 'Editar Servicio'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-300">Título del Servicio</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-300">Descripción</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-300">Precio Inicial</label>
                  <input
                    type="text"
                    value={startingPrice}
                    onChange={e => setStartingPrice(e.target.value)}
                    placeholder="ej. $15,000 MXN"
                    className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-300">Tiempo Estimado</label>
                  <input
                    type="text"
                    value={estimatedTime}
                    onChange={e => setEstimatedTime(e.target.value)}
                    placeholder="ej. 2 a 3 semanas"
                    className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={popular}
                  onChange={e => setPopular(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-600 bg-zinc-900 border-zinc-700"
                />
                <label htmlFor="popularCheck" className="font-semibold text-zinc-200">
                  Marcar como servicio popular / destacado
                </label>
              </div>

              <div>
                <label className="font-bold text-zinc-300">Beneficios (uno por línea)</label>
                <textarea
                  rows={3}
                  value={benefitsText}
                  onChange={e => setBenefitsText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="font-bold text-zinc-300">Entregables Incluidos (uno por línea)</label>
                <textarea
                  rows={3}
                  value={deliverablesText}
                  onChange={e => setDeliverablesText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg shadow-blue-600/20 transition-all mt-2"
              >
                Guardar Servicio
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
