import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Download, 
  MessageSquare, 
  Cake, 
  MapPin, 
  Phone, 
  Mail, 
  Tag, 
  ChevronRight, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { Eleitor, Demanda, MandatoConfig } from '../types';

interface EleitoresCRMProps {
  eleitores: Eleitor[];
  demandas: Demanda[];
  config: MandatoConfig;
  onOpenNewEleitor: () => void;
  onOpenNewDemandaForEleitor: (eleitor: Eleitor) => void;
  onSendWhatsApp: (eleitor: Eleitor, templateTipo: 'aniversario' | 'demanda' | 'geral') => void;
  onSelectEleitor: (eleitor: Eleitor) => void;
}

export const EleitoresCRM: React.FC<EleitoresCRMProps> = ({
  eleitores,
  demandas,
  config,
  onOpenNewEleitor,
  onOpenNewDemandaForEleitor,
  onSendWhatsApp,
  onSelectEleitor,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBairro, setSelectedBairro] = useState('todos');
  const [selectedApoio, setSelectedApoio] = useState('todos');
  const [selectedEstagio, setSelectedEstagio] = useState('todos');
  const [filterAniversariantes, setFilterAniversariantes] = useState(false);
  const [selectedTag, setSelectedTag] = useState('todas');

  // Extract unique neighborhoods and tags
  const bairrosList = useMemo(() => {
    const list = Array.from(new Set(eleitores.map(e => e.bairro).filter(Boolean)));
    return list.sort();
  }, [eleitores]);

  const tagsList = useMemo(() => {
    const set = new Set<string>();
    eleitores.forEach(e => e.tags.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [eleitores]);

  // Current month for birthday filter
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

  // Filtered eleitores
  const filteredEleitores = useMemo(() => {
    return eleitores.filter(e => {
      // Search term
      const term = searchTerm.toLowerCase();
      const matchSearch = 
        !term ||
        e.nome.toLowerCase().includes(term) ||
        e.bairro.toLowerCase().includes(term) ||
        e.whatsapp.includes(term) ||
        (e.cpf && e.cpf.includes(term)) ||
        (e.liderancaNome && e.liderancaNome.toLowerCase().includes(term));

      // Bairro filter
      const matchBairro = selectedBairro === 'todos' || e.bairro === selectedBairro;

      // Apoio filter
      const matchApoio = selectedApoio === 'todos' || e.apoio === selectedApoio;

      // Estagio filter
      const matchEstagio = selectedEstagio === 'todos' || e.estagio === selectedEstagio;

      // Tag filter
      const matchTag = selectedTag === 'todas' || e.tags.includes(selectedTag);

      // Birthday month filter
      let matchAniver = true;
      if (filterAniversariantes && e.dataNascimento) {
        const parts = e.dataNascimento.split('-');
        matchAniver = parts.length >= 2 && parts[1] === currentMonth;
      }

      return matchSearch && matchBairro && matchApoio && matchEstagio && matchTag && matchAniver;
    });
  }, [eleitores, searchTerm, selectedBairro, selectedApoio, selectedEstagio, selectedTag, filterAniversariantes, currentMonth]);

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = ['Nome', 'WhatsApp', 'Email', 'CPF', 'Nascimento', 'Bairro', 'Cidade', 'Apoio', 'Liderança', 'Tags'];
    const rows = filteredEleitores.map(e => [
      `"${e.nome}"`,
      `"${e.whatsapp}"`,
      `"${e.email || ''}"`,
      `"${e.cpf || ''}"`,
      `"${e.dataNascimento || ''}"`,
      `"${e.bairro}"`,
      `"${e.cidade}"`,
      `"${e.apoio}"`,
      `"${e.liderancaNome || ''}"`,
      `"${e.tags.join(', ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eleitores_meu_eleitor_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getApoioBadge = (apoio: string) => {
    switch (apoio) {
      case 'Fiel':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Simpatizante':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Indeciso':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Oposição':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Gestão de Eleitores & Apoiadores
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Base oficial de contatos, histórico de demandas e articulação territorial do mandato
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-300/80"
              title="Exportar dados filtrados para planilha Excel/CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Exportar Planilha</span>
            </button>

            <button
              onClick={onOpenNewEleitor}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Cadastrar Novo Eleitor</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, bairro, telefone, CPF..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          {/* Bairro Filter */}
          <div>
            <select
              value={selectedBairro}
              onChange={e => setSelectedBairro(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 text-slate-700"
            >
              <option value="todos">Todos os Bairros</option>
              {bairrosList.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Apoio Filter */}
          <div>
            <select
              value={selectedApoio}
              onChange={e => setSelectedApoio(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 text-slate-700"
            >
              <option value="todos">Nível de Apoio (Todos)</option>
              <option value="Fiel">Apoiador Fiel</option>
              <option value="Simpatizante">Simpatizante</option>
              <option value="Indeciso">Indeciso</option>
              <option value="Oposição">Oposição</option>
            </select>
          </div>

          {/* Estágio Pré-Campanha Filter */}
          <div>
            <select
              value={selectedEstagio}
              onChange={e => setSelectedEstagio(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 text-slate-700"
            >
              <option value="todos">Estágio da Base (Todos)</option>
              <option value="falta_trabalhar">🟠 Falta trabalhar</option>
              <option value="relacionamento">🟣 Criando relacionamento</option>
              <option value="conquistado">🟢 Conquistado</option>
              <option value="perdido">⚪ Perdido</option>
            </select>
          </div>

          {/* Birthday toggle */}
          <button
            onClick={() => setFilterAniversariantes(!filterAniversariantes)}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${
              filterAniversariantes 
                ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/50' 
                : 'bg-slate-50/70 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <Cake className={`w-4 h-4 ${filterAniversariantes ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>Aniversariantes</span>
          </button>
        </div>
      </div>

      {/* Voters Table & Stats */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>Mostrando <b>{filteredEleitores.length}</b> de <b>{eleitores.length}</b> eleitores cadastrados</span>
          {filterAniversariantes && (
            <span className="text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded">
              Filtro ativo: Aniversariantes do Mês Atual
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Eleitor / Contato</th>
                <th className="py-3 px-4">Bairro & Endereço</th>
                <th className="py-3 px-4">Apoio Político</th>
                <th className="py-3 px-4">Liderança</th>
                <th className="py-3 px-4">Tags & Perfil</th>
                <th className="py-3 px-4">Demandas</th>
                <th className="py-3 px-4 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEleitores.length > 0 ? (
                filteredEleitores.map(eleitor => {
                  const voterDemandas = demandas.filter(d => d.eleitorId === eleitor.id);
                  return (
                    <tr 
                      key={eleitor.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{eleitor.nome}</span>
                          {eleitor.dataNascimento && (
                            <span title={`Data de Nascimento: ${eleitor.dataNascimento}`} className="text-slate-400">
                              <Cake className="w-3 h-3 text-amber-500 inline" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            {eleitor.whatsapp}
                          </span>
                          {eleitor.cpf && (
                            <span className="text-[11px] text-slate-400">
                              CPF: {eleitor.cpf}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Bairro */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{eleitor.bairro}</span>
                        </div>
                        {eleitor.endereco && (
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">{eleitor.endereco}</p>
                        )}
                        {eleitor.zonaEleitoral && (
                          <p className="text-[10px] text-slate-400">Zona {eleitor.zonaEleitoral} • Seção {eleitor.secaoEleitoral}</p>
                        )}
                      </td>

                      {/* Apoio & Estágio */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getApoioBadge(eleitor.apoio)}`}>
                            {eleitor.apoio}
                          </span>
                          {eleitor.estagio && (
                            <div className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                eleitor.estagio === 'conquistado' ? 'bg-emerald-500' :
                                eleitor.estagio === 'relacionamento' ? 'bg-purple-500' :
                                eleitor.estagio === 'falta_trabalhar' ? 'bg-orange-500' : 'bg-slate-400'
                              }`}></span>
                              <span>
                                {eleitor.estagio === 'conquistado' ? 'Conquistado' :
                                 eleitor.estagio === 'relacionamento' ? 'Relacionamento' :
                                 eleitor.estagio === 'falta_trabalhar' ? 'Falta trabalhar' : 'Perdido'}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Liderança */}
                      <td className="py-3.5 px-4">
                        <span className="text-slate-700 font-medium">
                          {eleitor.liderancaNome || '—'}
                        </span>
                      </td>

                      {/* Tags */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {eleitor.tags.map((tag, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded border border-slate-200">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Demandas */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold ${
                          voterDemandas.length > 0 ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {voterDemandas.length} {voterDemandas.length === 1 ? 'demanda' : 'demandas'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Send WhatsApp */}
                          <button
                            onClick={() => onSendWhatsApp(eleitor, 'geral')}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors border border-emerald-200"
                            title="Conversar via WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {/* New Demanda */}
                          <button
                            onClick={() => onOpenNewDemandaForEleitor(eleitor)}
                            className="p-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-colors border border-teal-200"
                            title="Abrir Nova Demanda para este Eleitor"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          {/* Detail Profile */}
                          <button
                            onClick={() => onSelectEleitor(eleitor)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            title="Ver Ficha Completa do Eleitor"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm">Nenhum eleitor encontrado com estes filtros</p>
                    <p className="text-xs text-slate-400 mt-1">Tente remover filtros ou cadastrar um novo eleitor</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
