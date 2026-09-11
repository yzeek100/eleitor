import React from 'react';
import { 
  LayoutDashboard, 
  Target,
  Users, 
  FileText, 
  MapPin, 
  Award, 
  MessageSquare, 
  Landmark, 
  Sparkles, 
  Globe, 
  Settings,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { MandatoConfig } from '../types';
import { AppLogo } from './AppLogo';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  config: MandatoConfig;
  totalEleitores: number;
  totalDemandas: number;
  aniversariantesHojeCount: number;
  onOpenConfig: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  config,
  totalEleitores,
  totalDemandas,
  aniversariantesHojeCount,
  onOpenConfig,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navSections = [
    {
      title: 'COMANDO & ESTRATÉGIA',
      items: [
        { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard, badge: 'Ao Vivo', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
        { id: 'pesquisas', label: 'Pesquisas & Metas', icon: Target, badge: '520 Votos', badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/40' },
        { id: 'raiox', label: 'Raio-X Territorial', icon: MapPin, badge: 'Alto Alegre', badgeColor: 'bg-slate-700/80 text-slate-300' },
      ],
    },
    {
      title: 'OPERAÇÃO DE BASE',
      items: [
        { id: 'eleitores', label: 'Pessoas & CRM', icon: Users, badge: totalEleitores.toString(), badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700' },
        { id: 'liderancas', label: 'Lideranças & Polos', icon: Award, badge: null, badgeColor: null },
        { 
          id: 'whatsapp', 
          label: 'Central WhatsApp', 
          icon: MessageSquare, 
          badge: aniversariantesHojeCount > 0 ? `${aniversariantesHojeCount} Aniv.` : 'Disparo', 
          badgeColor: aniversariantesHojeCount > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
        },
      ],
    },
    {
      title: 'MANDATO & GABINETE',
      items: [
        { id: 'demandas', label: 'Demandas & Obras', icon: FileText, badge: totalDemandas.toString(), badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700' },
        { id: 'emendas', label: 'Emendas & Recursos', icon: Landmark, badge: 'R$ 1.2M', badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/40' },
        { id: 'redator-ia', label: 'Redator Legislativo IA', icon: Sparkles, badge: 'Ofícios', badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' },
        { id: 'portal-publico', label: 'Portal do Cidadão', icon: Globe, badge: 'Online', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
      ],
    },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    if (isMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0b0f19] text-slate-200 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800/80 shadow-2xl
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header with War Room Status */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
          <AppLogo size="md" lightText={true} />
          
          <button
            onClick={onOpenConfig}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all border border-transparent hover:border-slate-700"
            title="Configurações do Gabinete"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Mandate Identity Card (Executive War Room style) */}
        <div className="p-3 mx-3 my-2.5 bg-gradient-to-b from-slate-900/90 to-slate-900/50 rounded-xl border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-400">
                SALA DE SITUAÇÃO
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded-md border border-slate-700/60">
              {config.partido} • 15
            </span>
          </div>

          <div className="mt-1">
            <h3 className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
              <span>{config.nomeParlamentar}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {config.cargo}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-1 font-mono">
              <MapPin className="w-3 h-3 text-slate-500" />
              <span>{config.cidade} - {config.uf}</span>
            </p>
          </div>

          {/* Quick Progress to Target */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-400">Meta Eleitoral:</span>
              <span className="text-white font-bold">520 votos</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((totalEleitores / (config.metaTotalVotos || 520)) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Navigation Menu by Sections */}
        <nav className="flex-1 overflow-y-auto px-2.5 space-y-4 py-2 text-sm scrollbar-thin scrollbar-thumb-slate-800">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase font-bold tracking-wider text-slate-500">
                {section.title}
              </div>
              
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-btn-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 font-medium group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-950/60 border-l-3 border-emerald-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border-l-3 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                      <span className="text-xs truncate tracking-tight">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md shrink-0 ${
                        item.badgeColor 
                          ? item.badgeColor 
                          : isActive 
                            ? 'bg-blue-800 text-white' 
                            : 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* System Telemetry Footer */}
        <div className="p-3 mx-2.5 mb-2 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sincronizado</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">TSE 2026</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/60">
            <span className="flex items-center gap-1">
              <CalendarCheck className="w-3 h-3 text-blue-400" />
              Alto Alegre / RR
            </span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
        </div>
      </aside>
    </>
  );
};
