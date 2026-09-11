import React, { useState, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Users, 
  Cake, 
  FileText, 
  CheckCheck, 
  Smile, 
  Smartphone, 
  Copy, 
  Check,
  Search,
  Filter,
  Tag
} from 'lucide-react';
import { Eleitor, TemplateMensagem, MandatoConfig, Demanda } from '../types';

interface CentralWhatsAppProps {
  eleitores: Eleitor[];
  demandas: Demanda[];
  templates: TemplateMensagem[];
  config: MandatoConfig;
  preselectedEleitor?: Eleitor | null;
  preselectedTipo?: string;
}

export const CentralWhatsApp: React.FC<CentralWhatsAppProps> = ({
  eleitores,
  demandas,
  templates,
  config,
  preselectedEleitor,
  preselectedTipo,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateMensagem>(
    templates[preselectedTipo === 'aniversario' ? 0 : 1] || templates[0]
  );
  const [selectedEleitorId, setSelectedEleitorId] = useState<string>(
    preselectedEleitor?.id || eleitores[0]?.id || ''
  );
  const [customMessage, setCustomMessage] = useState<string>(selectedTemplate?.conteudo || '');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiPromptTopic, setAiPromptTopic] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const availableVariables = [
    { tag: '{nome}', label: 'Nome', desc: 'Nome do eleitor' },
    { tag: '{bairro}', label: 'Bairro', desc: 'Bairro ou polo' },
    { tag: '{parlamentar}', label: 'Parlamentar', desc: config.nomeParlamentar },
    { tag: '{cargo}', label: 'Cargo', desc: config.cargo },
    { tag: '{cidade}', label: 'Cidade', desc: config.cidade },
    { tag: '{protocolo}', label: 'Protocolo', desc: 'Nº do protocolo' },
    { tag: '{demanda}', label: 'Demanda', desc: 'Título da solicitação' },
  ];

  const handleInsertVariable = (variableTag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setCustomMessage(prev => prev ? `${prev} ${variableTag}` : variableTag);
      return;
    }

    const start = textarea.selectionStart ?? customMessage.length;
    const end = textarea.selectionEnd ?? customMessage.length;
    const before = customMessage.substring(0, start);
    const after = customMessage.substring(end);
    
    // Add space before if preceding character exists and is not whitespace
    const needsLeadingSpace = start > 0 && !/\s$/.test(before);
    // Add space after if next character is not whitespace
    const needsTrailingSpace = after.length === 0 || !/^\s/.test(after);
    
    const insertText = `${needsLeadingSpace ? ' ' : ''}${variableTag}${needsTrailingSpace ? ' ' : ''}`;
    const newText = before + insertText + after;
    
    setCustomMessage(newText);
    
    // Restore cursor right after the newly inserted tag
    setTimeout(() => {
      textarea.focus();
      const newCursor = start + insertText.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  const selectedEleitor = eleitores.find(e => e.id === selectedEleitorId) || eleitores[0];
  const eleitorDemandas = selectedEleitor ? demandas.filter(d => d.eleitorId === selectedEleitor.id) : [];
  const latestDemanda = eleitorDemandas[0];

  // Replace template variables
  const formatMessage = (rawText: string) => {
    if (!selectedEleitor) return rawText;
    return rawText
      .replace(/{nome}/g, selectedEleitor.nome)
      .replace(/{parlamentar}/g, config.nomeParlamentar)
      .replace(/{cargo}/g, config.cargo)
      .replace(/{bairro}/g, selectedEleitor.bairro)
      .replace(/{cidade}/g, config.cidade)
      .replace(/{protocolo}/g, latestDemanda ? latestDemanda.protocolo : '#DEM-2026')
      .replace(/{demanda}/g, latestDemanda ? latestDemanda.titulo : 'sua solicitação');
  };

  const previewFormatted = formatMessage(customMessage);

  const handleSelectTemplate = (tpl: TemplateMensagem) => {
    setSelectedTemplate(tpl);
    setCustomMessage(tpl.conteudo);
  };

  const handleSendWhatsApp = () => {
    if (!selectedEleitor) return;
    const cleanPhone = selectedEleitor.whatsapp.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const textEncoded = encodeURIComponent(previewFormatted);
    window.open(`https://wa.me/${fullPhone}?text=${textEncoded}`, '_blank');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(previewFormatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleGenerateAiMessage = async () => {
    if (!selectedEleitor) return;
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/draft-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: aiPromptTopic || selectedTemplate.categoria,
          eleitorNome: selectedEleitor.nome,
          bairro: selectedEleitor.bairro,
          demanda: latestDemanda ? latestDemanda.titulo : aiPromptTopic,
          parlamentar: config.nomeParlamentar,
          cargo: config.cargo,
          tom: 'cordial, atencioso e próximo da população',
        }),
      });
      const data = await res.json();
      if (data.message) {
        setCustomMessage(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              Central de Comunicação WhatsApp
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mensagens personalizadas com variáveis dinâmicas, inteligência artificial e envio direto em 1 clique
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>WhatsApp Web Integrado</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Configuration, Eleitor selection, Template & Editor */}
        <div className="lg:col-span-7 space-y-5">
          {/* Target Voter Selector */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              1. Selecione o Eleitor Destinatário
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <select
                  value={selectedEleitorId}
                  onChange={e => setSelectedEleitorId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                >
                  {eleitores.map(eleitor => (
                    <option key={eleitor.id} value={eleitor.id}>
                      {eleitor.nome} ({eleitor.bairro})
                    </option>
                  ))}
                </select>
              </div>

              {selectedEleitor && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block truncate">{selectedEleitor.nome}</span>
                    <span className="text-slate-500 text-[11px]">{selectedEleitor.whatsapp} • {selectedEleitor.bairro}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {selectedEleitor.apoio}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Templates Selector */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              2. Escolha um Modelo Institucional ou Digite Livremente
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {templates.map(tpl => {
                const isSelected = selectedTemplate?.id === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`p-3 rounded-lg border text-left text-xs transition-all ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold shadow-2xs' 
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700 font-medium'
                    }`}
                  >
                    <span>{tpl.titulo}</span>
                  </button>
                );
              })}
            </div>

            {/* AI Custom Assistant */}
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
              <label className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Criar Mensagem Inteligente com IA
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Agradecer presença na plenária ou avisar sobre asfalto aprovado..."
                  value={aiPromptTopic}
                  onChange={e => setAiPromptTopic(e.target.value)}
                  className="flex-1 p-2 rounded-lg border border-indigo-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleGenerateAiMessage}
                  disabled={isGeneratingAi}
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all disabled:opacity-50 shrink-0"
                >
                  {isGeneratingAi ? 'Gerando...' : 'Gerar com IA'}
                </button>
              </div>
            </div>
          </div>

          {/* Message Text Editor */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Texto da Mensagem (com variáveis dinâmicas)
              </label>
              <div className="flex gap-1 text-[10px] text-slate-400">
                <span>Variáveis: &#123;nome&#125;, &#123;bairro&#125;, &#123;parlamentar&#125;</span>
              </div>
            </div>

            <textarea
              rows={6}
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 text-xs font-sans focus:ring-2 focus:ring-emerald-500 text-slate-800 leading-relaxed"
            ></textarea>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>

              <button
                onClick={handleSendWhatsApp}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-900/30 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Enviar no WhatsApp Agora</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Live Smartphone WhatsApp Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm rounded-[36px] bg-slate-900 p-3 shadow-2xl border-4 border-slate-800">
            {/* Phone Speaker/Camera top */}
            <div className="flex justify-center mb-2">
              <div className="w-20 h-3 bg-slate-800 rounded-full"></div>
            </div>

            {/* Phone Screen */}
            <div className="rounded-[28px] overflow-hidden bg-[#0b141a] flex flex-col h-[520px] relative border border-slate-800">
              {/* WhatsApp App Header */}
              <div className="bg-[#202c33] p-3 flex items-center justify-between text-white border-b border-[#2a3942]">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-white shrink-0">
                    {selectedEleitor?.nome.slice(0, 2).toUpperCase() || 'EL'}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-semibold text-xs truncate">{selectedEleitor?.nome || 'Eleitor Selecionado'}</h4>
                    <span className="text-[10px] text-emerald-400 block">online</span>
                  </div>
                </div>
                <Smartphone className="w-4 h-4 text-slate-400" />
              </div>

              {/* Chat Canvas (WhatsApp Background) */}
              <div className="flex-1 p-3.5 overflow-y-auto bg-[#0b141a] bg-opacity-95 flex flex-col justify-end space-y-3">
                <div className="self-center bg-[#182229] px-2.5 py-1 rounded-md text-[10px] text-[#8696a0] font-medium">
                  HOJE
                </div>

                {/* Sent Message Bubble */}
                <div className="self-end max-w-[85%] bg-[#005c4b] text-[#e9edef] p-3 rounded-xl rounded-tr-xs shadow-md text-xs leading-relaxed font-sans whitespace-pre-line relative">
                  {previewFormatted}
                  <div className="flex items-center justify-end gap-1 text-[10px] text-[#8696a0] mt-1.5">
                    <span>{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                  </div>
                </div>
              </div>

              {/* Chat Input Footer */}
              <div className="bg-[#202c33] p-2.5 flex items-center justify-between gap-2 border-t border-[#2a3942]">
                <Smile className="w-5 h-5 text-[#8696a0]" />
                <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 text-xs text-[#8696a0] truncate">
                  Mensagem
                </div>
                <button 
                  onClick={handleSendWhatsApp}
                  className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-white shrink-0 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center mt-3">
            Prévia fiel da mensagem no aplicativo do cidadão
          </p>
        </div>
      </div>
    </div>
  );
};
