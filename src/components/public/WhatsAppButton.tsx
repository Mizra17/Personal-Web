import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useApp();

  return (
    <a
      href={`https://wa.me/${settings.whatsapp}?text=Hola,%20me%20gustar%C3%ADa%20obtener%20informaci%C3%B3n%20sobre%20sus%20servicios%20de%20desarrollo.`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center group"
      title="Contactar por WhatsApp"
      aria-label="WhatsApp Directo"
    >
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping"></span>
      <MessageSquare className="w-6 h-6" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 text-xs font-bold transition-all duration-300">
        Chatear en WhatsApp
      </span>
    </a>
  );
};
