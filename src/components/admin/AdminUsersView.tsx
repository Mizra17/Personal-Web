import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, Shield, UserX, UserCheck, Trash2, KeyRound } from 'lucide-react';

export const AdminUsersView: React.FC = () => {
  const { users, updateUserStatus, updateUserRole, deleteUser } = useApp();
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Gestión de Usuarios & Roles</h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Administra los roles (<code className="text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded font-mono">admin</code> / <code className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono">cliente</code>) y el estado de acceso de la tabla de usuarios de Supabase.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#121215] border border-zinc-800 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-[#121215] border border-zinc-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-bold uppercase">
                <th className="pb-3">Usuario</th>
                <th className="pb-3">Rol asignado (Supabase DB)</th>
                <th className="pb-3">Registro</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredUsers.map((usr) => (
                <tr key={usr.id} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="font-bold text-white text-sm">{usr.name}</div>
                    <div className="text-[10px] text-zinc-400">{usr.email} {usr.phone && `• ${usr.phone}`}</div>
                  </td>
                  <td className="py-3.5">
                    <select
                      value={usr.role}
                      onChange={e => updateUserRole(usr.id, e.target.value as any)}
                      className={`px-2.5 py-1 rounded-xl font-bold text-[11px] bg-[#09090b] border border-zinc-800 ${
                        usr.role === 'admin' ? 'text-purple-400 border-purple-500/30' : 'text-blue-400 border-blue-500/30'
                      }`}
                    >
                      <option value="user">user</option>
                      <option value="cliente">cliente</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="py-3.5 text-zinc-400 font-mono text-[11px]">
                    {usr.registeredAt}
                  </td>
                  <td className="py-3.5">
                    <select
                      value={usr.status}
                      onChange={e => updateUserStatus(usr.id, e.target.value as any)}
                      className={`px-2.5 py-1 rounded-xl font-bold text-[11px] bg-[#09090b] border border-zinc-800 ${
                        usr.status === 'activo' ? 'text-emerald-400' :
                        usr.status === 'bloqueado' ? 'text-rose-400' : 'text-amber-400'
                      }`}
                    >
                      <option value="activo">Activo</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="bloqueado">Bloqueado</option>
                    </select>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => deleteUser(usr.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Eliminar Usuario"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
