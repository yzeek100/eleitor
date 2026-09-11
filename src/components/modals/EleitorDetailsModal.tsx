import React from 'react';
import { 
  User, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Cake, 
  Award, 
  FileText, 
  Send, 
  Plus, 
  Tag
} from 'lucide-react';
import { Eleitor, Demanda } from '../../types';

interface EleitorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eleitor: Eleitor | null;
  demandas: Demanda[];
  onOpenNewDemanda: (eleitor: Eleitor) => void;
  onSendWhatsApp: (eleitor: Eleitor) => void;
}

export const EleitorDetailsModal: React.FC<EleitorDetailsModalProps> = ({
  isOpen,
  onClose,
  eleitor,
  demandas,
  onOpenNewDemanda,
  onSendWhatsApp,
}) => {
  if (!isOpen || !eleitor) return null;

  const voterDemandas = demandas.filter(d => d.eleitorId === eleitor.id);

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center">
              {eleitor.nome.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">{eleitor.nome}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {eleitor.apoio}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Cadastrado no CRM do Mandato
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detailed info grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Contato Direto</span>
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" /> {eleitor.whatsapp}
            </p>
            {eleitor.email && (
              <p className="text-slate-600 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {eleitor.email}
              </p>
            )}
            {eleitor.dataNascimento && (
              <p className="text-slate-600 flex items-center gap-1.5">
                <Cake className="w-3.5 h-3.5 text-amber-500" /> Nasc: {eleitor.dataNascimento}
              </p>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Localização & Eleição</span>
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {eleitor.bairro}, {eleitor.cidade}
            </p>
            {eleitor.endereco && (
              <p className="text-slate-500 text-[11px] truncate">{eleitor.endereco}</p>
            )}
            {eleitor.zonaEleitoral && (
              <p className="text-slate-500 text-[11px]">
                Zona {eleitor.zonaEleitoral} • Seção {eleitor.secaoEleitoral}
              </p>
            )}
          </div>
        </div>

        {/* Liderança & Tags */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Liderança Articuladora:</span>
            <span className="font-bold text-slate-800">{eleitor.liderancaNome || 'Direto do Gabinete'}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-1">Tags do Perfil:</span>
            <div className="flex flex-wrap gap-1">
              {eleitor.tags.map((t, idx) => (
                <span key={idx} className="bg-white text-slate-700 font-semibold px-2 py-0.5 rounded border border-slate-300 text-[10px]">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Demanda history */}
        <div>
          <h4 className="font-bold text-slate-800 text-xs mb-2 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            Demandas Abertas por este Cidadão ({voterDemandas.length})
          </h4>

          {voterDemandas.length > 0 ? (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {voterDemandas.map(d => (
                <div key={d.id} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-600">{d.protocolo}</span>
                    <p className="font-semibold text-slate-800 truncate max-w-xs">{d.titulo}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Nenhuma demanda protocolada anteriormente.</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenNewDemanda(eleitor);
            }}
            className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-bold transition-colors border border-teal-200 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Demanda</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onSendWhatsApp(eleitor);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Abrir no WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
