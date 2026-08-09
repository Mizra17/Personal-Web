import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { UserCheck, Shield, Key, Mail, Phone, MapPin, CheckCircle2, Save, Lock } from 'lucide-react';

export const AdminProfileView: React.FC = () => {
  const { settings, updateSettings, currentUser } = useApp();

  const [name, setName] = useState(settings.developerName);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [location, setLocation] = useState(settings.location);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      developerName: name,
      email,
      phone,
      location
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Ingresa la contraseña actual');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    // Update admin session or auth local state key
    localStorage.setItem('app_admin_password_custom', newPassword);
    if (isSupabaseConfigured()) {
      supabase.auth.updateUser({ password: newPassword }).catch(() => {});
    }
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Perfil del Administrador</h2>
        <p className="text-xs text-zinc-400">Gestiona tus datos personales de contacto, credenciales de acceso y permisos de seguridad</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <div className="p-6 rounded-3xl bg-[#121215] border border-zinc-800 space-y-5 text-center flex flex-col items-center justify-center">
          <div className="relative">
            <img
              src={settings.profilePhoto}
              alt={settings.developerName}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-600/30 shadow-xl"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#121215]" title="Cuenta Activa"></span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">{settings.developerName}</h3>
            <p className="text-xs text-blue-400 font-semibold">{settings.title}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono font-bold text-[11px]">
              Rol: Administrator (Supabase DB)
            </span>
          </div>

          <div className="w-full pt-4 border-t border-zinc-800 space-y-2 text-xs text-left">
            <div className="flex items-center gap-2 text-zinc-300">
              <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
              <span className="truncate">{settings.email}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>{settings.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>{settings.location}</span>
            </div>
          </div>
        </div>

        {/* Profile Details Edit */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-[#121215] border border-zinc-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-500" />
                <span>Información General de Administrador</span>
              </h3>
              {savedSuccess && (
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px] animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" /> ¡Guardado con éxito!
                </span>
              )}
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Correo Electrónico Oficial</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Teléfono / Celular</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Ubicación / Ciudad</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios de Perfil</span>
              </button>
            </form>
          </div>

          {/* Security & Password Form */}
          <div className="p-6 rounded-3xl bg-[#121215] border border-zinc-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-500" />
                <span>Seguridad & Cambio de Contraseña</span>
              </h3>
              {passwordSuccess && (
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px] animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" /> Contraseña actualizada
                </span>
              )}
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Contraseña Actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Nueva Contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    className="w-full p-2.5 rounded-xl bg-[#09090b] border border-zinc-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
              >
                <Key className="w-4 h-4" />
                <span>Actualizar Contraseña de Acceso</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
