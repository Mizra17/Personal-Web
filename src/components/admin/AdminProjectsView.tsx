import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  Github,
  X,
  Check
} from 'lucide-react';

export const AdminProjectsView: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useApp();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Project['category']>('Web');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [technologiesText, setTechnologiesText] = useState('');
  const [status, setStatus] = useState<Project['status']>('Entregado');
  const [liveUrl, setLiveUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [featured, setFeatured] = useState(false);

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setIsCreating(false);
    setTitle(p.title);
    setCategory(p.category);
    setDescription(p.description);
    setFullDescription(p.fullDescription || p.description);
    setMainImage(p.mainImage);
    setTechnologiesText(p.technologies.join(', '));
    setStatus(p.status);
    setLiveUrl(p.liveUrl || '');
    setRepoUrl(p.repoUrl || '');
    setFeatured(p.featured);
  };

  const openNew = () => {
    setEditingProject(null);
    setIsCreating(true);
    setTitle('');
    setCategory('Web');
    setDescription('');
    setFullDescription('');
    setMainImage('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80');
    setTechnologiesText('React, TypeScript, Tailwind CSS');
    setStatus('Entregado');
    setLiveUrl('');
    setRepoUrl('');
    setFeatured(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = technologiesText.split(',').map(t => t.trim()).filter(Boolean);

    if (isCreating) {
      addProject({
        title,
        category,
        description,
        fullDescription: fullDescription || description,
        mainImage,
        gallery: [mainImage],
        technologies: techArray,
        status,
        liveUrl,
        repoUrl,
        featured,
        order: projects.length + 1
      });
    } else if (editingProject) {
      updateProject(editingProject.id, {
        title,
        category,
        description,
        fullDescription,
        mainImage,
        technologies: techArray,
        status,
        liveUrl,
        repoUrl,
        featured
      });
    }

    setEditingProject(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Gestión de Portafolio</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Agrega, edita o elimina los proyectos visibles en la galería pública del sitio.
          </p>
        </div>

        <button
          onClick={openNew}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Nuevo Proyecto</span>
        </button>
      </div>

      {/* Projects Table List */}
      <div className="p-6 rounded-3xl bg-[#121215] border border-zinc-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-bold uppercase">
                <th className="pb-3">Proyecto</th>
                <th className="pb-3">Categoría</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3">Destacado</th>
                <th className="pb-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img src={proj.mainImage} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div>
                        <div className="font-bold text-white text-sm">{proj.title}</div>
                        <div className="text-[10px] text-zinc-400 truncate max-w-xs">{proj.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold">
                      {proj.category}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                      {proj.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => updateProject(proj.id, { featured: !proj.featured })}
                      className={`p-1.5 rounded-lg transition-colors border border-zinc-800 ${
                        proj.featured ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-zinc-900 text-zinc-500'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(proj)}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Project Modal */}
      {(isCreating || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-white relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => { setIsCreating(false); setEditingProject(null); }}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold">
              {isCreating ? 'Agregar Nuevo Proyecto' : 'Editar Proyecto'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Título del Proyecto</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Categoría</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option>Web</option>
                    <option>Móvil</option>
                    <option>Sistema Admin</option>
                    <option>eCommerce</option>
                    <option>Dashboard</option>
                    <option>API/Backend</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Resumen Corto</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Descripción Completa</label>
                <textarea
                  rows={3}
                  value={fullDescription}
                  onChange={e => setFullDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">URL Imagen Principal</label>
                  <input
                    type="text"
                    required
                    value={mainImage}
                    onChange={e => setMainImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Tecnologías (separadas por coma)</label>
                  <input
                    type="text"
                    value={technologiesText}
                    onChange={e => setTechnologiesText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Estado</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option>Entregado</option>
                    <option>En proceso</option>
                    <option>Demo en vivo</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">URL Demo / En Vivo</label>
                  <input
                    type="text"
                    value={liveUrl}
                    onChange={e => setLiveUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={featured}
                  onChange={e => setFeatured(e.target.checked)}
                  className="rounded bg-[#09090b] border-zinc-800 text-blue-600"
                />
                <label htmlFor="featured-check" className="font-bold text-zinc-300">
                  Marcar como proyecto Destacado en Inicio
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white shadow-lg shadow-blue-600/20"
              >
                Guardar Proyecto
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
