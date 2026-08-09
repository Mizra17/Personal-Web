import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContactMessage } from '../../types';
import { Mail, MessageSquare, Trash2, Eye, CheckCircle2, Clock, Filter, X } from 'lucide-react';

export const AdminMessagesView: React.FC = () => {
  const { messages, markMessageStatus, deleteMessage } = useApp();
  const [statusFilter, setStatusFilter] = useState<'todos' | 'nuevo' | 'leido' | 'respondido'>('todos');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const filteredMessages = messages.filter((msg) => {
    if (statusFilter === 'todos') return true;
    return msg.status === statusFilter;
  });

  const unreadCount = messages.filter(m => m.status === 'nuevo').length;

  const openMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'nuevo') {
      markMessageStatus(msg.id, 'leido');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-white">Mensajes de Contacto</h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold animate-pulse">
                {unreadCount} sin leer
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400">Bandeja de mensajes directos recibidos desde el formulario de contacto público</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#121215] p-1 rounded-2xl border border-zinc-800 self-start sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-zinc-400 ml-2 mr-1" />
          {(['todos', 'nuevo', 'leido', 'respondido'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === st ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="p-6 rounded-3xl bg-[#121215] border border-zinc-800 space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Mail className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-sm font-semibold text-zinc-400">No hay mensajes en esta categoría</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-bold uppercase">
                  <th className="pb-3">Remitente</th>
                  <th className="pb-3">Asunto / Mensaje</th>
                  <th className="pb-3">Fecha</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {filteredMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="font-bold text-white text-sm">{msg.name}</div>
                      <div className="text-[10px] text-zinc-400">{msg.email} {msg.phone && `• ${msg.phone}`}</div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="font-semibold text-zinc-200">{msg.subject}</div>
                      <div className="text-[10px] text-zinc-400 truncate max-w-sm">{msg.message}</div>
                    </td>
                    <td className="py-3.5 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                      {msg.createdAt}
                    </td>
                    <td className="py-3.5">
                      <select
                        value={msg.status}
                        onChange={(e) => markMessageStatus(msg.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-xl font-bold text-[11px] bg-[#09090b] border border-zinc-800 ${
                          msg.status === 'nuevo' ? 'text-blue-400 border-blue-500/30' :
                          msg.status === 'leido' ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        <option value="nuevo">Nuevo</option>
                        <option value="leido">Leído</option>
                        <option value="respondido">Respondido</option>
                      </select>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openMessage(msg)}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                          title="Ver Mensaje Completo"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                          title="Eliminar Mensaje"
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
        )}
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-5 text-white relative shadow-2xl">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-mono text-zinc-400">{selectedMessage.createdAt}</span>
              <h3 className="text-xl font-extrabold text-white mt-1">{selectedMessage.subject}</h3>
            </div>

            <div className="p-4 rounded-2xl bg-[#09090b] border border-zinc-800 text-xs space-y-1">
              <div className="font-bold text-white text-sm">{selectedMessage.name}</div>
              <div className="text-zinc-400">{selectedMessage.email}</div>
              {selectedMessage.phone && <div className="text-blue-400 font-mono">{selectedMessage.phone}</div>}
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-zinc-400 uppercase">Mensaje</h4>
              <p className="p-4 rounded-2xl bg-[#09090b] border border-zinc-800 text-xs leading-relaxed text-zinc-200 whitespace-pre-line max-h-60 overflow-y-auto">
                {selectedMessage.message}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              {selectedMessage.phone && (
                <a
                  href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(selectedMessage.name)},%20he%20recibido%20tu%20mensaje.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => markMessageStatus(selectedMessage.id, 'respondido')}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}

              <a
                href={`mailto:${selectedMessage.email}?subject=RE:%20${encodeURIComponent(selectedMessage.subject)}`}
                onClick={() => markMessageStatus(selectedMessage.id, 'respondido')}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Correo Electrónico</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
