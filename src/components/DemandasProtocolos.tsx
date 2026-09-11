import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  PlusCircle, 
  Filter, 
  MapPin, 
  Clock, 
  Flame, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  User, 
  Calendar, 
  AlertCircle,
  Kanban,
  List,
  Printer,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { Demanda, StatusDemanda, CategoriaDemanda, MandatoConfig } from '../types';
import confetti from 'canvas-confetti';

interface DemandasProtocolosProps {
  demandas: Demanda[];
  config: MandatoConfig;
  onOpenNewDemanda: () => void;
  onSelectDemanda: (demanda: Demanda) => void;
  onGenerateOficio: (demanda: Demanda) => void;
  onSendStatusWhatsApp: (demanda: Demanda) => void;
  onUpdateDemandaStatus: (demandaId: string, novoStatus: StatusDemanda, observacao?: string) => void;
}

export const DemandasProtocolos: React.FC<DemandasProtocolosProps> = ({
  demandas,
  config,
  onOpenNewDemanda,
  onSelectDemanda,
  onGenerateOficio,
  onSendStatusWhatsApp,
  onUpdateDemandaStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todas');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const statusList: StatusDemanda[] = [
    'Recebida', 
    'Em Análise', 
    'Ofício Encaminhado', 
    'Em Execução', 
    'Concluída', 
    'Indeferida'
  ];

  const categoriasList: CategoriaDemanda[] = [
    'Saúde', 
    'Infraestrutura & Asfalto', 
    'Iluminação Pública', 
    'Educação & Creches', 
    'Segurança Pública', 
    'Meio Ambiente & Limpeza', 
    'Transporte & Trânsito', 
    'Assistência Social', 
    'Esporte & Lazer', 
    'Outros'
  ];

  const filteredDemandas = useMemo(() => {
    return demandas.filter(d => {
      const term = searchTerm.toLowerCase();
      const matchSearch = 
        !term ||
        d.protocolo.toLowerCase().includes(term) ||
        d.titulo.toLowerCase().includes(term) ||
        d.eleitorNome.toLowerCase().includes(term) ||
        d.bairro.toLowerCase().includes(term) ||
        (d.numeroOficio && d.numeroOficio.toLowerCase().includes(term));

      const matchStatus = selectedStatus === 'todos' || d.status === selectedStatus;
      const matchCategoria = selectedCategoria === 'todas' || d.categoria === selectedCategoria;

      return matchSearch && matchStatus && matchCategoria;
    });
  }, [demandas, searchTerm, selectedStatus, selectedCategoria]);

  const handleStatusChangeWithCelebration = (demanda: Demanda, novoStatus: StatusDemanda) => {
    if (novoStatus === 'Concluída' && demanda.status !== 'Concluída') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    onUpdateDemandaStatus(demanda.id, novoStatus, `Status atualizado para ${novoStatus}`);
  };

  const getStatusColor = (status: StatusDemanda) => {
    switch (status) {
      case 'Recebida': return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Em Análise': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Ofício Encaminhado': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Em Execução': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Concluída': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Indeferida': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-900 text-white shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                SISTEMA DE PROTOCOLOS
              </span>
              <span className="bg-slate-100 text-slate-800 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border border-slate-200">
                {config.cidade} - {config.uf}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                Gabinete Vereador Kauan Lorenço
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Demandas da População & Protocolos Oficiais
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Protocolo eletrônico, geração de ofícios parlamentares e notificação transparente aos cidadãos
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-inner">
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Visualização em Lista"
              >
                <List className="w-3.5 h-3.5 text-blue-600" />
                <span>Lista</span>
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Visualização Kanban"
              >
                <Kanban className="w-3.5 h-3.5 text-purple-600" />
                <span>Kanban</span>
              </button>
            </div>

            <button
              onClick={onOpenNewDemanda}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Protocolar Demanda</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por protocolo, munícipe, título, bairro ou ofício..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200/90 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/70"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200/90 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/70 font-medium"
            >
              <option value="todos">Todos os Status ({demandas.length})</option>
              {statusList.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategoria}
              onChange={e => setSelectedCategoria(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200/90 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/70 font-medium"
            >
              <option value="todas">Todas as Secretarias / Categorias</option>
              {categoriasList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* View Mode: List */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Mostrando <b>{filteredDemandas.length}</b> solicitações protocoladas</span>
            <span className="text-slate-400">Clique na demanda para ver detalhes completos e histórico</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredDemandas.length > 0 ? (
              filteredDemandas.map(demanda => (
                <div 
                  key={demanda.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div 
                    onClick={() => onSelectDemanda(demanda)}
                    className="space-y-1.5 flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {demanda.protocolo}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(demanda.status)}`}>
                        {demanda.status}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {demanda.categoria}
                      </span>
                      {demanda.prioridade === 'Urgente' && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded flex items-center gap-0.5">
                          <Flame className="w-3 h-3 text-rose-600" /> Urgente
                        </span>
                      )}
                      {demanda.numeroOficio && (
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          📄 {demanda.numeroOficio}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors">
                      {demanda.titulo}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {demanda.descricao}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {demanda.eleitorNome}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {demanda.bairro}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {demanda.orgaoDestino}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" /> Aberta em: {demanda.dataAbertura}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Status selector */}
                  <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                    {/* Status quick select */}
                    <select
                      value={demanda.status}
                      onChange={e => handleStatusChangeWithCelebration(demanda, e.target.value as StatusDemanda)}
                      className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 font-semibold bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500"
                    >
                      {statusList.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    {/* WhatsApp Notifier Button */}
                    <button
                      onClick={() => onSendStatusWhatsApp(demanda)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-colors border border-emerald-200"
                      title="Notificar Eleitor no WhatsApp com 1 clique"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">Avisar Cidadão</span>
                    </button>

                    {/* Generate / View Oficio */}
                    <button
                      onClick={() => onGenerateOficio(demanda)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-xs font-bold transition-colors border border-blue-200"
                      title="Gerar Ofício Timbrado com IA"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span className="hidden sm:inline">Ofício IA</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-sm">Nenhuma demanda encontrada</p>
                <p className="text-xs text-slate-400 mt-1">Crie um novo protocolo ou ajuste os filtros acima</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Mode: Kanban */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
          {statusList.map(colStatus => {
            const colDemandas = filteredDemandas.filter(d => d.status === colStatus);
            return (
              <div 
                key={colStatus}
                className="bg-slate-50/80 rounded-xl border border-slate-200/80 flex flex-col max-h-[700px]"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-slate-200/70 flex items-center justify-between bg-white/70 rounded-t-xl">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="font-bold text-slate-800 text-xs truncate">{colStatus}</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {colDemandas.length}
                  </span>
                </div>

                {/* Column Items */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-300">
                  {colDemandas.map(demanda => (
                    <div
                      key={demanda.id}
                      onClick={() => onSelectDemanda(demanda)}
                      className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono font-bold text-slate-500">{demanda.protocolo}</span>
                        {demanda.prioridade === 'Urgente' && (
                          <span className="text-rose-600 font-bold flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5" /> Urgente
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
                        {demanda.titulo}
                      </h4>

                      <div className="text-[11px] text-slate-500 space-y-0.5">
                        <p className="truncate">👤 {demanda.eleitorNome}</p>
                        <p className="truncate">📍 {demanda.bairro}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">{demanda.categoria}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSendStatusWhatsApp(demanda);
                          }}
                          className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5"
                          title="Enviar atualização no WhatsApp"
                        >
                          <Send className="w-2.5 h-2.5" /> WhatsApp
                        </button>
                      </div>
                    </div>
                  ))}

                  {colDemandas.length === 0 && (
                    <div className="py-6 text-center text-slate-400 text-[11px] italic">
                      Nenhuma demanda
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
