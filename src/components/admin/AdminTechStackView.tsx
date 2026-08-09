import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TechStackItem } from '../../types';
import { Plus, Edit2, Trash2, Code, Server, Database, Smartphone, Sparkles, X } from 'lucide-react';

export const AdminTechStackView: React.FC = () => {
  const { techStack, addTechStackItem, updateTechStackItem, deleteTechStackItem } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [editingTech, setEditingTech] = useState<TechStackItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<TechStackItem['category']>('Frontend');
  const [iconName, setIconName] = useState('Code');
  const [proficiency, setProficiency] = useState(90);
  const [description, setDescription] = useState('');

  const categories: TechStackItem['category'][] = [
    'Frontend',
    'Backend',
    'Base de Datos',
    'Móvil',
    'Herramientas & IA'
  ];

  const filteredTech = techStack.filter((item) => {
    if (categoryFilter === 'todos') return true;
    return item.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Frontend': return Code;
      case 'Backend': return Server;
      case 'Base de Datos': return Database;
      case 'Móvil': return Smartphone;
      default: return Sparkles;
    }
  };

  const openCreate = () => {
    setName('');
    setCategory('Frontend');
    setIconName('Code');
    setProficiency(90);
    setDescription('');
    setEditingTech(null);
    setIsCreating(true);
  };

  const openEdit = (item: TechStackItem) => {
    setEditingTech(item);
    setName(item.name);
    setCategory(item.category);
    setIconName(item.iconName);
    setProficiency(item.proficiency);
    setDescription(item.description);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      addTechStackItem({
        name,
        category,
        iconName,
        proficiency,
        description
      });
    } else if (editingTech) {
      updateTechStackItem(editingTech.name, {
        name,
        category,
        iconName,
        proficiency,
        description
      });
    }

    setEditingTech(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Stack de Tecnologías & Herramientas</h2>
          <p className="text-xs text-zinc-400">Administra los lenguajes, frameworks y herramientas exhibidos en la sección de habilidades</p>
        </div>
        <button
          onClick={openCreate}
          className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Tecnología</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-1.5 bg-[#121215] p-1 rounded-2xl border border-zinc-800 w-fit overflow-x-auto">
        {['todos', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
              categoryFilter === cat ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTech.map((item) => {
          const IconComponent = getCategoryIcon(item.category);
          return (
            <div
              key={item.name}
              className="p-5 rounded-3xl bg-[#121215] border border-zinc-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{item.name}</h3>
                      <span className="text-[10px] text-zinc-400 font-semibold">{item.category}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
                    {item.proficiency}%
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>

                {/* Progress Bar */}
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full"
                    style={{ width: `${item.proficiency}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-zinc-800">
                <button
                  onClick={() => openEdit(item)}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => deleteTechStackItem(item.name)}
                  className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                  title="Eliminar Tecnología"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Edit/Create */}
      {(isCreating || editingTech) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 text-white relative shadow-2xl">
            <button
              onClick={() => { setIsCreating(false); setEditingTech(null); }}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold">
              {isCreating ? 'Agregar Tecnología' : 'Editar Tecnología'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-300">Nombre de Tecnología / Herramienta</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ej. Next.js, Docker, Tailwind"
                  className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-300">Categoría</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-zinc-300">Dominio / Porcentaje ({proficiency}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={proficiency}
                    onChange={e => setProficiency(Number(e.target.value))}
                    className="w-full accent-blue-600 mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-300">Descripción Corta</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Uso práctico y experiencia acumulada..."
                  className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg shadow-blue-600/20 transition-all mt-2"
              >
                Guardar Tecnología
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
