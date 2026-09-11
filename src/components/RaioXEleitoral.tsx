import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Search,
  RotateCcw,
  Printer,
  Compass,
  Users,
  Award,
  Layers,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  BarChart3,
  ListFilter,
  Eye,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Eleitor, Demanda, Lideranca, MandatoConfig } from '../types';

interface RaioXEleitoralProps {
  eleitores: Eleitor[];
  demandas: Demanda[];
  liderancas: Lideranca[];
  config: MandatoConfig;
  onNavigateToCRMWithBairro: (bairro: string) => void;
  onOpenEleitorDetails?: (eleitorId: string) => void;
}

// Bairros & Vilas oficiais de Alto Alegre - RR
export const BAIRROS_ALTO_ALEGRE_RR = [
  { nome: 'Centro', regiao: 'Sede Urbana', zona: 'Urbana', lat: 2.9892, lng: -61.2970, metaPadrao: 120 },
  { nome: 'Mutirão I', regiao: 'Sede Urbana', zona: 'Urbana', lat: 2.9855, lng: -61.2942, metaPadrao: 60 },
  { nome: 'Mutirão II', regiao: 'Sede Urbana', zona: 'Urbana', lat: 2.9825, lng: -61.2920, metaPadrao: 45 },
  { nome: 'Felicidade', regiao: 'Sede Urbana', zona: 'Urbana', lat: 2.9918, lng: -61.3015, metaPadrao: 50 },
  { nome: 'Cidade Nova', regiao: 'Sede Urbana', zona: 'Urbana', lat: 2.9950, lng: -61.2930, metaPadrao: 35 },
  { nome: 'Novo Horizonte', regiao: 'Sede Urbana', zona: 'Urbana', lat: 2.9868, lng: -61.3025, metaPadrao: 25 },
  { nome: 'Vila do Taiano', regiao: 'Região do Taiano', zona: 'Rural', lat: 3.1250, lng: -61.1850, metaPadrao: 125 },
  { nome: 'Vila São Silvestre', regiao: 'Região São Silvestre', zona: 'Rural', lat: 2.8950, lng: -61.4200, metaPadrao: 30 },
  { nome: 'Vila Reislândia (Paredão)', regiao: 'Região do Paredão', zona: 'Rural', lat: 2.7600, lng: -61.4500, metaPadrao: 40 },
  { nome: 'Vila São Sebastião', regiao: 'Região do Taiano', zona: 'Rural', lat: 3.0500, lng: -61.2200, metaPadrao: 25 },
  { nome: 'Vila Santa Rita', regiao: 'Região do Taiano', zona: 'Rural', lat: 3.0800, lng: -61.1400, metaPadrao: 20 },
  { nome: 'Vila Recrear', regiao: 'Região São Silvestre', zona: 'Rural', lat: 2.9100, lng: -61.3500, metaPadrao: 15 },
  { nome: 'Assentamento Cedro', regiao: 'Zona Rural', zona: 'Rural', lat: 3.0100, lng: -61.3800, metaPadrao: 20 },
];

export const RaioXEleitoral: React.FC<RaioXEleitoralProps> = ({
  eleitores,
  demandas,
  liderancas,
  config,
  onNavigateToCRMWithBairro,
  onOpenEleitorDetails,
}) => {
  // Navigation views: 'map' (Georreferenciamento), 'stats' (Metas & Estatísticas), 'table' (Lista de Contatos)
  const [activeTab, setActiveTab] = useState<'map' | 'stats' | 'table'>('map');

  // Filter Form State (identifying all inputs from the uploaded screenshot)
  const [filterBuscarPor, setFilterBuscarPor] = useState<string>('Todos');
  const [filterNome, setFilterNome] = useState<string>('');
  const [filterCategoria, setFilterCategoria] = useState<string>('Todas');
  const [filterCategoria2, setFilterCategoria2] = useState<string>('Todas');
  const [filterCategoria3, setFilterCategoria3] = useState<string>('Todos');
  const [filterLideranca, setFilterLideranca] = useState<string>('Todas');
  const [filterSexo, setFilterSexo] = useState<string>('Todos');
  const [filterComAtendimento, setFilterComAtendimento] = useState<string>('Todos');
  const [filterStatusAtendimento, setFilterStatusAtendimento] = useState<string>('Todos');
  const [filterBairro, setFilterBairro] = useState<string>('Todos');
  const [filterCidade, setFilterCidade] = useState<string>('Alto Alegre - RR');
  const [filterRegiao, setFilterRegiao] = useState<string>('Todas');
  const [filterZona, setFilterZona] = useState<string>('Todas');

  // Map layer toggle: 'streets' | 'satellite' | 'topo'
  const [mapLayer, setMapLayer] = useState<'streets' | 'satellite' | 'topo'>('streets');

  // Selected bairro for stats inspection
  const [selectedBairroStats, setSelectedBairroStats] = useState<string>('Centro');

  // Leaflet refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Map center for Alto Alegre - RR (Sede)
  const DEFAULT_CENTER: [number, number] = [2.9892, -61.2970];

  // Clear all filters
  const handleClearFilters = () => {
    setFilterBuscarPor('Todos');
    setFilterNome('');
    setFilterCategoria('Todas');
    setFilterCategoria2('Todas');
    setFilterCategoria3('Todos');
    setFilterLideranca('Todas');
    setFilterSexo('Todos');
    setFilterComAtendimento('Todos');
    setFilterStatusAtendimento('Todos');
    setFilterBairro('Todos');
    setFilterCidade('Alto Alegre - RR');
    setFilterRegiao('Todas');
    setFilterZona('Todas');
  };

  // Filtered eleitores list
  const filteredEleitores = useMemo(() => {
    return eleitores.filter((eleitor) => {
      // Nome filter
      if (filterNome.trim()) {
        const query = filterNome.toLowerCase();
        const matchNome = eleitor.nome.toLowerCase().includes(query);
        const matchEndereco = (eleitor.endereco || '').toLowerCase().includes(query);
        const matchBairro = (eleitor.bairro || '').toLowerCase().includes(query);
        if (!matchNome && !matchEndereco && !matchBairro) return false;
      }

      // Sexo filter
      if (filterSexo !== 'Todos') {
        if (eleitor.sexo && eleitor.sexo !== filterSexo) return false;
        if (!eleitor.sexo) {
          // If unassigned, infer from name or pass
          if (filterSexo === 'Feminino' && !['Maria', 'Fernanda', 'Renata', 'Sandra', 'Cláudia', 'Gisele'].some(n => eleitor.nome.includes(n))) {
            return false;
          }
          if (filterSexo === 'Masculino' && ['Maria', 'Fernanda', 'Renata', 'Sandra', 'Cláudia', 'Gisele'].some(n => eleitor.nome.includes(n))) {
            return false;
          }
        }
      }

      // Liderança filter
      if (filterLideranca !== 'Todas') {
        if (eleitor.liderancaNome !== filterLideranca && eleitor.liderancaId !== filterLideranca) return false;
      }

      // Bairro filter
      if (filterBairro !== 'Todos') {
        if (eleitor.bairro !== filterBairro) return false;
      }

      // Região filter
      if (filterRegiao !== 'Todas') {
        if (eleitor.regiao) {
          if (eleitor.regiao !== filterRegiao) return false;
        } else {
          // Infer region from bairro
          const bairroMeta = BAIRROS_ALTO_ALEGRE_RR.find(b => b.nome === eleitor.bairro);
          if (bairroMeta && bairroMeta.regiao !== filterRegiao) return false;
        }
      }

      // Zona filter
      if (filterZona !== 'Todas') {
        if (eleitor.zona) {
          if (eleitor.zona !== filterZona) return false;
        } else {
          const bairroMeta = BAIRROS_ALTO_ALEGRE_RR.find(b => b.nome === eleitor.bairro);
          if (bairroMeta && bairroMeta.zona !== filterZona) return false;
        }
      }

      // Categoria filter
      if (filterCategoria !== 'Todas') {
        const hasTag = eleitor.tags?.some(tag => tag.toLowerCase().includes(filterCategoria.toLowerCase()));
        if (!hasTag) return false;
      }

      // Categoria 2 (Prioridade)
      if (filterCategoria2 !== 'Todas') {
        if (eleitor.categoria2 && eleitor.categoria2 !== filterCategoria2) return false;
      }

      // Categoria 3 (Canal / Contato)
      if (filterCategoria3 !== 'Todos') {
        if (eleitor.categoria3 && eleitor.categoria3 !== filterCategoria3) return false;
      }

      // Com atendimento (Demandas)
      const eleitorDemandas = demandas.filter(d => d.eleitorId === eleitor.id);
      if (filterComAtendimento === 'Sim') {
        if (eleitorDemandas.length === 0) return false;
      } else if (filterComAtendimento === 'Não') {
        if (eleitorDemandas.length > 0) return false;
      }

      // Status Atendimento
      if (filterStatusAtendimento !== 'Todos') {
        const hasStatus = eleitorDemandas.some(d => d.status === filterStatusAtendimento);
        if (!hasStatus) return false;
      }

      return true;
    });
  }, [
    eleitores,
    demandas,
    filterNome,
    filterSexo,
    filterLideranca,
    filterBairro,
    filterRegiao,
    filterZona,
    filterCategoria,
    filterCategoria2,
    filterCategoria3,
    filterComAtendimento,
    filterStatusAtendimento,
  ]);

  // Statistics counters (matching top card in screenshot)
  const totalContatos = filteredEleitores.length;
  const totalComEndereco = filteredEleitores.filter(e => e.endereco && e.endereco.trim().length > 0).length;
  const totalComGeolocalizacao = filteredEleitores.filter(e => {
    if (e.latitude && e.longitude) return true;
    const bairroMeta = BAIRROS_ALTO_ALEGRE_RR.find(b => b.nome === e.bairro);
    return !!bairroMeta;
  }).length;

  // Initialize Leaflet Map
  useEffect(() => {
    if (activeTab !== 'map' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create Map instance
      const map = L.map(mapContainerRef.current, {
        center: DEFAULT_CENTER,
        zoom: 13,
        zoomControl: true,
      });

      // Default base layer: OpenStreetMap
      const streetsLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | Gabinete Kauan Lorenço',
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = streetsLayer;

      // Group for markers
      const markerGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markerGroup;
      mapInstanceRef.current = map;
    }

    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [activeTab]);

  // Update base tile layer on mode change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors';

    if (mapLayer === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    } else if (mapLayer === 'topo') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)';
    }

    const newLayer = L.tileLayer(url, { attribution, maxZoom: 18 }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [mapLayer]);

  // Render markers whenever filtered list changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const bounds = L.latLngBounds([]);

    filteredEleitores.forEach((eleitor) => {
      // Derive lat/lng: from eleitor or fallback to neighborhood coordinates with jitter
      let lat = eleitor.latitude;
      let lng = eleitor.longitude;

      if (!lat || !lng) {
        const fallbackBairro = BAIRROS_ALTO_ALEGRE_RR.find(b => b.nome === eleitor.bairro);
        if (fallbackBairro) {
          // slight deterministic jitter so multiple pins in the same neighborhood don't stack directly
          const seed = eleitor.id.charCodeAt(eleitor.id.length - 1) || 1;
          const jitterLat = ((seed % 7) - 3) * 0.0012;
          const jitterLng = (((seed * 3) % 7) - 3) * 0.0012;
          lat = fallbackBairro.lat + jitterLat;
          lng = fallbackBairro.lng + jitterLng;
        }
      }

      if (!lat || !lng) return;

      bounds.extend([lat, lng]);

      // Determine pin color and style:
      // Blue pin for male/active, Yellow pin for female/priority (matching screenshot)
      const isFemale = eleitor.sexo === 'Feminino' || ['Maria', 'Fernanda', 'Renata', 'Sandra', 'Cláudia', 'Gisele'].some(n => eleitor.nome.includes(n));
      const pinColor = isFemale ? '#eab308' : '#2563eb'; // gold/yellow or deep blue
      const pinBorder = isFemale ? '#ca8a04' : '#1d4ed8';

      // Associated demands
      const eleitorDemandas = demandas.filter(d => d.eleitorId === eleitor.id);
      const hasDemandas = eleitorDemandas.length > 0;
      const allConcluded = hasDemandas && eleitorDemandas.every(d => d.status === 'Concluída');

      // Create Custom Avatar Pin DivIcon
      const initials = eleitor.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

      const customIcon = L.divIcon({
        className: 'custom-geo-marker',
        iconSize: [38, 48],
        iconAnchor: [19, 46],
        popupAnchor: [0, -44],
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background-color: ${pinColor};
              border: 3px solid #ffffff;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 800;
              font-size: 13px;
              color: #ffffff;
              text-shadow: 0 1px 2px rgba(0,0,0,0.5);
              transition: transform 0.2s;
            ">
              ${initials}
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 8px solid ${pinBorder};
              margin-top: -2px;
            "></div>
            ${hasDemandas ? `
              <div style="
                position: absolute;
                top: -2px;
                right: -2px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: ${allConcluded ? '#10b981' : '#f97316'};
                border: 2px solid #ffffff;
              "></div>
            ` : ''}
          </div>
        `,
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Build popup content
      const popupHtml = `
        <div style="font-family: sans-serif; min-width: 220px; max-width: 280px; padding: 2px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="
              width: 34px;
              height: 34px;
              border-radius: 50%;
              background-color: ${pinColor};
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 12px;
              flex-shrink: 0;
            ">
              ${initials}
            </div>
            <div>
              <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #0f172a; line-height: 1.2;">${eleitor.nome}</h4>
              <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">${eleitor.bairro} &bull; Alto Alegre - RR</p>
            </div>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px; font-size: 11px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748b;">Apoio:</span>
              <span style="font-weight: 700; color: ${eleitor.apoio === 'Fiel' ? '#15803d' : '#0369a1'};">${eleitor.apoio}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748b;">Zona / Região:</span>
              <span style="font-weight: 600; color: #334155;">${eleitor.zona || 'Urbana'} (${eleitor.regiao || 'Sede'})</span>
            </div>
            ${eleitor.liderancaNome ? `
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Liderança:</span>
                <span style="font-weight: 600; color: #d97706;">${eleitor.liderancaNome}</span>
              </div>
            ` : ''}
          </div>

          ${eleitor.endereco ? `
            <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">
              📍 <b>Endereço:</b> ${eleitor.endereco}
            </div>
          ` : ''}

          ${hasDemandas ? `
            <div style="margin-bottom: 8px; font-size: 11px; border-left: 3px solid #0284c7; padding-left: 6px;">
              <b style="color: #0369a1;">Demanda Cadastrada:</b><br/>
              <span>${eleitorDemandas[0].titulo}</span><br/>
              <span style="font-size: 10px; color: #64748b;">Status: <b>${eleitorDemandas[0].status}</b></span>
            </div>
          ` : ''}

          <div style="display: flex; gap: 6px; margin-top: 8px;">
            <a 
              href="https://wa.me/55${eleitor.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${eleitor.nome.split(' ')[0]}, tudo bem? Aqui é do Gabinete do Vereador Kauan Lorenço de Alto Alegre - RR.`)}" 
              target="_blank" 
              style="
                flex: 1;
                text-align: center;
                background-color: #15803d;
                color: white;
                padding: 6px 8px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 700;
                text-decoration: none;
                display: block;
              "
            >
              WhatsApp
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      markersLayerRef.current?.addLayer(marker);
    });

    // If bounds are valid, fit map view comfortably
    if (bounds.isValid() && filteredEleitores.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    } else {
      mapInstanceRef.current.setView(DEFAULT_CENTER, 13);
    }
  }, [filteredEleitores, demandas]);

  // Teleport map view to specific locality
  const handleFlyTo = (lat: number, lng: number, zoom: number = 14) => {
    setActiveTab('map');
    setTimeout(() => {
      mapInstanceRef.current?.flyTo([lat, lng], zoom, { duration: 1.2 });
    }, 100);
  };

  // Grouped stats by Bairro for the Metas/Stats tab
  const bairrosStats = useMemo(() => {
    const map: { [key: string]: {
      bairro: string;
      regiao: string;
      zona: string;
      eleitoresCount: number;
      fieisCount: number;
      demandasCount: number;
      demandasConcluidas: number;
      metaVotos: number;
      liderancas: string[];
    }} = {};

    BAIRROS_ALTO_ALEGRE_RR.forEach((b) => {
      map[b.nome] = {
        bairro: b.nome,
        regiao: b.regiao,
        zona: b.zona,
        eleitoresCount: 0,
        fieisCount: 0,
        demandasCount: 0,
        demandasConcluidas: 0,
        metaVotos: b.metaPadrao,
        liderancas: [],
      };
    });

    eleitores.forEach((e) => {
      if (!map[e.bairro]) {
        map[e.bairro] = {
          bairro: e.bairro,
          regiao: e.regiao || 'Outra Região',
          zona: e.zona || 'Urbana',
          eleitoresCount: 0,
          fieisCount: 0,
          demandasCount: 0,
          demandasConcluidas: 0,
          metaVotos: 30,
          liderancas: [],
        };
      }
      map[e.bairro].eleitoresCount += 1;
      if (e.apoio === 'Fiel') map[e.bairro].fieisCount += 1;
      if (e.liderancaNome && !map[e.bairro].liderancas.includes(e.liderancaNome)) {
        map[e.bairro].liderancas.push(e.liderancaNome);
      }
    });

    demandas.forEach((d) => {
      if (!map[d.bairro]) {
        map[d.bairro] = {
          bairro: d.bairro,
          regiao: 'Outra Região',
          zona: 'Urbana',
          eleitoresCount: 0,
          fieisCount: 0,
          demandasCount: 0,
          demandasConcluidas: 0,
          metaVotos: 30,
          liderancas: [],
        };
      }
      map[d.bairro].demandasCount += 1;
      if (d.status === 'Concluída') map[d.bairro].demandasConcluidas += 1;
    });

    return Object.values(map).sort((a, b) => b.eleitoresCount - a.eleitoresCount);
  }, [eleitores, demandas]);

  const activeBairroStat = bairrosStats.find(b => b.bairro === selectedBairroStats) || bairrosStats[0];

  // Print layout action
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header & Tab Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600"></div>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-900 text-emerald-100 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              RADAR TERRITORIAL
            </span>
            <span className="bg-slate-100 text-slate-800 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border border-slate-200">
              {config.cidade} - {config.uf}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Sede & 8 Polos Rurais
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Raio-X & Georreferenciamento Eleitoral
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Inteligência de campo, mapeamento de domicílios, lideranças e metas de votos em Alto Alegre - RR
          </p>
        </div>

        {/* Tab switches */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 self-start md:self-auto shrink-0 shadow-inner">
          <button
            id="tab-map"
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mapa Satélite</span>
          </button>

          <button
            id="tab-stats"
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'stats'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Metas por Polo</span>
          </button>

          <button
            id="tab-table"
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'table'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Base de Campo ({filteredEleitores.length})</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Filter Column (Reproducing the exact "Georreferenciamento" panel from screenshot) */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3.5">
          {/* Header with Title and Action Icons */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-extrabold text-slate-900 text-sm tracking-wide">
              Georreferenciamento
            </h3>
            <div className="flex items-center gap-1">
              <button
                id="btn-filter-search"
                title="Filtrar"
                onClick={() => {}}
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              >
                <Search className="w-4 h-4 text-emerald-700" />
              </button>
              <button
                id="btn-filter-clear"
                title="Limpar Filtros"
                onClick={handleClearFilters}
                className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-rose-600" />
              </button>
              <button
                id="btn-filter-print"
                title="Imprimir Relatório"
                onClick={handlePrint}
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-700" />
              </button>
            </div>
          </div>

          {/* Form Fields matching the image exactly */}
          <div className="space-y-2.5 text-xs">
            {/* BUSCAR POR */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">BUSCAR POR</label>
              <select
                id="filter-buscar-por"
                value={filterBuscarPor}
                onChange={(e) => setFilterBuscarPor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-emerald-500 outline-hidden"
              >
                <option value="Todos">Todos</option>
                <option value="Eleitor">Eleitor</option>
                <option value="Demanda">Demanda</option>
                <option value="Liderança">Liderança</option>
              </select>
            </div>

            {/* NOME */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">NOME</label>
              <input
                id="filter-nome"
                type="text"
                placeholder="Filtrar por nome ou endereço..."
                value={filterNome}
                onChange={(e) => setFilterNome(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-emerald-500 outline-hidden placeholder:text-slate-400"
              />
            </div>

            {/* CATEGORIA */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">CATEGORIA</label>
              <select
                id="filter-categoria"
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-emerald-500 outline-hidden"
              >
                <option value="Todas">Todas as Categorias</option>
                <option value="Apoiador Ativo">Apoiador Ativo</option>
                <option value="Comerciante">Comerciante</option>
                <option value="Saúde">Saúde</option>
                <option value="Educação">Educação</option>
                <option value="Produtor Rural">Produtor Rural</option>
                <option value="Agricultura Familiar">Agricultura Familiar</option>
                <option value="Juventude">Juventude</option>
                <option value="Esporte">Esporte</option>
                <option value="Causa Animal">Causa Animal</option>
              </select>
            </div>

            {/* Grid for CATEGORIA 2 & CATEGORIA 3 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">CATEGORIA 2</label>
                <select
                  id="filter-categoria-2"
                  value={filterCategoria2}
                  onChange={(e) => setFilterCategoria2(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-emerald-500 outline-hidden"
                >
                  <option value="Todas">Todas</option>
                  <option value="Prioridade Alta">Prioridade Alta</option>
                  <option value="Normal">Normal</option>
                  <option value="Baixa">Baixa</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">CATEGORIA 3</label>
                <select
                  id="filter-categoria-3"
                  value={filterCategoria3}
                  onChange={(e) => setFilterCategoria3(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-emerald-500 outline-hidden"
                >
                  <option value="Todos">Todos</option>
                  <option value="Visita Domiciliar">Visita Domiciliar</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Reunião de Bairro">Reunião de Bairro</option>
                  <option value="Gabinete">Gabinete</option>
                </select>
              </div>
            </div>

            {/* LIDERANÇA */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">LIDERANÇA</label>
              <select
                id="filter-lideranca"
                value={filterLideranca}
                onChange={(e) => setFilterLideranca(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-emerald-500 outline-hidden"
              >
                <option value="Todas">Todas as Lideranças</option>
                {liderancas.map((lid) => (
                  <option key={lid.id} value={lid.nome}>{lid.nome} ({lid.bairroPrincipal})</option>
                ))}
              </select>
            </div>

            {/* SEXO & COM ATENDIMENTO */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">SEXO</label>
                <select
                  id="filter-sexo"
                  value={filterSexo}
                  onChange={(e) => setFilterSexo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-emerald-500 outline-hidden"
                >
                  <option value="Todos">Todos</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">COM ATENDIMENTO</label>
                <select
                  id="filter-com-atendimento"
                  value={filterComAtendimento}
                  onChange={(e) => setFilterComAtendimento(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-emerald-500 outline-hidden"
                >
                  <option value="Todos">Todos</option>
                  <option value="Sim">Sim (Com demanda)</option>
                  <option value="Não">Não (Sem demanda)</option>
                </select>
              </div>
            </div>

            {/* STATUS ATENDIMENTO */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">STATUS ATENDIMENTO</label>
              <select
                id="filter-status-atendimento"
                value={filterStatusAtendimento}
                onChange={(e) => setFilterStatusAtendimento(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-emerald-500 outline-hidden"
              >
                <option value="Todos">Todos os Status</option>
                <option value="Recebida">Recebida</option>
                <option value="Em Análise">Em Análise</option>
                <option value="Ofício Encaminhado">Ofício Encaminhado</option>
                <option value="Em Execução">Em Execução</option>
                <option value="Concluída">Concluída</option>
              </select>
            </div>

            {/* BAIRRO / LOCALIDADE (Alto Alegre - RR) */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">BAIRRO / LOCALIDADE</label>
              <select
                id="filter-bairro"
                value={filterBairro}
                onChange={(e) => setFilterBairro(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-emerald-500 outline-hidden"
              >
                <option value="Todos">Todos os Bairros e Vilas</option>
                <optgroup label="Sede Urbana">
                  <option value="Centro">Centro</option>
                  <option value="Mutirão I">Mutirão I</option>
                  <option value="Mutirão II">Mutirão II</option>
                  <option value="Felicidade">Felicidade</option>
                  <option value="Cidade Nova">Cidade Nova</option>
                  <option value="Novo Horizonte">Novo Horizonte</option>
                </optgroup>
                <optgroup label="Vilas e Polos Rurais">
                  <option value="Vila do Taiano">Vila do Taiano</option>
                  <option value="Vila São Silvestre">Vila São Silvestre</option>
                  <option value="Vila Reislândia (Paredão)">Vila Reislândia (Paredão)</option>
                  <option value="Vila São Sebastião">Vila São Sebastião</option>
                  <option value="Vila Santa Rita">Vila Santa Rita</option>
                  <option value="Vila Recrear">Vila Recrear</option>
                  <option value="Assentamento Cedro">Assentamento Cedro</option>
                </optgroup>
              </select>
            </div>

            {/* CIDADE */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">CIDADE</label>
              <select
                id="filter-cidade"
                value={filterCidade}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-md py-1.5 px-2.5 text-xs text-slate-800 font-semibold outline-hidden cursor-not-allowed"
              >
                <option value="Alto Alegre - RR">Alto Alegre - RR (Roraima)</option>
              </select>
            </div>

            {/* REGIÃO & ZONA */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">REGIÃO</label>
                <select
                  id="filter-regiao"
                  value={filterRegiao}
                  onChange={(e) => setFilterRegiao(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-emerald-500 outline-hidden"
                >
                  <option value="Todas">Todas</option>
                  <option value="Sede Urbana">Sede Urbana</option>
                  <option value="Região do Taiano">Região do Taiano</option>
                  <option value="Região do Paredão">Região do Paredão</option>
                  <option value="Região São Silvestre">São Silvestre</option>
                  <option value="Zona Rural">Zona Rural</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">ZONA</label>
                <select
                  id="filter-zona"
                  value={filterZona}
                  onChange={(e) => setFilterZona(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-emerald-500 outline-hidden"
                >
                  <option value="Todas">Todas</option>
                  <option value="Urbana">Urbana</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex gap-2">
              <button
                id="btn-apply-filters"
                onClick={() => {}}
                className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Aplicar Filtros</span>
              </button>
              <button
                id="btn-reset-filters"
                onClick={handleClearFilters}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        {/* Right 8/9 Columns: Main Content Area */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-3">
          {/* Floating Counters Card (Exact layout & styling from the uploaded screenshot) */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4 md:gap-8">
              {/* Total de Contato(s) */}
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                <div className="text-xs font-black text-slate-800 tracking-wide">
                  TOTAL DE CONTATO(S): <span className="text-blue-700 font-black text-sm">{totalContatos}</span>
                </div>
              </div>

              {/* Total com Endereço */}
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <div className="text-xs font-black text-slate-800 tracking-wide">
                  TOTAL COM ENDEREÇO: <span className="text-amber-700 font-black text-sm">{totalComEndereco}</span>
                </div>
              </div>

              {/* Total com Geolocalização */}
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                <div className="text-xs font-black text-slate-800 tracking-wide">
                  TOTAL COM GEOLOCALIZAÇÃO: <span className="text-emerald-700 font-black text-sm">{totalComGeolocalizacao}</span>
                </div>
              </div>
            </div>

            {/* Preset shortcuts */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Ir para:</span>
              <button
                onClick={() => handleFlyTo(2.9892, -61.2970, 14)}
                className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded border border-slate-200 transition-colors"
              >
                🏛️ Sede
              </button>
              <button
                onClick={() => handleFlyTo(3.1250, -61.1850, 13)}
                className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded border border-slate-200 transition-colors"
              >
                🌾 Taiano
              </button>
              <button
                onClick={() => handleFlyTo(2.7600, -61.4500, 13)}
                className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded border border-slate-200 transition-colors"
              >
                🌊 Paredão
              </button>
              <button
                onClick={() => handleFlyTo(2.8950, -61.4200, 13)}
                className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded border border-slate-200 transition-colors"
              >
                🌲 São Silvestre
              </button>
            </div>
          </div>

          {/* VIEW: MAP VIEW */}
          {activeTab === 'map' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs relative">
              {/* Map Layer switcher floating buttons */}
              <div className="absolute top-3 right-3 z-1000 flex items-center bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-slate-200 shadow-md gap-1">
                <button
                  onClick={() => setMapLayer('streets')}
                  className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
                    mapLayer === 'streets' ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Ruas
                </button>
                <button
                  onClick={() => setMapLayer('satellite')}
                  className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
                    mapLayer === 'satellite' ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Satélite
                </button>
                <button
                  onClick={() => setMapLayer('topo')}
                  className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
                    mapLayer === 'topo' ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Relevo
                </button>
              </div>

              {/* Map Canvas */}
              <div
                ref={mapContainerRef}
                style={{ height: '620px', width: '100%' }}
                className="z-0"
              />

              {/* Map Footer Legend */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 font-bold text-[11px] uppercase">Legenda no Mapa:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-600 border border-white shadow-xs"></span>
                    <span className="text-slate-700 text-[11px]">Eleitores / Contatos</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-yellow-500 border border-white shadow-xs"></span>
                    <span className="text-slate-700 text-[11px]">Contatos Prioritários / Mulheres</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-xs"></span>
                    <span className="text-slate-700 text-[11px]">Demanda Concluída</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 border border-white shadow-xs"></span>
                    <span className="text-slate-700 text-[11px]">Demanda em Andamento</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  📍 Alto Alegre - RR (Área Territorial: 25.567 km²)
                </div>
              </div>
            </div>
          )}

          {/* VIEW: STATS / METAS POR BAIRRO */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left 7 cols: Table of Bairros and Target Progress */}
              <div className="md:col-span-7 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm">Metas de Votos por Região de Alto Alegre - RR</h3>
                  <span className="text-xs text-slate-400">Clique para inspecionar</span>
                </div>

                <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                  {bairrosStats.map((item) => {
                    const isSelected = selectedBairroStats === item.bairro;
                    const percentual = Math.min(100, Math.round((item.eleitoresCount / item.metaVotos) * 100));

                    return (
                      <div
                        key={item.bairro}
                        onClick={() => setSelectedBairroStats(item.bairro)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                              <h4 className="font-bold text-slate-900 text-xs">{item.bairro}</h4>
                              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                {item.zona}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                              <span>👥 <b>{item.eleitoresCount}</b> cadastrados</span>
                              <span>•</span>
                              <span>⭐ <b>{item.fieisCount}</b> fiéis</span>
                              <span>•</span>
                              <span>📋 <b>{item.demandasCount}</b> demandas</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-black text-slate-800">
                              {item.eleitoresCount} / {item.metaVotos}
                            </span>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold">Meta de Votos</p>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-2">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-0.5">
                            <span>Penetração Política</span>
                            <span className={percentual >= 50 ? 'text-emerald-700' : 'text-amber-700'}>
                              {percentual}% alcançado
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                percentual >= 60 ? 'bg-emerald-600' : percentual >= 30 ? 'bg-teal-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${percentual}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right 5 cols: Active Neighborhood Inspector */}
              <div className="md:col-span-5 space-y-4">
                {activeBairroStat && (
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3.5">
                    <div className="border-b border-slate-100 pb-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Raio-X de Alto Alegre/RR
                      </span>
                      <h3 className="font-black text-slate-900 text-base mt-1 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        {activeBairroStat.bairro}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Região: <b>{activeBairroStat.regiao}</b> ({activeBairroStat.zona})
                      </p>
                    </div>

                    {/* Numerical Stats Badges */}
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-lg font-black text-slate-900">{activeBairroStat.eleitoresCount}</span>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">Eleitores</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-lg font-black text-slate-900">{activeBairroStat.demandasCount}</span>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">Demandas</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                        <span className="text-lg font-black text-emerald-800">{activeBairroStat.demandasConcluidas}</span>
                        <p className="text-[10px] font-semibold text-emerald-700 uppercase mt-0.5">Atendidas</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                        <span className="text-lg font-black text-amber-800">{activeBairroStat.metaVotos}</span>
                        <p className="text-[10px] font-semibold text-amber-700 uppercase mt-0.5">Meta Votos</p>
                      </div>
                    </div>

                    {/* Lideranças */}
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs mb-1.5 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        Lideranças no Local
                      </h4>
                      {activeBairroStat.liderancas.length > 0 ? (
                        <div className="space-y-1">
                          {activeBairroStat.liderancas.map((lid, idx) => (
                            <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between">
                              <span>{lid}</span>
                              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Ativa</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          Liderança geral do polo/região articulada pelo gabinete.
                        </p>
                      )}
                    </div>

                    {/* Quick navigation actions */}
                    <div className="space-y-1.5 pt-1">
                      <button
                        onClick={() => {
                          const locality = BAIRROS_ALTO_ALEGRE_RR.find(b => b.nome === activeBairroStat.bairro);
                          if (locality) handleFlyTo(locality.lat, locality.lng, 14);
                        }}
                        className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Ver no Mapa Georreferenciado</span>
                      </button>

                      <button
                        onClick={() => onNavigateToCRMWithBairro(activeBairroStat.bairro)}
                        className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Ver Eleitores no CRM</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Mandate Strategic Advice */}
                <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-4 rounded-xl border border-emerald-800 shadow-xs space-y-1.5">
                  <h4 className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Inteligência Territorial de Alto Alegre
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    O Polo Taiano e a Vila Reislândia (Paredão) reúnem forte apelo para pautas agrícolas, pontes de madeira e postos de saúde volante. Na sede urbana (Centro, Mutirões e Felicidade), o foco prioritário deve ser iluminação LED e pavimentação.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: TABLE VIEW */}
          {activeTab === 'table' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Contatos Filtrados para Alto Alegre - RR</h3>
                  <p className="text-xs text-slate-500">Exibindo {filteredEleitores.length} contatos correspondentes aos filtros selecionados</p>
                </div>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Tabela</span>
                </button>
              </div>

              <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Eleitor</th>
                      <th className="py-2.5 px-3">Bairro / Vila</th>
                      <th className="py-2.5 px-3">Zona / Região</th>
                      <th className="py-2.5 px-3">Apoio</th>
                      <th className="py-2.5 px-3">Liderança</th>
                      <th className="py-2.5 px-3">WhatsApp</th>
                      <th className="py-2.5 px-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEleitores.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 italic text-xs">
                          Nenhum contato encontrado com os filtros atuais. Clique em "Limpar" no menu lateral.
                        </td>
                      </tr>
                    ) : (
                      filteredEleitores.map((e) => (
                        <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{e.nome}</div>
                            <div className="text-[10px] text-slate-400">{e.endereco || 'Endereço não informado'}</div>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {e.bairro}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                              {e.zona || 'Urbana'} - {e.regiao || 'Sede'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              e.apoio === 'Fiel'
                                ? 'bg-emerald-100 text-emerald-800'
                                : e.apoio === 'Simpatizante'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {e.apoio}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 font-medium">
                            {e.liderancaNome || '-'}
                          </td>
                          <td className="py-2.5 px-3">
                            <a
                              href={`https://wa.me/55${e.whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>{e.whatsapp}</span>
                            </a>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                const bMeta = BAIRROS_ALTO_ALEGRE_RR.find(b => b.nome === e.bairro);
                                if (e.latitude && e.longitude) {
                                  handleFlyTo(e.latitude, e.longitude, 16);
                                } else if (bMeta) {
                                  handleFlyTo(bMeta.lat, bMeta.lng, 15);
                                }
                              }}
                              className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                              title="Localizar no Mapa"
                            >
                              <Compass className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
