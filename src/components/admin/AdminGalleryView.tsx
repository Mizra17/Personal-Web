import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GalleryItem } from '../../types';
import { Plus, Trash2, Image as ImageIcon, Eye, X, Filter, ExternalLink } from 'lucide-react';

export const AdminGalleryView: React.FC = () => {
  const { galleryItems, addGalleryItem, deleteGalleryItem } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  const filteredItems = galleryItems.filter(item => {
    if (categoryFilter === 'todos') return true;
    return item.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;

    addGalleryItem({
      title: title || 'Imagen de Galería',
      category: category || 'General',
      imageUrl,
      caption
    });

    setTitle('');
    setImageUrl('');
    setCaption('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Galería Multimedia</h2>
          <p className="text-xs text-zinc-400">Gestiona capturas de pantalla, vistas previas y recursos visuales de tus proyectos</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Imagen</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-1.5 bg-[#121215] p-1 rounded-2xl border border-zinc-800 w-fit overflow-x-auto">
        <Filter className="w-3.5 h-3.5 text-zinc-400 ml-2 mr-1" />
        {['todos', 'web', 'móvil', 'dashboard', 'ecommerce'].map((cat) => (
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group rounded-3xl bg-[#121215] border border-zinc-800 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-video overflow-hidden bg-black">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 gap-2">
                <button
                  onClick={() => setSelectedImage(item)}
                  className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                  title="Ver imagen completa"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteGalleryItem(item.id)}
                  className="p-2 rounded-xl bg-rose-500/80 backdrop-blur-md text-white hover:bg-rose-600 transition-colors ml-auto"
                  title="Eliminar de la galería"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-blue-400 text-[10px] font-bold border border-blue-500/30">
                {item.category}
              </span>
            </div>

            <div className="p-4 space-y-1">
              <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
              <p className="text-xs text-zinc-400 line-clamp-2">{item.caption || 'Sin descripción'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 text-white relative shadow-2xl">
            <button
              onClick={() => setIsCreating(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold">Agregar Imagen a la Galería</h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-300">Título</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="ej. Vista de Dashboard Interactivo"
                  className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-300">Categoría</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Web">Web</option>
                  <option value="Móvil">Móvil</option>
                  <option value="Dashboard">Dashboard</option>
                  <option value="eCommerce">eCommerce</option>
                  <option value="UI/UX">UI/UX</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-300">URL de la Imagen (Unsplash u 호스팅)</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-300">Leyenda / Descripción Corta</label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="Detalles sobre las características visuales..."
                  className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg shadow-blue-600/20"
              >
                Publicar en Galería
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Full Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-4xl w-full space-y-3 relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="rounded-3xl overflow-hidden border border-zinc-800 max-h-[75vh]">
              <img src={selectedImage.imageUrl} alt={selectedImage.title} className="w-full h-full object-contain bg-black" />
            </div>
            <div className="p-4 rounded-2xl bg-[#121215] border border-zinc-800 text-white space-y-1">
              <h3 className="font-bold text-lg">{selectedImage.title}</h3>
              <p className="text-xs text-zinc-400">{selectedImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
