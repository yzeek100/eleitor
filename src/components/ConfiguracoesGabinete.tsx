import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  UserCheck, 
  Building, 
  Check, 
  Shield, 
  Plus, 
  Trash2,
  Users
} from 'lucide-react';
import { MandatoConfig } from '../types';

interface ConfiguracoesGabineteProps {
  config: MandatoConfig;
  onUpdateConfig: (newConfig: MandatoConfig) => void;
}

export const ConfiguracoesGabinete: React.FC<ConfiguracoesGabineteProps> = ({
  config,
  onUpdateConfig,
}) => {
  const [formData, setFormData] = useState<MandatoConfig>({
    ...config,
    assessores: config.assessores || [],
  });
  const [saved, setSaved] = useState(false);
  const [novoAssessor, setNovoAssessor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddAssessor = () => {
    if (!novoAssessor.trim()) return;
    setFormData({
      ...formData,
      assessores: [...(formData.assessores || []), novoAssessor.trim()],
    });
    setNovoAssessor('');
  };

  const handleRemoveAssessor = (idx: number) => {
    const updated = (formData.assessores || []).filter((_, i) => i !== idx);
    setFormData({ ...formData, assessores: updated });
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-600" />
              Configurações do Mandato & Gabinete
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalize o nome do parlamentar, cargo eletivo, brasão, equipe de assessores e dados oficiais
            </p>
          </div>
          {saved && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 animate-fadeIn">
              <Check className="w-4 h-4" /> Alterações salvas!
            </span>
          )}
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-6 text-xs">
        {/* Identificação do Parlamentar */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            1. Identificação do Titular do Mandato
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nome do Parlamentar *</label>
              <input
                type="text"
                required
                value={formData.nomeParlamentar}
                onChange={e => setFormData({ ...formData, nomeParlamentar: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Cargo Eletivo *</label>
              <select
                value={formData.cargo}
                onChange={e => setFormData({ ...formData, cargo: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Vereador">Vereador</option>
                <option value="Vereadora">Vereadora</option>
                <option value="Deputado Estadual">Deputado Estadual</option>
                <option value="Deputada Estadual">Deputada Estadual</option>
                <option value="Deputado Federal">Deputado Federal</option>
                <option value="Deputada Federal">Deputada Federal</option>
                <option value="Senador">Senador</option>
                <option value="Senadora">Senadora</option>
                <option value="Prefeito">Prefeito</option>
                <option value="Prefeita">Prefeita</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Partido Político *</label>
              <input
                type="text"
                required
                value={formData.partido}
                onChange={e => setFormData({ ...formData, partido: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Cidade do Mandato *</label>
              <input
                type="text"
                required
                value={formData.cidade}
                onChange={e => setFormData({ ...formData, cidade: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Estado (UF) *</label>
              <input
                type="text"
                required
                maxLength={2}
                value={formData.uf}
                onChange={e => setFormData({ ...formData, uf: e.target.value.toUpperCase() })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="font-bold text-slate-700 block mb-1">Slogan ou Lema Político</label>
            <input
              type="text"
              value={formData.slogan}
              onChange={e => setFormData({ ...formData, slogan: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
            />
          </div>
        </div>

        {/* Informações de Contato e Gabinete */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-600" />
            2. Endereço e Contatos Oficiais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Endereço do Gabinete / Câmara</label>
              <input
                type="text"
                value={formData.enderecoGabinete}
                onChange={e => setFormData({ ...formData, enderecoGabinete: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Telefone Fixo / Ramal</label>
              <input
                type="text"
                value={formData.telefoneGabinete}
                onChange={e => setFormData({ ...formData, telefoneGabinete: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Equipe de Assessores */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            3. Equipe de Assessores com Acesso ao Gabinete
          </h3>

          <div className="space-y-2 mb-3">
            {formData.assessores.map((assessor, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800">{assessor}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAssessor(idx)}
                  className="text-rose-600 hover:text-rose-800 p-1"
                  title="Remover assessor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nome do novo assessor..."
              value={novoAssessor}
              onChange={e => setNovoAssessor(e.target.value)}
              className="flex-1 p-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={handleAddAssessor}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Todas as Configurações</span>
          </button>
        </div>
      </form>
    </div>
  );
};
