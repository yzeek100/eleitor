import React, { useState } from 'react';
import { 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Download, 
  Send, 
  RefreshCw, 
  Bookmark,
  Building,
  Layers
} from 'lucide-react';
import { MandatoConfig, Demanda, DocumentoOficial } from '../types';

interface RedatorLegislativoIAProps {
  config: MandatoConfig;
  demandas: Demanda[];
  documentosSalvos: DocumentoOficial[];
  onSaveDocumento: (doc: DocumentoOficial) => void;
  preselectedDemanda?: Demanda | null;
}

export const RedatorLegislativoIA: React.FC<RedatorLegislativoIAProps> = ({
  config,
  demandas,
  documentosSalvos,
  onSaveDocumento,
  preselectedDemanda,
}) => {
  const [docType, setDocType] = useState<string>('Ofício');
  const [tema, setTema] = useState<string>(
    preselectedDemanda ? preselectedDemanda.titulo : 'Recapeamento asfáltico e operação tapa-buracos'
  );
  const [destinatario, setDestinatario] = useState<string>(
    preselectedDemanda ? preselectedDemanda.orgaoDestino : 'Secretário Municipal de Infraestrutura e Serviços Públicos'
  );
  const [detalhes, setDetalhes] = useState<string>(
    preselectedDemanda ? preselectedDemanda.descricao : 'Reivindicação de moradores devido a buracos na via pública que causam acidentes e danificam veículos.'
  );
  const [selectedDemandaProtocolo, setSelectedDemandaProtocolo] = useState<string>(
    preselectedDemanda ? preselectedDemanda.protocolo : ''
  );

  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/draft-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType,
          parlamentar: config.nomeParlamentar,
          cargo: config.cargo,
          cidade: config.cidade,
          partido: config.partido,
          tema,
          destinatario,
          detalhes,
          protocolo: selectedDemandaProtocolo,
        }),
      });
      const data = await res.json();
      setGeneratedDoc(data.text || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedDoc) return;
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    if (!generatedDoc) return;
    const novoDoc: DocumentoOficial = {
      id: `doc-${Date.now()}`,
      tipo: docType as any,
      numero: `${Math.floor(100 + Math.random() * 900)}/${new Date().getFullYear()}`,
      ano: new Date().getFullYear(),
      assunto: tema,
      destinatario,
      conteudo: generatedDoc,
      dataGeracao: new Date().toISOString().slice(0, 10),
      protocoloDemanda: selectedDemandaProtocolo || undefined,
    };
    onSaveDocumento(novoDoc);
    alert('Documento arquivado com sucesso no histórico oficial do gabinete!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Estúdio Legislativo com Inteligência Artificial
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Redija instantaneamente Ofícios, Indicações, Requerimentos e Projetos de Lei com fundamentação jurídica oficial
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-lg border border-indigo-200">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>Manual de Redação Parlamentar Integrado</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
            1. Parâmetros da Peça Oficial
          </h3>

          <div className="space-y-3 text-xs">
            {/* Tipo de Documento */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tipo de Peça Legislativa *</label>
              <select
                value={docType}
                onChange={e => setDocType(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Ofício Executivo">Ofício Executivo (Prefeitura / Secretarias)</option>
                <option value="Indicação Legislativa">Indicação Legislativa (Plenário)</option>
                <option value="Requerimento de Informações">Requerimento de Informações / Fiscalização</option>
                <option value="Projeto de Lei">Projeto de Lei Ordinária (com Justificativa)</option>
                <option value="Moção de Aplausos">Moção de Aplausos ou Congratulações</option>
                <option value="Discurso de Tribuna">Discurso Político de Tribuna</option>
              </select>
            </div>

            {/* Vincular Demanda (Opcional) */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Vincular a uma Demanda Protocolada (Opcional)</label>
              <select
                value={selectedDemandaProtocolo}
                onChange={e => {
                  setSelectedDemandaProtocolo(e.target.value);
                  const found = demandas.find(d => d.protocolo === e.target.value);
                  if (found) {
                    setTema(found.titulo);
                    setDestinatario(found.orgaoDestino);
                    setDetalhes(found.descricao);
                  }
                }}
                className="w-full p-2 rounded-lg border border-slate-300 text-slate-700 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Nenhuma (Digitar tema livre)</option>
                {demandas.map(d => (
                  <option key={d.id} value={d.protocolo}>
                    {d.protocolo} - {d.titulo} ({d.bairro})
                  </option>
                ))}
              </select>
            </div>

            {/* Destinatário */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Destinatário Oficial *</label>
              <input
                type="text"
                required
                placeholder="Ex: Exmo. Sr. Secretário Municipal de Saúde"
                value={destinatario}
                onChange={e => setDestinatario(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Assunto / Tema */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Assunto / Objeto da Demanda *</label>
              <input
                type="text"
                required
                placeholder="Ex: Instalação de semáforo e faixa de pedestres na Av. Principal"
                value={tema}
                onChange={e => setTema(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Justificativa e Detalhes */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Detalhes e Justificativa dos Fatos *</label>
              <textarea
                rows={4}
                required
                placeholder="Descreva a situação, o histórico e o impacto na vida dos munícipes..."
                value={detalhes}
                onChange={e => setDetalhes(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>{loading ? 'Redigindo Peça com IA...' : 'Redigir Documento Oficial com IA'}</span>
            </button>
          </div>
        </div>

        {/* Right Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Visualização em Papel Timbrado Oficial
            </h3>
            {generatedDoc && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200"
                >
                  <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Arquivar</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1 px-3 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Timbrado Sheet */}
          <div className="bg-white rounded-xl border border-slate-300 p-8 shadow-md min-h-[560px] font-serif text-slate-900 text-xs sm:text-sm leading-relaxed relative">
            {/* Timbrado Header */}
            <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-300 mx-auto mb-2 flex items-center justify-center font-bold text-slate-700 text-base">
                ⚖️
              </div>
              <h2 className="font-bold text-sm uppercase tracking-widest text-slate-900">
                Poder Legislativo • {config.cidade.toUpperCase()} - {config.uf}
              </h2>
              <h1 className="font-black text-base text-slate-900 mt-0.5">
                GABINETE DO {config.cargo.toUpperCase()} {config.nomeParlamentar.toUpperCase()}
              </h1>
              <p className="text-[11px] text-slate-600 font-sans mt-0.5">
                {config.partido} • {config.enderecoGabinete} • {config.telefoneGabinete}
              </p>
            </div>

            {/* Document Content */}
            {generatedDoc ? (
              <div className="whitespace-pre-line font-serif text-slate-800 leading-relaxed text-justify px-2">
                {generatedDoc}
              </div>
            ) : (
              <div className="py-24 text-center text-slate-400 font-sans">
                <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-sm">Nenhum documento gerado ainda</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Selecione o tipo de peça oficial, preencha os detalhes ao lado e clique em "Redigir Documento Oficial com IA".
                </p>
              </div>
            )}

            {/* Timbrado Footer */}
            {generatedDoc && (
              <div className="mt-12 pt-6 border-t border-slate-200 text-center font-sans text-[10px] text-slate-400">
                Documento emitido eletronicamente pelo Sistema Meu Eleitor • Protocolo Digital de Mandato
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
