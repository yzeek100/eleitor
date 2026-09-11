import React, { useState } from 'react';
import { PlusCircle, X, User } from 'lucide-react';
import { Demanda, Eleitor, CategoriaDemanda, StatusDemanda } from '../../types';

interface NewDemandaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (demanda: Omit<Demanda, 'id' | 'protocolo' | 'dataAbertura' | 'historico'>) => void;
  eleitores: Eleitor[];
  preselectedEleitor?: Eleitor | null;
}

export const NewDemandaModal: React.FC<NewDemandaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  eleitores,
  preselectedEleitor,
}) => {
  const [eleitorId, setEleitorId] = useState(preselectedEleitor?.id || eleitores[0]?.id || '');
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<CategoriaDemanda>('Infraestrutura & Asfalto');
  const [prioridade, setPrioridade] = useState<'Baixa' | 'Normal' | 'Alta' | 'Urgente'>('Normal');
  const [orgaoDestino, setOrgaoDestino] = useState('Secretaria Municipal de Infraestrutura e Obras');
  const [bairro, setBairro] = useState(preselectedEleitor?.bairro || eleitores[0]?.bairro || 'Centro');
  const [descricao, setDescricao] = useState('');
  const [prazoDias, setPrazoDias] = useState(15);

  if (!isOpen) return null;

  const currentEleitor = eleitores.find(e => e.id === eleitorId) || preselectedEleitor || eleitores[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !currentEleitor) return;

    onSave({
      eleitorId: currentEleitor.id,
      eleitorNome: currentEleitor.nome,
      eleitorTelefone: currentEleitor.whatsapp,
      bairro: bairro || currentEleitor.bairro,
      titulo,
      descricao,
      categoria,
      status: 'Recebida',
      prioridade,
      orgaoDestino,
      assessorResponsavel: 'Gabinete Geral',
      dataPrevisao: new Date(Date.now() + prazoDias * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            Protocolar Nova Demanda da População
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Cidadão Requerente *</label>
            <select
              value={eleitorId}
              onChange={e => {
                setEleitorId(e.target.value);
                const sel = eleitores.find(el => el.id === e.target.value);
                if (sel) setBairro(sel.bairro);
              }}
              className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              {eleitores.map(el => (
                <option key={el.id} value={el.id}>
                  {el.nome} — {el.bairro} ({el.whatsapp})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Bairro / Localidade da Demanda *</label>
              <input
                type="text"
                required
                list="demandas-bairros-rr"
                value={bairro}
                onChange={e => setBairro(e.target.value)}
                placeholder="Ex: Centro, Mutirão I, Vila do Taiano..."
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
              <datalist id="demandas-bairros-rr">
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
              <label className="font-bold text-slate-700 block mb-1">Prioridade</label>
              <select
                value={prioridade}
                onChange={e => setPrioridade(e.target.value as any)}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Baixa">Baixa</option>
                <option value="Normal">Normal</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente 🔥</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Categoria *</label>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value as any)}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Infraestrutura & Asfalto">Infraestrutura & Asfalto</option>
                <option value="Iluminação Pública">Iluminação Pública</option>
                <option value="Saúde">Saúde & Medicamentos</option>
                <option value="Educação & Creches">Educação & Creches</option>
                <option value="Segurança Pública">Segurança Pública</option>
                <option value="Meio Ambiente & Limpeza">Meio Ambiente & Limpeza</option>
                <option value="Transporte & Trânsito">Transporte & Trânsito</option>
                <option value="Assistência Social">Assistência Social</option>
                <option value="Esporte & Lazer">Esporte & Lazer</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Órgão Destinatário da Cobrança *</label>
              <input
                type="text"
                required
                value={orgaoDestino}
                onChange={e => setOrgaoDestino(e.target.value)}
                placeholder="Ex: Secretaria de Saúde / CPFL / DAE"
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Título Resumido da Demanda *</label>
            <input
              type="text"
              required
              placeholder="Ex: Recapeamento da Rua das Acácias e manutenção de bueiro"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Descrição Completa e Justificativa *</label>
            <textarea
              rows={4}
              required
              placeholder="Detalhes trazidos pelo cidadão, fotos recebidas, histórico da situação..."
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
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
              Gerar Protocolo Eletrônico
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
