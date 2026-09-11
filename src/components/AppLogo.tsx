import React from 'react';
import logoImg from '../assets/images/gabinete_logo_1789146839922.jpg';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  lightText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  lightText = false,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-xl overflow-hidden shadow-sm border border-slate-200/80 bg-white flex items-center justify-center shrink-0`}>
        <img
          src={logoImg}
          alt="Logo Gabinete Vereador Kauan Lorenço"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to elegant SVG badge if image fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <div className="overflow-hidden">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold text-sm tracking-tight truncate ${lightText ? 'text-white' : 'text-slate-900'}`}>
              Kauan Lorenço
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider shrink-0">
              Vereador
            </span>
          </div>
          <p className={`text-[11px] truncate ${lightText ? 'text-slate-400' : 'text-slate-500'}`}>
            Alto Alegre • Gabinete
          </p>
        </div>
      )}
    </div>
  );
};
