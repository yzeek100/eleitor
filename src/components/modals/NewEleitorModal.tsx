import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { Eleitor, Lideranca } from '../../types';

interface NewEleitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eleitor: Omit<Eleitor, 'id' | 'criadoEm'>) => void;
  liderancas: Lideranca[];
}

export const NewEleitorModal: React.FC<NewEleitorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  liderancas,
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    cpf: '',
    dataNascimento: '',
    bairro: 'Centro',
    cidade: 'Alto Alegre - RR',
    endereco: '',
    zonaEleitoral: '',
    secaoEleitoral: '',
    tituloEleitor: '',
    apoio: 'Simpatizante' as any,
    liderancaId: '',
    liderancaNome: '',
    tags: 'Comunidade',
    observacoes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.whatsapp || !formData.bairro) return;

    const selectedLider = liderancas.find(l => l.id === formData.liderancaId);

    onSave({
      nome: formData.nome,
      whatsapp: formData.whatsapp,
      email: formData.email || undefined,
      cpf: formData.cpf || undefined,
      dataNascimento: formData.dataNascimento || undefined,
      bairro: formData.bairro,
      cidade: formData.cidade,
      endereco: formData.endereco || undefined,
      zonaEleitoral: formData.zonaEleitoral || undefined,
      secaoEleitoral: formData.secaoEleitoral || undefined,
      tituloEleitor: formData.tituloEleitor || undefined,
      apoio: formData.apoio,
      liderancaId: formData.liderancaId || undefined,
      liderancaNome: selectedLider ? selectedLider.nome : undefined,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      observacoes: formData.observacoes || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-600" />
            Cadastrar Novo Eleitor / Cidadão
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nome Completo *</label>
              <input
                type="text"
                required
                placeholder="Ex: Carlos Alberto da Silva"
                value={formData.nome}
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">WhatsApp de Contato *</label>
              <input
                type="text"
                required
                placeholder="Ex: (19) 98765-4321"
                value={formData.whatsapp}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Bairro / Localidade *</label>
              <input
                type="text"
                required
                list="bairros-alto-alegre-list"
                placeholder="Ex: Centro, Mutirão I, Vila do Taiano..."
                value={formData.bairro}
                onChange={e => setFormData({ ...formData, bairro: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
              <datalist id="bairros-alto-alegre-list">
                <option value="Centro" />
                <option value="Mutirão I" />
                <option value="Mutirão II" />
                <option value="Felicidade" />
                <option value="Cidade Nova" />
                <option value="Novo Horizonte" />
                <option value="Vila do Taiano" />
                <option value="Vila São Silvestre" />
                <option value="Vila Reislândia (Paredão)" />
                <option value="Vila São Sebastião" />
                <option value="Vila Santa Rita" />
                <option value="Vila Recrear" />
                <option value="Assentamento Cedro" />
              </datalist>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Cidade</label>
              <input
                type="text"
                value={formData.cidade}
                onChange={e => setFormData({ ...formData, cidade: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Data Nascimento</label>
              <input
                type="date"
                value={formData.dataNascimento}
                onChange={e => setFormData({ ...formData, dataNascimento: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Endereço Residencial</label>
            <input
              type="text"
              placeholder="Rua, número, complemento..."
              value={formData.endereco}
              onChange={e => setFormData({ ...formData, endereco: e.target.value })}
              className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Apoio Político *</label>
              <select
                value={formData.apoio}
                onChange={e => setFormData({ ...formData, apoio: e.target.value as any })}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="Fiel">Fiel (Multiplicador)</option>
                <option value="Simpatizante">Simpatizante</option>
                <option value="Indeciso">Indeciso</option>
                <option value="Oposição">Oposição</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Liderança Vinculada</label>
              <select
                value={formData.liderancaId}
                onChange={e => setFormData({ ...formData, liderancaId: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Nenhuma liderança</option>
                {liderancas.map(l => (
                  <option key={l.id} value={l.id}>{l.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tags (separadas por vírgula)</label>
              <input
                type="text"
                placeholder="Ex: Saúde, Lider, Igreja"
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">CPF (Opcional)</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Zona Eleitoral</label>
              <input
                type="text"
                placeholder="Ex: 033"
                value={formData.zonaEleitoral}
                onChange={e => setFormData({ ...formData, zonaEleitoral: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Seção Eleitoral</label>
              <input
                type="text"
                placeholder="Ex: 0142"
                value={formData.secaoEleitoral}
                onChange={e => setFormData({ ...formData, secaoEleitoral: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Observações Internas do Gabinete</label>
            <textarea
              rows={2}
              placeholder="Histórico, interesses da família, demandas prioritárias..."
              value={formData.observacoes}
              onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
              className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
            >
              Salvar Eleitor no CRM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
