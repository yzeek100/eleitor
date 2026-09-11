import React, { useState } from 'react';
import { 
  Globe, 
  Send, 
  Search, 
  CheckCircle2, 
  Clock, 
  Share2, 
  Copy, 
  Check, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { MandatoConfig, Demanda, Eleitor } from '../types';
import confetti from 'canvas-confetti';

interface PortalPublicoEleitorProps {
  config: MandatoConfig;
  demandas: Demanda[];
  onCitizenSubmitDemanda: (demandaData: {
    nome: string;
    whatsapp: string;
    bairro: string;
    titulo: string;
    descricao: string;
    categoria: any;
    endereco: string;
  }) => string; // returns generated protocol
}

export const PortalPublicoEleitor: React.FC<PortalPublicoEleitorProps> = ({
  config,
  demandas,
  onCitizenSubmitDemanda,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'nova' | 'consultar'>('nova');
  const [searchProtocol, setSearchProtocol] = useState('');
  const [searchedDemanda, setSearchedDemanda] = useState<Demanda | null>(null);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [submittedProtocol, setSubmittedProtocol] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    bairro: '',
    endereco: '',
    categoria: 'Infraestrutura & Asfalto',
    titulo: '',
    descricao: '',
  });

  const publicUrl = `https://meueleitor.com.br/gabinete/${config.nomeParlamentar.toLowerCase().replace(/\s+/g, '-')}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmitDemanda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.whatsapp || !formData.titulo) return;

    const protocol = onCitizenSubmitDemanda(formData);
    setSubmittedProtocol(protocol);
    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.5 }
    });

    setFormData({
      nome: '',
      whatsapp: '',
      bairro: '',
      endereco: '',
      categoria: 'Infraestrutura & Asfalto',
      titulo: '',
      descricao: '',
    });
  };

  const handleSearchProtocol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchProtocol.trim()) return;

    const found = demandas.find(d => 
      d.protocolo.toLowerCase().trim() === searchProtocol.toLowerCase().trim()
    );

    if (found) {
      setSearchedDemanda(found);
      setSearchNotFound(false);
    } else {
      setSearchedDemanda(null);
      setSearchNotFound(true);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner explaining the Portal */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Canal Oficial de Atendimento ao Cidadão
            </span>
            <span className="text-slate-400 text-xs">• Link na Bio</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            Portal Público do Gabinete
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Link público para compartilhar em redes sociais, WhatsApp e santinhos para a população abrir protocolos online
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-600 truncate max-w-xs">
            {publicUrl}
          </div>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
          </button>
        </div>
      </div>

      {/* Simulated Citizen View Container */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border-2 border-emerald-500/30 shadow-xl overflow-hidden">
        {/* Portal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white text-center relative">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-emerald-400">
            ME
          </div>
          <span className="text-xs uppercase font-semibold text-emerald-400 tracking-widest block">
            Gabinete Aberto • {config.cidade} - {config.uf}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            Fale com o {config.cargo} {config.nomeParlamentar}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl mx-auto italic font-serif">
            "{config.slogan}"
          </p>

          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Atendimento Oficial
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-emerald-400" /> Protocolo 100% Digital
            </span>
          </div>
        </div>

        {/* Portal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => {
              setActiveSubTab('nova');
              setSubmittedProtocol(null);
            }}
            className={`flex-1 py-3.5 text-center transition-colors flex items-center justify-center gap-1.5 ${
              activeSubTab === 'nova'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Registrar Nova Demanda</span>
          </button>
          <button
            onClick={() => setActiveSubTab('consultar')}
            className={`flex-1 py-3.5 text-center transition-colors flex items-center justify-center gap-1.5 ${
              activeSubTab === 'consultar'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Consultar Protocolo Existente</span>
          </button>
        </div>

        {/* Sub-tab 1: Form to Submit Demand */}
        {activeSubTab === 'nova' && (
          <div className="p-6 sm:p-8">
            {submittedProtocol ? (
              <div className="text-center py-8 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Demanda Protocolada com Sucesso!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Seu pedido já foi recebido pela equipe do gabinete do {config.cargo} {config.nomeParlamentar}.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-sm mx-auto">
                  <span className="text-xs text-slate-500 font-semibold block">Seu Número de Protocolo:</span>
                  <span className="text-2xl font-mono font-black text-emerald-700 tracking-wider">
                    {submittedProtocol}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Guarde este número para acompanhar as providências adotadas!
                  </p>
                </div>

                <button
                  onClick={() => setSubmittedProtocol(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Registrar Outra Demanda
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitDemanda} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Seu Nome Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João da Silva"
                      value={formData.nome}
                      onChange={e => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Seu WhatsApp de Contato *</label>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Bairro / Localidade *</label>
                    <input
                      type="text"
                      required
                      list="portal-bairros-rr"
                      placeholder="Ex: Centro, Mutirão I, Vila do Taiano..."
                      value={formData.bairro}
                      onChange={e => setFormData({ ...formData, bairro: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                    />
                    <datalist id="portal-bairros-rr">
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
                    <label className="font-bold text-slate-700 block mb-1">Rua / Número / Referência</label>
                    <input
                      type="text"
                      placeholder="Ex: Rua das Flores, em frente ao posto"
                      value={formData.endereco}
                      onChange={e => setFormData({ ...formData, endereco: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Categoria do Pedido *</label>
                    <select
                      value={formData.categoria}
                      onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Infraestrutura & Asfalto">Infraestrutura & Asfalto</option>
                      <option value="Iluminação Pública">Iluminação Pública</option>
                      <option value="Saúde">Saúde & Medicamentos</option>
                      <option value="Educação & Creches">Educação & Creches</option>
                      <option value="Segurança Pública">Segurança Pública</option>
                      <option value="Meio Ambiente & Limpeza">Meio Ambiente & Limpeza</option>
                      <option value="Transporte & Trânsito">Transporte & Trânsito</option>
                      <option value="Esporte & Lazer">Esporte & Lazer</option>
                      <option value="Outros">Outros Assuntos</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Resumo da Demanda *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Tapa-buraco na rua / Troca de lâmpada queimada"
                      value={formData.titulo}
                      onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Explicação Detalhada do Pedido *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Conte o que está acontecendo, há quanto tempo e como isso afeta os moradores..."
                    value={formData.descricao}
                    onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Demanda e Gerar Protocolo Oficial</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Sub-tab 2: Search existing protocol */}
        {activeSubTab === 'consultar' && (
          <div className="p-6 sm:p-8 space-y-5">
            <form onSubmit={handleSearchProtocol} className="flex gap-2">
              <input
                type="text"
                placeholder="Digite o número do protocolo (Ex: #DEM-2026-0142)"
                value={searchProtocol}
                onChange={e => setSearchProtocol(e.target.value)}
                className="flex-1 p-2.5 rounded-lg border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Consultar</span>
              </button>
            </form>

            {searchedDemanda && (
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-fadeIn text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-slate-800 text-sm">
                    {searchedDemanda.protocolo}
                  </span>
                  <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Status: {searchedDemanda.status}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{searchedDemanda.titulo}</h4>
                <p className="text-slate-600">{searchedDemanda.descricao}</p>

                <div className="pt-2 border-t border-slate-200 text-slate-500 space-y-1">
                  <p>📍 Local: {searchedDemanda.bairro}</p>
                  <p>🏛️ Órgão Acionado: {searchedDemanda.orgaoDestino}</p>
                  {searchedDemanda.numeroOficio && (
                    <p className="font-semibold text-blue-700">📄 Ofício Parlamentar: {searchedDemanda.numeroOficio}</p>
                  )}
                  <p>📅 Data de Abertura: {searchedDemanda.dataAbertura}</p>
                </div>

                <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-700 block">Histórico de Providências do Gabinete:</span>
                  {searchedDemanda.historico.map((h, i) => (
                    <div key={i} className="text-[11px] text-slate-600 border-l-2 border-emerald-500 pl-2">
                      <p className="font-semibold text-slate-800">{h.data} • {h.assessor}</p>
                      <p>{h.descricao}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchNotFound && (
              <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="font-bold text-sm text-slate-800">Protocolo não localizado</p>
                <p className="text-xs text-slate-500 mt-1">
                  Verifique se o código foi digitado corretamente (Ex: #DEM-2026-0142) ou entre em contato direto pelo WhatsApp do gabinete.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
