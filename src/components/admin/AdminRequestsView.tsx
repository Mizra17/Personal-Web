import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuoteRequest } from '../../types';
import {
  Inbox,
  CheckCircle2,
  Clock,
  Trash2,
  MessageSquare,
  Mail,
  Phone,
  Eye,
  X,
  FileText
} from 'lucide-react';

export const AdminRequestsView: React.FC = () => {
  const { quoteRequests, updateQuoteRequestStatus, deleteQuoteRequest } = useApp();
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredRequests = statusFilter === 'todos'
    ? quoteRequests
    : quoteRequests.filter(r => r.status === statusFilter);

  const openDetails = (req: QuoteRequest) => {
    setSelectedRequest(req);
    setInternalNotes(req.internalNotes || '');
  };

  const handleSaveNotes = () => {
    if (selectedRequest) {
      updateQuoteRequestStatus(selectedRequest.id, selectedRequest.status, internalNotes);
      setSelectedRequest(prev => prev ? { ...prev, internalNotes } : null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Gestión de Solicitudes y Cotizaciones</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Revisa, actualiza el estado y gestiona las propuestas enviadas por clientes potenciales.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#121215] p-1 rounded-2xl border border-zinc-800">
          {['todos', 'pendiente', 'en_revision', 'en_proceso', 'finalizado'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === st ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {st === 'todos' ? 'Todos' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="p-6 rounded-3xl bg-[#121215] border border-zinc-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-bold uppercase">
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Proyecto</th>
                <th className="pb-3">Presupuesto</th>
                <th className="pb-3">Fecha</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-bold text-white text-sm">{req.clientName}</div>
                    <div className="text-[10px] text-zinc-400">{req.email} • {req.phone}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-zinc-200">{req.projectType}</div>
                    <div className="text-[10px] text-zinc-400 truncate max-w-xs">{req.description}</div>
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-emerald-400">{req.estimatedBudget}</span>
                  </td>
                  <td className="py-3 text-zinc-400 font-mono text-[11px]">
                    {req.createdAt}
                  </td>
                  <td className="py-3">
                    <select
                      value={req.status}
                      onChange={(e) => updateQuoteRequestStatus(req.id, e.target.value as any)}
                      className={`px-2.5 py-1 rounded-xl font-bold text-[11px] bg-[#09090b] border border-zinc-800 ${
                        req.status === 'pendiente' ? 'text-amber-400' :
                        req.status === 'en_revision' ? 'text-blue-400' :
                        req.status === 'en_proceso' ? 'text-purple-400' : 'text-emerald-400'
                      }`}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_revision">En revisión</option>
                      <option value="en_proceso">En proceso</option>
                      <option value="finalizado">Finalizado</option>
                    </select>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openDetails(req)}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                        title="Ver Detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteQuoteRequest(req.id)}
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

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl max-w-xl w-full p-6 space-y-6 text-white relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedRequest(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs text-blue-400 font-mono">Solicitud #{selectedRequest.id}</span>
              <h3 className="text-2xl font-extrabold">{selectedRequest.clientName}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#09090b] border border-zinc-800 text-xs">
              <div>
                <span className="text-zinc-400 block">Correo:</span>
                <span className="font-bold text-white">{selectedRequest.email}</span>
              </div>
              <div>
                <span className="text-zinc-400 block">Teléfono:</span>
                <span className="font-bold text-white">{selectedRequest.phone}</span>
              </div>
              <div>
                <span className="text-zinc-400 block">Presupuesto:</span>
                <span className="font-bold text-emerald-400">{selectedRequest.estimatedBudget}</span>
              </div>
              <div>
                <span className="text-zinc-400 block">Fecha Lanzamiento:</span>
                <span className="font-bold text-white">{selectedRequest.estimatedDate}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-zinc-400 uppercase">Descripción de la Idea</h4>
              <p className="p-4 rounded-2xl bg-[#09090b] border border-zinc-800 text-xs leading-relaxed text-zinc-200 whitespace-pre-line">
                {selectedRequest.description}
              </p>
            </div>

            {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-400 uppercase">Archivos Adjuntos</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {selectedRequest.attachments.map((att, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                      📄 {att}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase">Notas Internas del Administrador</h4>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={e => setInternalNotes(e.target.value)}
                placeholder="Escribe comentarios privados sobre la negociación o cotización..."
                className="w-full p-3 rounded-2xl bg-[#09090b] border border-zinc-800 text-xs text-white focus:outline-none focus:border-blue-500"
              ></textarea>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/20"
              >
                Guardar Notas
              </button>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
              <a
                href={`https://wa.me/${selectedRequest.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(selectedRequest.clientName)},%20he%20revisado%20tu%20solicitud%20de%20cotizaci%C3%B3n.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Responder por WhatsApp</span>
              </a>

              <a
                href={`mailto:${selectedRequest.email}?subject=Cotización%20de%20Proyecto%20-${encodeURIComponent(selectedRequest.projectType)}`}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Responder por Correo</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
