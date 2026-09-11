import React, { useState } from 'react';
import { 
  FileText, 
  X, 
  Send, 
  Sparkles, 
  MapPin, 
  User, 
  Phone, 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Plus
} from 'lucide-react';
import { Demanda, StatusDemanda } from '../../types';

interface DemandaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  demanda: Demanda | null;
  onUpdateStatus: (demandaId: string, novoStatus: StatusDemanda, observacao?: string) => void;
  onAddHistorico: (demandaId: string, observacao: string) => void;
  onGenerateOficio: (demanda: Demanda) => void;
  onSendWhatsApp: (demanda: Demanda) => void;
}

export const DemandaDetailsModal: React.FC<DemandaDetailsModalProps> = ({
  isOpen,
  onClose,
  demanda,
  onUpdateStatus,
  onAddHistorico,
  onGenerateOficio,
  onSendWhatsApp,
}) => {
  const [novoAndamento, setNovoAndamento] = useState('');

  if (!isOpen || !demanda) return null;

  const handleAddAndamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoAndamento.trim()) return;
    onAddHistorico(demanda.id, novoAndamento.trim());
    setNovoAndamento('');
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
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">
                {demanda.protocolo}
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(demanda.status)}`}>
                {demanda.status}
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                {demanda.categoria}
              </span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mt-1.5 leading-snug">
              {demanda.titulo}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Citizen Info & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Cidadão Requerente</span>
            <span className="font-bold text-slate-900 text-sm">{demanda.eleitorNome}</span>
            <p className="text-slate-500 mt-0.5 flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-600" /> {demanda.eleitorTelefone}
            </p>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Localidade / Destino</span>
            <p className="font-semibold text-slate-800 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Bairro: {demanda.bairro}
            </p>
            <p className="text-slate-600 flex items-center gap-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" /> Órgão: {demanda.orgaoDestino}
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <span className="font-bold text-slate-700 text-xs block mb-1">Descrição do Requerimento:</span>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {demanda.descricao}
          </div>
        </div>

        {/* Timeline / Tramitação */}
        <div className="space-y-3">
          <span className="font-bold text-slate-800 text-xs block">
            Linha do Tempo de Tramitação ({demanda.historico.length} registros)
          </span>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {demanda.historico.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border-l-2 border-emerald-500 text-xs space-y-0.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-800">{item.assessor}</span>
                  <span className="text-slate-400 font-mono">{item.data}</span>
                </div>
                <p className="text-slate-600">{item.descricao}</p>
              </div>
            ))}
          </div>

          {/* Add note form */}
          <form onSubmit={handleAddAndamento} className="flex gap-2">
            <input
              type="text"
              placeholder="Adicionar novo andamento à tramitação..."
              value={novoAndamento}
              onChange={e => setNovoAndamento(e.target.value)}
              className="flex-1 p-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onGenerateOficio(demanda);
              }}
              className="px-3.5 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold border border-indigo-200 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Gerar Ofício Oficial IA</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onSendWhatsApp(demanda);
              }}
              className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-emerald-600" />
              <span>Avisar no WhatsApp</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {demanda.status !== 'Concluída' && (
              <button
                onClick={() => {
                  onUpdateStatus(demanda.id, 'Concluída', 'Demanda atendida com sucesso pelo gabinete!');
                  onClose();
                }}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Marcar como Concluída</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
