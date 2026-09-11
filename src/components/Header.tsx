import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  UserPlus, 
  PlusCircle, 
  Cake, 
  Settings,
  Search,
  ChevronDown,
  Layers,
  MapPin,
  Phone,
  CheckCircle2,
  X
} from 'lucide-react';
import { MandatoConfig, Eleitor } from '../types';

interface HeaderProps {
  currentTab: string;
  onOpenNewEleitor: () => void;
  onOpenNewDemanda: () => void;
  onOpenConfig: () => void;
  onOpenWhatsAppAniversariantes: () => void;
  aniversariantesHojeCount: number;
  config: MandatoConfig;
  setIsMobileOpen: (open: boolean) => void;
  eleitores?: Eleitor[];
  onSelectEleitor?: (eleitor: Eleitor) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenNewEleitor,
  onOpenNewDemanda,
  onOpenConfig,
  onOpenWhatsAppAniversariantes,
  aniversariantesHojeCount,
  config,
  setIsMobileOpen,
  eleitores = [],
  onSelectEleitor,
}) => {
  const [isCampaignDropdownOpen, setIsCampaignDropdownOpen] = useState(false);
  const [activeContext, setActiveContext] = useState<'campanha' | 'mandato'>('campanha');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search matches
  const searchResults = searchTerm.trim().length > 0 
    ? eleitores.filter(e => 
        e.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.whatsapp.includes(searchTerm)
      ).slice(0, 5)
    : [];

  // ⌘K / Ctrl+K shortcut to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search popover when clicked outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-2.5 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between gap-3">
        
        {/* Left Side: Mobile burger + Campaign/Mandate Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Context Selector: "Campanha 2026 ▾" */}
          <div className="relative">
            <button
              onClick={() => setIsCampaignDropdownOpen(!isCampaignDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all border border-slate-200/80 shadow-2xs"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-mono">{activeContext === 'campanha' ? (config.anoEleicao || 'Campanha 2026') : `Gabinete ${config.cidade}`}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isCampaignDropdownOpen && (
              <div 
                className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setIsCampaignDropdownOpen(false)}
              >
                <div className="px-2 py-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Ambiente Operacional
                </div>
                <button
                  onClick={() => setActiveContext('campanha')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    activeContext === 'campanha' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>Campanha 2026 • Alto Alegre</span>
                  </div>
                  {activeContext === 'campanha' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>

                <button
                  onClick={() => setActiveContext('mandato')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    activeContext === 'mandato' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Mandato Legislativo (Câmara)</span>
                  </div>
                  {activeContext === 'mandato' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: Search pill "Buscar pessoa..." with Cmd+K hint */}
        <div ref={searchRef} className="relative flex-1 max-w-md mx-2 sm:mx-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar por eleitor, WhatsApp ou localidade... (⌘K)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full pl-9 pr-14 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-full border border-slate-200/90 focus:border-blue-500 focus:outline-hidden focus:ring-3 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 font-medium"
            />
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-mono text-slate-400 shadow-2xs">
                ⌘K
              </span>
            )}
          </div>

          {/* Real-time search dropdown */}
          {isSearchFocused && searchTerm.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {searchResults.length} {searchResults.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                  </div>
                  {searchResults.map((eleitor) => (
                    <div
                      key={eleitor.id}
                      onClick={() => {
                        if (onSelectEleitor) onSelectEleitor(eleitor);
                        setIsSearchFocused(false);
                        setSearchTerm('');
                      }}
                      className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">{eleitor.nome}</h5>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{eleitor.bairro}</span>
                          <span>•</span>
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{eleitor.whatsapp}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {eleitor.apoio}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  Nenhuma pessoa encontrada com o termo "{searchTerm}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Birthday alert button */}
          {aniversariantesHojeCount > 0 && (
            <button
              onClick={onOpenWhatsAppAniversariantes}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-all"
              title={`${aniversariantesHojeCount} aniversariante(s) hoje`}
            >
              <Cake className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">{aniversariantesHojeCount} Hoje</span>
              <span className="sm:hidden">{aniversariantesHojeCount}</span>
            </button>
          )}

          {/* Quick Demanda button */}
          <button
            onClick={onOpenNewDemanda}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-600" />
            <span>Demanda</span>
          </button>

          {/* Quick Eleitor button */}
          <button
            onClick={onOpenNewEleitor}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cadastrar Pessoa</span>
            <span className="sm:hidden">Pessoa</span>
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenConfig}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            title="Configurações do Mandato"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
