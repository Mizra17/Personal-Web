import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  X,
  AlertCircle,
  Mail,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Sparkles,
  KeyRound
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, authModalPrompt, setAuthModalPrompt, userLogin, userRegister, requestPasswordReset } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberSession, setRememberSession] = useState(true);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!showAuthModal) return null;

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleModeSwitch = (newMode: 'login' | 'register' | 'forgot') => {
    setMode(newMode);
    resetMessages();
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email.trim() || !password) {
      setErrorMessage('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const result = await userLogin(email, password, rememberSession);
      if (!result.success) {
        setErrorMessage(result.message || 'Credenciales no válidas. Revisa tu correo y contraseña.');
      } else {
        setShowAuthModal(false);
        // Clear fields
        setPassword('');
      }
    } catch {
      setErrorMessage('Ocurrió un error inesperado al intentar iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!name.trim()) {
      setErrorMessage('El nombre completo es obligatorio.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('La contraseña debe contener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    setLoading(true);
    try {
      const result = await userRegister(name, email, password);
      if (!result.success) {
        setErrorMessage(result.message || 'No se pudo completar el registro.');
      } else {
        setSuccessMessage('¡Cuenta creada exitosamente! Redirigiendo a tu panel...');
        setTimeout(() => {
          setShowAuthModal(false);
        }, 1000);
      }
    } catch {
      setErrorMessage('Ocurrió un error al procesar el registro.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);
    try {
      const result = await requestPasswordReset(email);
      if (result.success) {
        setSuccessMessage(result.message);
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage('Ocurrió un error al enviar el enlace de recuperación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121215] text-white border border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative font-sans">
        {/* Close Button */}
        <button
          onClick={() => {
            setShowAuthModal(false);
            if (setAuthModalPrompt) setAuthModalPrompt(null);
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Prompt Banner for Guest restrictions / Quote requests */}
        {authModalPrompt && (
          <div className="p-3.5 rounded-2xl bg-blue-500/15 border border-blue-500/40 text-blue-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200 shadow-md">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 text-blue-400 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-white text-xs">Aviso de Seguridad</p>
              <p className="text-zinc-300 leading-relaxed">{authModalPrompt}</p>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
            {mode === 'forgot' ? (
              <KeyRound className="w-6 h-6" />
            ) : mode === 'register' ? (
              <Sparkles className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {mode === 'login' && 'Iniciar Sesión'}
            {mode === 'register' && 'Crear Cuenta'}
            {mode === 'forgot' && 'Recuperar Contraseña'}
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
            {mode === 'login' && 'Accede a tu panel para monitorear proyectos, solicitudes y configuraciones.'}
            {mode === 'register' && 'Regístrate para solicitar cotizaciones y darle seguimiento a tus proyectos.'}
            {mode === 'forgot' && 'Ingresa tu correo y te enviaremos un enlace seguro para restablecer tu contraseña.'}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs (Login / Register) */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#09090b] border border-zinc-800">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('register')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Crear Cuenta
            </button>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Correo Electrónico</span>
              </label>
              <input
                type="email"
                required
                disabled={loading}
                placeholder="tu.correo@ejemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  resetMessages();
                }}
                className="w-full px-4 py-3 rounded-xl bg-[#09090b] border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Contraseña</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('forgot')}
                  className="text-[11px] text-blue-400 hover:underline font-semibold"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={loading}
                  placeholder="Escribe tu contraseña..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    resetMessages();
                  }}
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-[#09090b] border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-white"
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Session Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-300 font-medium">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="rounded border-zinc-800 bg-[#09090b] text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Recordar mi sesión</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validando credenciales...</span>
                </>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>
          </form>
        )}

        {/* 2. REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Nombre Completo</span>
              </label>
              <input
                type="text"
                required
                disabled={loading}
                placeholder="Ej. María González"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  resetMessages();
                }}
                className="w-full px-4 py-3 rounded-xl bg-[#09090b] border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Correo Electrónico</span>
              </label>
              <input
                type="email"
                required
                disabled={loading}
                placeholder="tu.correo@ejemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  resetMessages();
                }}
                className="w-full px-4 py-3 rounded-xl bg-[#09090b] border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Contraseña (Mínimo 6 caracteres)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    resetMessages();
                  }}
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-[#09090b] border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Confirmar Contraseña</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    resetMessages();
                  }}
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-[#09090b] border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Client Role Notice */}
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] leading-relaxed">
              *Las cuentas creadas públicamente se asignan automáticamente con el rol <code className="bg-[#09090b] px-1.5 py-0.5 rounded text-blue-400 font-mono">cliente</code>.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creando tu cuenta...</span>
                </>
              ) : (
                <span>Completar Registro</span>
              )}
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Correo Electrónico Registrado</span>
              </label>
              <input
                type="email"
                required
                disabled={loading}
                placeholder="tu.correo@ejemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  resetMessages();
                }}
                className="w-full px-4 py-3 rounded-xl bg-[#09090b] border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando solicitud...</span>
                </>
              ) : (
                <span>Enviar Enlace de Recuperación</span>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al inicio de sesión</span>
              </button>
            </div>
          </form>
        )}
        {/* Cancel Action Button */}
        <div className="pt-3 border-t border-zinc-800/80 text-center">
          <button
            type="button"
            onClick={() => {
              setShowAuthModal(false);
              if (setAuthModalPrompt) setAuthModalPrompt(null);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold border border-zinc-800 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
