import React, { useState } from 'react';
import { 
  Landmark, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Building, 
  MapPin, 
  Send,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { EmendaParlamentar, MandatoConfig, Eleitor } from '../types';

interface EmendasParlamentaresProps {
  emendas: EmendaParlamentar[];
  eleitores: Eleitor[];
  config: MandatoConfig;
  onAddEmenda: (emenda: Omit<EmendaParlamentar, 'id'>) => void;
  onBroadcastEmenda: (emenda: EmendaParlamentar) => void;
}

export const EmendasParlamentares: React.FC<EmendasParlamentaresProps> = ({
  emendas,
  eleitores,
  config,
  onAddEmenda,
  onBroadcastEmenda,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ano: 2026,
    numero: `EM-${String(emendas.length + 10).padStart(3, '0')}/2026`,
    objeto: '',
    beneficiario: '',
    bairro: '',
    valorPrevisto: 250000,
    valorLiquidado: 0,
    statusExecucao: 'Empenhado' as any,
  });

  const totalPrevisto = emendas.reduce((acc, curr) => acc + curr.valorPrevisto, 0);
  const totalLiquidado = emendas.reduce((acc, curr) => acc + curr.valorLiquidado, 0);
  const entregues = emendas.filter(e => e.statusExecucao === 'Entregue').length;

  const filteredEmendas = emendas.filter(e =>
    e.objeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.beneficiario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.numero.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.objeto || !formData.beneficiario) return;
    onAddEmenda(formData);
    setShowModal(false);
    setFormData({
      ano: 2026,
      numero: `EM-${String(emendas.length + 11).padStart(3, '0')}/2026`,
      objeto: '',
      beneficiario: '',
      bairro: '',
      valorPrevisto: 250000,
      valorLiquidado: 0,
      statusExecucao: 'Empenhado',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Entregue': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Em Execução': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Empenhado': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Planejamento': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-600" />
              Gestão de Emendas Parlamentares & Recursos
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Acompanhamento de emendas impositivas e orçamentárias do mandato de {config.nomeParlamentar}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Emenda</span>
          </button>
        </div>

        {/* Financial KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-3 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold">Total em Emendas Destinadas</span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              R$ {(totalPrevisto / 1000).toLocaleString('pt-BR')} mil
            </p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <span className="text-xs text-emerald-800 font-semibold">Recursos Pagos / Executados</span>
            <p className="text-2xl font-black text-emerald-900 mt-0.5">
              R$ {(totalLiquidado / 1000).toLocaleString('pt-BR')} mil
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <span className="text-xs text-purple-800 font-semibold">Obras e Projetos Entregues</span>
            <p className="text-2xl font-black text-purple-900 mt-0.5">
              {entregues} de {emendas.length} entregas
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Buscar emendas por objeto, beneficiário, bairro ou número..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-hidden text-slate-700"
        />
      </div>

      {/* Amendments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEmendas.map(emenda => {
          const eleitoresNoBairro = eleitores.filter(e => e.bairro === emenda.bairro).length;
          const percentualPago = emenda.valorPrevisto > 0 ? Math.round((emenda.valorLiquidado / emenda.valorPrevisto) * 100) : 0;

          return (
            <div 
              key={emenda.id}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {emenda.numero}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(emenda.statusExecucao)}`}>
                    {emenda.statusExecucao}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {emenda.objeto}
                </h3>

                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <p className="flex items-center gap-1 font-semibold text-slate-800">
                    <Building className="w-3.5 h-3.5 text-slate-400" /> Beneficiário: {emenda.beneficiario}
                  </p>
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Região / Bairro: {emenda.bairro}
                  </p>
                </div>
              </div>

              {/* Values & Progress */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-medium">Valor da Emenda:</span>
                  <span className="text-base font-extrabold text-emerald-800">
                    R$ {emenda.valorPrevisto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${percentualPago}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Pago: R$ {emenda.valorLiquidado.toLocaleString('pt-BR')} ({percentualPago}%)</span>
                  <span>{eleitoresNoBairro} eleitores no bairro</span>
                </div>

                {/* Broadcast Action */}
                <button
                  onClick={() => onBroadcastEmenda(emenda)}
                  className="w-full mt-2 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-emerald-200"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Divulgar Conquista aos Eleitores no WhatsApp</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Emenda Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Landmark className="w-5 h-5 text-emerald-600" />
                Cadastrar Emenda Parlamentar
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nº da Emenda *</label>
                  <input
                    type="text"
                    required
                    value={formData.numero}
                    onChange={e => setFormData({ ...formData, numero: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ano</label>
                  <input
                    type="number"
                    value={formData.ano}
                    onChange={e => setFormData({ ...formData, ano: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Objeto / Destinação do Recurso *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ex: Aquisição de ambulância / Reforma da praça e pavimentação..."
                  value={formData.objeto}
                  onChange={e => setFormData({ ...formData, objeto: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Órgão / Entidade Beneficiária *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Posto de Saúde Vila do Taiano / Associação dos Produtores"
                  value={formData.beneficiario}
                  onChange={e => setFormData({ ...formData, beneficiario: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bairro / Localidade Contemplada</label>
                <input
                  type="text"
                  placeholder="Ex: Polo Taiano, Centro, Vila Reislândia"
                  value={formData.bairro}
                  onChange={e => setFormData({ ...formData, bairro: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Valor Destinado (R$)</label>
                  <input
                    type="number"
                    step="1000"
                    value={formData.valorPrevisto}
                    onChange={e => setFormData({ ...formData, valorPrevisto: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Status de Execução</label>
                  <select
                    value={formData.statusExecucao}
                    onChange={e => setFormData({ ...formData, statusExecucao: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Planejamento">Planejamento</option>
                    <option value="Empenhado">Empenhado</option>
                    <option value="Em Execução">Em Execução</option>
                    <option value="Entregue">Entregue</option>
                  </select>
                </div>
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
                  Salvar Emenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
