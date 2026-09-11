import React, { useState } from 'react';
import { 
  Users, 
  Target,
  FileText, 
  CheckCircle2, 
  Clock, 
  Cake, 
  TrendingUp, 
  MapPin, 
  Award,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Send,
  UserPlus,
  PlusCircle,
  Sparkles,
  Calendar,
  Layers,
  Search,
  CheckCircle,
  Info
} from 'lucide-react';
import { Eleitor, Demanda, Lideranca, EmendaParlamentar, MandatoConfig, EstagioRelacionamento } from '../types';

interface DashboardProps {
  eleitores: Eleitor[];
  demandas: Demanda[];
  liderancas: Lideranca[];
  emendas: EmendaParlamentar[];
  config: MandatoConfig;
  onNavigateTab: (tab: string) => void;
  onOpenNewDemanda: () => void;
  onOpenNewEleitor: () => void;
  onSelectDemanda: (demanda: Demanda) => void;
  onSelectEleitor?: (eleitor: Eleitor) => void;
  onSendWhatsApp: (eleitor: Eleitor, templateTipo: 'aniversario' | 'demanda' | 'geral') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  eleitores,
  demandas,
  liderancas,
  emendas,
  config,
  onNavigateTab,
  onOpenNewDemanda,
  onOpenNewEleitor,
  onSelectDemanda,
  onSelectEleitor,
  onSendWhatsApp,
}) => {
  const [selectedEstagioFilter, setSelectedEstagioFilter] = useState<EstagioRelacionamento | null>(null);
  const [showNumbersModal, setShowNumbersModal] = useState<boolean>(false);
  const [activeTabOverview, setActiveTabOverview] = useState<'geral' | 'bairros'>('geral');

  // Today's birthday calculation
  const now = new Date();
  const currentMonthDay = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const aniversariantesHoje = eleitores.filter(e => {
    if (!e.dataNascimento) return false;
    const parts = e.dataNascimento.split('-');
    if (parts.length < 3) return false;
    return `${parts[1]}-${parts[2]}` === currentMonthDay;
  });

  // Base stage counts matching the political funnel requested in reference image
  // Scale with realistic campaign projections for Alto Alegre
  const totalBaseMeta = config.metaTotalVotos || 3200;
  
  // Stages breakdown
  const stageStats = {
    falta_trabalhar: {
      label: 'Falta trabalhar',
      percent: 73.2,
      count: 2342,
      color: '#EA580C', // orange
      bgColor: 'bg-orange-500',
      textColor: 'text-orange-600',
      lightBg: 'bg-orange-50',
      borderColor: 'border-orange-200',
      dotColor: 'bg-orange-500',
    },
    relacionamento: {
      label: 'Criando relacionamento',
      percent: 12.3,
      count: 394,
      color: '#9333EA', // purple
      bgColor: 'bg-purple-600',
      textColor: 'text-purple-600',
      lightBg: 'bg-purple-50',
      borderColor: 'border-purple-200',
      dotColor: 'bg-purple-600',
    },
    conquistado: {
      label: 'Conquistado',
      percent: 14.5,
      count: 464,
      color: '#16A34A', // green
      bgColor: 'bg-emerald-600',
      textColor: 'text-emerald-600',
      lightBg: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      dotColor: 'bg-emerald-600',
    },
    perdido: {
      label: 'Perdido',
      percent: 0.0,
      count: 0,
      color: '#94A3B8', // slate-400
      bgColor: 'bg-slate-400',
      textColor: 'text-slate-500',
      lightBg: 'bg-slate-50',
      borderColor: 'border-slate-200',
      dotColor: 'bg-slate-400',
    },
  };

  // Demand metrics
  const totalDemandas = demandas.length;
  const concluidas = demandas.filter(d => d.status === 'Concluída').length;
  const emAndamento = demandas.filter(d => ['Em Análise', 'Ofício Encaminhado', 'Em Execução'].includes(d.status)).length;
  const taxaResolucao = totalDemandas > 0 ? Math.round(((concluidas + (emAndamento * 0.4)) / totalDemandas) * 100) : 0;

  // Real localities and strategic targets for Alto Alegre - RR
  const bairrosAltoAlegre = [
    { nome: 'Vila do Taiano (Polo Taiano)', regiao: 'Rural', meta: 130, alcancados: 125, cor: 'bg-emerald-600' },
    { nome: 'Centro (Sede)', regiao: 'Urbana', meta: 120, alcancados: 112, cor: 'bg-blue-600' },
    { nome: 'Mutirão I', regiao: 'Urbana', meta: 65, alcancados: 58, cor: 'bg-indigo-600' },
    { nome: 'Felicidade', regiao: 'Urbana', meta: 55, alcancados: 49, cor: 'bg-amber-600' },
    { nome: 'Mutirão II', regiao: 'Urbana', meta: 50, alcancados: 44, cor: 'bg-purple-600' },
    { nome: 'Vila Reislândia (Paredão)', regiao: 'Rural', meta: 45, alcancados: 41, cor: 'bg-teal-600' },
    { nome: 'Cidade Nova', regiao: 'Urbana', meta: 40, alcancados: 35, cor: 'bg-rose-600' },
    { nome: 'Vila São Silvestre', regiao: 'Rural', meta: 35, alcancados: 31, cor: 'bg-cyan-600' },
  ];

  // Weekly evolution chart data matching reference image
  // Dates: 18/07, 25/07, 01/08, 08/08, 15/08, 22/08, 29/08, 05/09
  // Points: 280, 490, 720, 1150, 1420, 1280, 1180, 950 (ongoing)
  const weeklyData = [
    { semana: '18/07', valor: 280 },
    { semana: '25/07', valor: 540 },
    { semana: '01/08', valor: 780 },
    { semana: '08/08', valor: 1250 },
    { semana: '15/08', valor: 1440 },
    { semana: '22/08', valor: 1310 },
    { semana: '29/08', valor: 1190 },
    { semana: '05/09', valor: 960, emAndamento: true },
  ];

  // SVG dimensions for weekly curve chart
  const chartWidth = 560;
  const chartHeight = 160;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 15;
  const padBottom = 25;
  const usableWidth = chartWidth - padLeft - padRight;
  const usableHeight = chartHeight - padTop - padBottom;
  const maxVal = 1500;

  const points = weeklyData.map((d, index) => {
    const x = padLeft + (index / (weeklyData.length - 1)) * usableWidth;
    const y = padTop + usableHeight - (d.valor / maxVal) * usableHeight;
    return { x, y, ...d };
  });

  // Split into solid path (all but last) and dashed path for the ongoing week
  const solidPoints = points.slice(0, -1);
  const solidPathString = solidPoints.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');
  const dashedSegment = points.length >= 2 
    ? `M ${points[points.length - 2].x},${points[points.length - 2].y} L ${points[points.length - 1].x},${points[points.length - 1].y}`
    : '';

  // Area path for gradient under the weekly curve
  const areaPathString = solidPoints.length > 0 
    ? `${solidPathString} L ${solidPoints[solidPoints.length - 1].x},${chartHeight - padBottom} L ${solidPoints[0].x},${chartHeight - padBottom} Z`
    : '';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Identity Card - Executive War Room */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
        {/* Subtle decorative top border highlight */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400"></div>

        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-900 text-white shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              SALA DE SITUAÇÃO
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
              <MapPin className="w-3 h-3" />
              {config.cidade} - {config.uf}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {config.partido} • 15
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Gabinete {config.nomeParlamentar}</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 hidden sm:inline-block">
              {config.cargo}
            </span>
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5 font-mono">
            <span>Meta: <strong className="text-slate-800 font-bold">520 votos</strong></span>
            <span className="text-slate-300">|</span>
            <span>Quociente: <strong className="text-slate-800 font-bold">~380</strong></span>
            <span className="text-slate-300">|</span>
            <span>Base: <strong className="text-blue-700 font-bold">3.200 cadastrados</strong></span>
            <span className="text-slate-300">|</span>
            <span>Eleições: <strong className="text-emerald-700 font-bold">2026</strong></span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('pesquisas')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md shadow-slate-900/20 border border-slate-800 hover:scale-[1.02]"
            title="Acessar Pesquisa Eleitoral e Metas de Votos"
          >
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Pesquisas & Metas</span>
          </button>
          <button
            onClick={onOpenNewEleitor}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 hover:scale-[1.02]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Pessoa</span>
          </button>
          <button
            onClick={onOpenNewDemanda}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold transition-all border border-slate-200"
          >
            <PlusCircle className="w-4 h-4 text-slate-600" />
            <span>Nova Demanda</span>
          </button>
        </div>
      </div>

      {/* Birthday Alert Banner (if any) */}
      {aniversariantesHoje.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
              <Cake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Aniversariantes de Hoje em Alto Alegre ({aniversariantesHoje.length})
                </h4>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  Hoje
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Envie os parabéns do Gabinete do Vereador Kauan Lorenço com 1 clique pelo WhatsApp!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {aniversariantesHoje.slice(0, 2).map((eleitor) => (
              <button
                key={eleitor.id}
                onClick={() => onSendWhatsApp(eleitor, 'aniversario')}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                title={`Enviar parabéns para ${eleitor.nome}`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Parabenizar {eleitor.nome.split(' ')[0]}</span>
              </button>
            ))}
            <button
              onClick={() => onNavigateTab('whatsapp')}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg text-xs font-semibold hover:bg-amber-100/60 transition-colors"
            >
              Ver todos →
            </button>
          </div>
        </div>
      )}

      {/* CORE 2-COLUMN SECTION: "Resumo" & "Evolução Semanal" (Direct Translation of Reference Image) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: RESUMO (Funnel & Stages of the Base) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Resumo
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pré-campanha 2026 — em que estágio está cada pessoa da base.
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                Total: 3.200
              </span>
            </div>

            {/* Stages Stack */}
            <div className="mt-6 space-y-5">
              {/* 1. Falta trabalhar */}
              <div 
                onClick={() => {
                  setSelectedEstagioFilter(selectedEstagioFilter === 'falta_trabalhar' ? null : 'falta_trabalhar');
                }}
                className="group cursor-pointer"
              >
                <div className="flex items-baseline justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                    <span className="text-xs font-bold text-slate-800">
                      Falta trabalhar
                    </span>
                  </div>
                  <span className="text-xs font-bold text-orange-600">
                    73,2%
                  </span>
                </div>
                {/* Thick smooth progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full rounded-full transition-all duration-500 group-hover:brightness-95" 
                    style={{ width: '73.2%' }}
                  ></div>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>2.342 pessoas na base</span>
                  <span className="text-slate-400 group-hover:text-blue-600 transition-colors text-[10px]">
                    filtrar lista
                  </span>
                </div>
              </div>

              {/* 2. Criando relacionamento */}
              <div 
                onClick={() => {
                  setSelectedEstagioFilter(selectedEstagioFilter === 'relacionamento' ? null : 'relacionamento');
                }}
                className="group cursor-pointer"
              >
                <div className="flex items-baseline justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                    <span className="text-xs font-bold text-slate-800">
                      Criando relacionamento
                    </span>
                  </div>
                  <span className="text-xs font-bold text-purple-600">
                    12,3%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-600 h-full rounded-full transition-all duration-500 group-hover:brightness-95" 
                    style={{ width: '12.3%' }}
                  ></div>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>394 pessoas na base</span>
                  <span className="text-slate-400 group-hover:text-blue-600 transition-colors text-[10px]">
                    filtrar lista
                  </span>
                </div>
              </div>

              {/* 3. Conquistado */}
              <div 
                onClick={() => {
                  setSelectedEstagioFilter(selectedEstagioFilter === 'conquistado' ? null : 'conquistado');
                }}
                className="group cursor-pointer"
              >
                <div className="flex items-baseline justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span className="text-xs font-bold text-slate-800">
                      Conquistado
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">
                    14,5%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500 group-hover:brightness-95" 
                    style={{ width: '14.5%' }}
                  ></div>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>464 pessoas na base</span>
                  <span className="text-slate-400 group-hover:text-blue-600 transition-colors text-[10px]">
                    filtrar lista
                  </span>
                </div>
              </div>

              {/* 4. Perdido */}
              <div 
                onClick={() => {
                  setSelectedEstagioFilter(selectedEstagioFilter === 'perdido' ? null : 'perdido');
                }}
                className="group cursor-pointer"
              >
                <div className="flex items-baseline justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span className="text-xs font-bold text-slate-800">
                      Perdido
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    0%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-slate-300 h-full rounded-full" 
                    style={{ width: '0%' }}
                  ></div>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>0 pessoas na base</span>
                  <span className="text-slate-400 group-hover:text-blue-600 transition-colors text-[10px]">
                    filtrar lista
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => onNavigateTab('eleitores')}
              className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
            >
              <span>Abrir CRM completo de Eleitores</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-slate-400">
              Meta Alto Alegre: 3.200
            </span>
          </div>
        </div>

        {/* CARD 2: EVOLUÇÃO SEMANAL (Weekly Timeline & Smooth Chart) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Evolução semanal
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quantas pessoas entraram em cada uma das últimas 8 semanas.
                </p>
              </div>

              {/* Pill with total reach */}
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs">
                <span>↗ 3,2 mil</span>
              </div>
            </div>

            {/* SVG Chart with Y-axis, Area gradient, and X-axis ticks */}
            <div className="mt-6 relative">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-44 overflow-visible"
              >
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.28" />
                    <stop offset="60%" stopColor="#2563EB" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference lines & Y labels */}
                {[1500, 1000, 500, 0].map((val) => {
                  const y = padTop + usableHeight - (val / maxVal) * usableHeight;
                  return (
                    <g key={val}>
                      <line 
                        x1={padLeft} 
                        y1={y} 
                        x2={chartWidth - padRight} 
                        y2={y} 
                        stroke="#F1F5F9" 
                        strokeDasharray={val === 0 ? undefined : "3 3"} 
                        strokeWidth="1.2"
                      />
                      <text 
                        x={padLeft - 8} 
                        y={y + 3.5} 
                        fill="#94A3B8" 
                        fontSize="9" 
                        textAnchor="end"
                        fontFamily="monospace"
                        fontWeight="600"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Area under the curve */}
                {areaPathString && (
                  <path
                    d={areaPathString}
                    fill="url(#curveGradient)"
                  />
                )}

                {/* Solid line for completed weeks */}
                <path
                  d={solidPathString}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Dashed line for current ongoing week */}
                {dashedSegment && (
                  <path
                    d={dashedSegment}
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />
                )}

                {/* Data points & X labels */}
                {points.map((pt, i) => (
                  <g key={pt.semana}>
                    {/* Pulsing beacon on the current active week */}
                    {pt.emAndamento && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="10"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="1.5"
                        opacity="0.4"
                        className="animate-ping"
                      />
                    )}

                    {/* Circle Node */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={pt.emAndamento ? "5" : "4"}
                      fill={pt.emAndamento ? "#FFFFFF" : "#2563EB"}
                      stroke="#2563EB"
                      strokeWidth={pt.emAndamento ? "2.5" : "2"}
                      className="transition-transform hover:scale-125 cursor-pointer shadow-xs"
                    />
                    
                    {/* Tooltip on hover */}
                    <title>{`${pt.semana}: ${pt.valor} cadastros ${pt.emAndamento ? '(em andamento)' : ''}`}</title>

                    {/* Date label at bottom */}
                    <text
                      x={pt.x}
                      y={chartHeight - 4}
                      fill={pt.emAndamento ? "#1E293B" : "#64748B"}
                      fontSize="9.5" 
                      textAnchor="middle"
                      fontFamily="monospace"
                      fontWeight={pt.emAndamento ? "bold" : "500"}
                    >
                      {pt.semana}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Footer Legend and Numbers Modal Trigger */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-blue-600 inline-block"></span>
              <span>Semana em andamento — ainda vai fechar</span>
            </div>

            <button
              onClick={() => setShowNumbersModal(true)}
              className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 hover:underline"
            >
              <span>Ver os números &gt;</span>
            </button>
          </div>
        </div>
      </div>

      {/* FOUR POWER CARDS (Executive Mandate Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Eleitores Cadastrados */}
        <div 
          onClick={() => onNavigateTab('eleitores')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Pessoas na Base
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              3.200
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <TrendingUp className="w-3 h-3" /> +145 m/m
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            Meta: 3.200 contatos em Alto Alegre
          </p>
        </div>

        {/* Metric 2: Demandas Protocoladas */}
        <div 
          onClick={() => onNavigateTab('demandas')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Demandas da Cidade
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {demandas.length}
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              {concluidas} resolvidas
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            {emAndamento} ofícios em tramitação
          </p>
        </div>

        {/* Metric 3: Presença nos Bairros */}
        <div 
          onClick={() => onNavigateTab('raiox')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Polos & Vilas
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              8 polos
            </span>
            <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
              100% ativo
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            Sede e Vilas (Taiano, Paredão)
          </p>
        </div>

        {/* Metric 4: Lideranças Comunitárias */}
        <div 
          onClick={() => onNavigateTab('liderancas')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Lideranças Ativas
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {liderancas.length}
            </span>
            <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              Multiplicadores
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            Capilaridade em Alto Alegre
          </p>
        </div>
      </div>

      {/* LOWER SPLIT: Territorial Presence in Alto Alegre & Recent Demands */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Territorial Coverage in Alto Alegre */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Presença Territorial em Alto Alegre
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  8 Polos Estratégicos
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Votos conquistados vs. meta eleitoral projetada para a pré-campanha 2026
              </p>
            </div>
            
            <button
              onClick={() => onNavigateTab('raiox')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto hover:underline"
            >
              <span>Abrir Mapa Interativo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grid of Alto Alegre Neighborhoods with Targets and Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
            {bairrosAltoAlegre.map((bairro) => {
              const perc = Math.round((bairro.alcancados / bairro.meta) * 100);
              return (
                <div 
                  key={bairro.nome}
                  onClick={() => onNavigateTab('raiox')}
                  className="p-3 rounded-xl bg-slate-50/80 hover:bg-white border border-slate-200/70 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-bold text-slate-800 text-xs truncate">
                        {bairro.nome}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                        bairro.regiao === 'Rural' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {bairro.regiao}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-900 shrink-0">
                      {bairro.alcancados} <span className="text-slate-400 font-normal">/ {bairro.meta}</span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200/80 h-2 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`${bairro.cor} h-full rounded-full transition-all`} 
                      style={{ width: `${Math.min(100, perc)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
                    <span className="font-semibold text-slate-700">{perc}% da meta</span>
                    <span className="text-blue-600 font-semibold group-hover:underline">
                      Ver detalhes →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Recent Demands from Alto Alegre */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Demandas da Cidade
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Últimos protocolos abertos</p>
              </div>
              <button
                onClick={() => onNavigateTab('demandas')}
                className="text-xs font-mono font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Ver todas →
              </button>
            </div>

            <div className="divide-y divide-slate-100/90 mt-2 space-y-1.5">
              {demandas.slice(0, 4).map((demanda) => {
                const statusStyles: { [key: string]: { bg: string; text: string; border: string } } = {
                  'Recebida': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
                  'Em Análise': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
                  'Ofício Encaminhado': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
                  'Em Execução': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
                  'Concluída': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
                };
                const style = statusStyles[demanda.status] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };

                return (
                  <div
                    key={demanda.id}
                    onClick={() => onSelectDemanda(demanda)}
                    className="pt-2.5 pb-2 px-2.5 cursor-pointer group hover:bg-slate-50/90 rounded-xl transition-all border border-transparent hover:border-slate-200/80"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors line-clamp-1">
                        {demanda.titulo}
                      </h5>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shrink-0 border ${style.bg} ${style.text} ${style.border}`}>
                        {demanda.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-medium">
                      <span className="text-slate-700 font-semibold">{demanda.bairro}</span> • {demanda.eleitorNome}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1.5">
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">{demanda.protocolo}</span>
                      <span>{demanda.dataAbertura}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={onOpenNewDemanda}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all text-center shadow-xs flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Protocolar Nova Demanda</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: "Ver os números" Breakdown (Triggered by weekly evolution link) */}
      {showNumbersModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowNumbersModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  Evolução Semanal de Cadastros
                </h4>
                <p className="text-xs text-slate-500">
                  Detalhamento das últimas 8 semanas da base em Alto Alegre
                </p>
              </div>
              <button 
                onClick={() => setShowNumbersModal(false)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-lg text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {weeklyData.map((item, idx) => (
                <div key={item.semana} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">Semana {item.semana}</span>
                    {item.emAndamento && (
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                        Em andamento
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900">{item.valor.toLocaleString('pt-BR')} cadastros</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Total acumulado: <b>3.200 pessoas</b>
              </span>
              <button
                onClick={() => {
                  setShowNumbersModal(false);
                  onNavigateTab('eleitores');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Ver Base de Pessoas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
