import React, { useState } from 'react';
import { 
  Award, 
  Plus, 
  Search, 
  Target, 
  Users, 
  Phone, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle2, 
  Send,
  AlertCircle
} from 'lucide-react';
import { Lideranca, Eleitor, MandatoConfig } from '../types';

interface LiderancasCampanhaProps {
  liderancas: Lideranca[];
  eleitores: Eleitor[];
  config: MandatoConfig;
  onAddLideranca: (lideranca: Omit<Lideranca, 'id'>) => void;
}

export const LiderancasCampanha: React.FC<LiderancasCampanhaProps> = ({
  liderancas,
  eleitores,
  config,
  onAddLideranca,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    bairroPrincipal: '',
    metaVotos: 500,
    eleitoresCaptados: 0,
    grauInfluencia: 'Alto' as 'Alto' | 'Médio' | 'Muito Alto',
    observacao: '',
  });

  const filteredLiderancas = liderancas.filter(l => 
    l.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.bairroPrincipal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.whatsapp) return;
    onAddLideranca(formData);
    setShowModal(false);
    setFormData({
      nome: '',
      whatsapp: '',
      bairroPrincipal: '',
      metaVotos: 500,
      eleitoresCaptados: 0,
      grauInfluencia: 'Alto',
      observacao: '',
    });
  };

  const openWhatsApp = (phone: string, nome: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const text = encodeURIComponent(`Olá ${nome}, tudo bem? Aqui é do Gabinete do ${config.cargo} ${config.nomeParlamentar}. Gostaria de alinhar nossas atividades e metas de apoio na região!`);
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
  };

  const totalMetaGabinete = liderancas.reduce((acc, l) => acc + l.metaVotos, 0);
  const totalCaptados = liderancas.reduce((acc, l) => acc + l.eleitoresCaptados, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-900 text-white shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                </span>
                ARTICULAÇÃO TERRITORIAL
              </span>
              <span className="bg-slate-100 text-slate-800 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border border-slate-200">
                {config.cidade} - {config.uf}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                Multiplicadores Eleitorais
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Lideranças Comunitárias & Articulação de Votos
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Gestão da rede de articuladores, multiplicadores e cabos eleitorais do mandato de {config.nomeParlamentar} em Alto Alegre
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Liderança</span>
            </button>
          </div>
        </div>

        {/* Global Leadership KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 mt-4 border-t border-slate-100">
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-400"></div>
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Total de Lideranças</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-mono">{liderancas.length}</p>
          </div>
          <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500"></div>
            <span className="text-[11px] font-mono font-bold text-amber-800 uppercase tracking-wider">Meta Consolidada de Votos</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-1 font-mono">{totalMetaGabinete.toLocaleString('pt-BR')}</p>
          </div>
          <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500"></div>
            <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-wider">Eleitores Conectados</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-1 font-mono">{totalCaptados.toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Buscar por nome da liderança ou bairro de atuação..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-hidden text-slate-700"
        />
      </div>

      {/* Leadership Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLiderancas.map(lider => {
          const percentual = Math.min(100, Math.round((lider.eleitoresCaptados / lider.metaVotos) * 100));
          return (
            <div 
              key={lider.id}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{lider.nome}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      lider.grauInfluencia === 'Muito Alto' 
                        ? 'bg-amber-100 text-amber-900 border-amber-300' 
                        : 'bg-blue-100 text-blue-900 border-blue-300'
                    }`}>
                      {lider.grauInfluencia}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    📍 Base: <b className="text-slate-700">{lider.bairroPrincipal}</b>
                  </p>
                </div>

                <button
                  onClick={() => openWhatsApp(lider.whatsapp, lider.nome)}
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors border border-emerald-200"
                  title="Conversar com liderança no WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>

              {/* Progress & Target */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Engajamento & Meta</span>
                  <span className="text-slate-800 font-bold">
                    {lider.eleitoresCaptados} de {lider.metaVotos} votos ({percentual}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentual}%` }}
                  ></div>
                </div>
              </div>

              {lider.observacao && (
                <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 italic">
                  "{lider.observacao}"
                </p>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Phone className="w-3 h-3 text-emerald-600" /> {lider.whatsapp}
                </span>
                <span className="text-slate-400">Multiplicador do Gabinete</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Lideranca */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                Cadastrar Nova Liderança
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nome da Liderança *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pastor Marcos / Dona Maria da Associação"
                  value={formData.nome}
                  onChange={e => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">WhatsApp de Contato *</label>
                <input
                  type="text"
                  required
                  placeholder="DDD + Número (Ex: 19998877665)"
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bairro / Polo Principal de Atuação</label>
                <input
                  type="text"
                  placeholder="Ex: Polo Taiano, Centro, Vila Reislândia"
                  value={formData.bairroPrincipal}
                  onChange={e => setFormData({ ...formData, bairroPrincipal: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Meta de Votos</label>
                  <input
                    type="number"
                    value={formData.metaVotos}
                    onChange={e => setFormData({ ...formData, metaVotos: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Grau de Influência</label>
                  <select
                    value={formData.grauInfluencia}
                    onChange={e => setFormData({ ...formData, grauInfluencia: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Médio">Médio</option>
                    <option value="Alto">Alto</option>
                    <option value="Muito Alto">Muito Alto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Observações do Gabinete</label>
                <textarea
                  rows={3}
                  placeholder="Perfil de liderança, grupos que mobiliza, eventos..."
                  value={formData.observacao}
                  onChange={e => setFormData({ ...formData, observacao: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Salvar Liderança
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
