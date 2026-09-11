/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { EleitoresCRM } from './components/EleitoresCRM';
import { DemandasProtocolos } from './components/DemandasProtocolos';
import { RaioXEleitoral } from './components/RaioXEleitoral';
import { LiderancasCampanha } from './components/LiderancasCampanha';
import { CentralWhatsApp } from './components/CentralWhatsApp';
import { EmendasParlamentares } from './components/EmendasParlamentares';
import { RedatorLegislativoIA } from './components/RedatorLegislativoIA';
import { PortalPublicoEleitor } from './components/PortalPublicoEleitor';
import { ConfiguracoesGabinete } from './components/ConfiguracoesGabinete';
import { PesquisasEMetas } from './components/PesquisasEMetas';

import { NewEleitorModal } from './components/modals/NewEleitorModal';
import { NewDemandaModal } from './components/modals/NewDemandaModal';
import { DemandaDetailsModal } from './components/modals/DemandaDetailsModal';
import { EleitorDetailsModal } from './components/modals/EleitorDetailsModal';

import { 
  initialEleitores, 
  initialDemandas, 
  initialLiderancas, 
  initialEmendas, 
  initialTemplatesMensagens, 
  initialMandatoConfig,
  initialDocumentos,
  initialPesquisas
} from './data/initialData';

import { 
  NavigationTab, 
  Eleitor, 
  Demanda, 
  Lideranca, 
  EmendaParlamentar, 
  MandatoConfig, 
  StatusDemanda, 
  DocumentoOficial,
  PesquisaEleitoral
} from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Core domain states
  const [eleitores, setEleitores] = useState<Eleitor[]>(initialEleitores);
  const [demandas, setDemandas] = useState<Demanda[]>(initialDemandas);
  const [liderancas, setLiderancas] = useState<Lideranca[]>(initialLiderancas);
  const [emendas, setEmendas] = useState<EmendaParlamentar[]>(initialEmendas);
  const [templates] = useState(initialTemplatesMensagens);
  const [config, setConfig] = useState<MandatoConfig>(initialMandatoConfig);
  const [documentosSalvos, setDocumentosSalvos] = useState<DocumentoOficial[]>(initialDocumentos);
  const [pesquisas, setPesquisas] = useState<PesquisaEleitoral[]>(initialPesquisas);

  // Modals and cross-tab triggers
  const [isNewEleitorOpen, setIsNewEleitorOpen] = useState(false);
  const [isNewDemandaOpen, setIsNewDemandaOpen] = useState(false);
  const [selectedEleitorForDemanda, setSelectedEleitorForDemanda] = useState<Eleitor | null>(null);
  const [selectedDemandaForDetails, setSelectedDemandaForDetails] = useState<Demanda | null>(null);
  const [selectedEleitorForDetails, setSelectedEleitorForDetails] = useState<Eleitor | null>(null);

  // Pre-filled state for Redator IA & WhatsApp
  const [preselectedDemandaForOficio, setPreselectedDemandaForOficio] = useState<Demanda | null>(null);
  const [preselectedEleitorForWhatsApp, setPreselectedEleitorForWhatsApp] = useState<Eleitor | null>(null);
  const [preselectedWhatsAppTipo, setPreselectedWhatsAppTipo] = useState<string>('geral');

  // Count unread or pending demands
  const pendingDemandasCount = demandas.filter(d => d.status === 'Recebida' || d.status === 'Em Análise').length;

  // Birthday count for today
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const currentDay = String(new Date().getDate()).padStart(2, '0');
  const todaySuffix = `-${currentMonth}-${currentDay}`;
  const aniversariantesHojeCount = useMemo(() => {
    return eleitores.filter(e => e.dataNascimento && e.dataNascimento.endsWith(todaySuffix)).length;
  }, [eleitores, todaySuffix]);

  // Handlers for Eleitores
  const handleSaveNewEleitor = (novoEleitorData: Omit<Eleitor, 'id' | 'criadoEm'>) => {
    const newEleitor: Eleitor = {
      ...novoEleitorData,
      id: `ele-${Date.now()}`,
      dataCadastro: new Date().toISOString().slice(0, 10),
      criadoEm: new Date().toISOString().slice(0, 10),
      totalDemandas: 0,
      uf: config.uf,
    };
    setEleitores([newEleitor, ...eleitores]);

    // Update lideranca count if assigned
    if (newEleitor.liderancaId) {
      setLiderancas(prev => prev.map(l => 
        l.id === newEleitor.liderancaId ? { ...l, eleitoresCaptados: l.eleitoresCaptados + 1 } : l
      ));
    }
  };

  // Handlers for Demandas
  const handleSaveNewDemanda = (novaDemandaData: Omit<Demanda, 'id' | 'protocolo' | 'dataAbertura' | 'historico'>) => {
    const nextSeq = demandas.length + 143;
    const protocolCode = `#DEM-2026-${String(nextSeq).padStart(4, '0')}`;
    const newDemanda: Demanda = {
      ...novaDemandaData,
      id: `dem-${Date.now()}`,
      protocolo: protocolCode,
      dataAbertura: new Date().toISOString().slice(0, 10),
      dataAtualizacao: new Date().toISOString().slice(0, 10),
      eleitorWhatsapp: novaDemandaData.eleitorTelefone,
      historico: [
        {
          data: new Date().toISOString().slice(0, 10),
          descricao: 'Demanda protocolada no sistema do gabinete parlamentar.',
          assessor: novaDemandaData.assessorResponsavel || 'Gabinete Geral',
        },
      ],
    };
    setDemandas([newDemanda, ...demandas]);
  };

  const handleUpdateDemandaStatus = (demandaId: string, novoStatus: StatusDemanda, observacao?: string) => {
    setDemandas(prev => prev.map(d => {
      if (d.id === demandaId) {
        const novoHist = [...d.historico];
        if (observacao) {
          novoHist.push({
            data: new Date().toISOString().slice(0, 10),
            descricao: observacao,
            assessor: 'Assessor de Gabinete',
          });
        }
        return {
          ...d,
          status: novoStatus,
          dataConclusao: novoStatus === 'Concluída' ? new Date().toISOString().slice(0, 10) : d.dataConclusao,
          dataAtualizacao: new Date().toISOString().slice(0, 10),
          historico: novoHist,
        };
      }
      return d;
    }));

    if (selectedDemandaForDetails && selectedDemandaForDetails.id === demandaId) {
      setSelectedDemandaForDetails(prev => prev ? { ...prev, status: novoStatus } : null);
    }
  };

  const handleAddHistorico = (demandaId: string, observacao: string) => {
    const novoItem = {
      data: new Date().toISOString().slice(0, 10),
      descricao: observacao,
      assessor: 'Assessor de Gabinete',
    };
    setDemandas(prev => prev.map(d => {
      if (d.id === demandaId) {
        return {
          ...d,
          dataAtualizacao: new Date().toISOString().slice(0, 10),
          historico: [...d.historico, novoItem],
        };
      }
      return d;
    }));

    if (selectedDemandaForDetails && selectedDemandaForDetails.id === demandaId) {
      setSelectedDemandaForDetails(prev => prev ? {
        ...prev,
        historico: [...prev.historico, novoItem],
      } : null);
    }
  };

  // Citizen submission from public portal
  const handleCitizenSubmitDemanda = (formData: {
    nome: string;
    whatsapp: string;
    bairro: string;
    titulo: string;
    descricao: string;
    categoria: any;
    endereco: string;
  }): string => {
    const nextSeq = demandas.length + 150;
    const protocolCode = `#DEM-2026-${String(nextSeq).padStart(4, '0')}`;

    // Auto-create or find voter
    let eleitor = eleitores.find(e => e.whatsapp.replace(/\D/g, '') === formData.whatsapp.replace(/\D/g, ''));
    if (!eleitor) {
      eleitor = {
        id: `ele-auto-${Date.now()}`,
        nome: formData.nome,
        whatsapp: formData.whatsapp,
        bairro: formData.bairro,
        cidade: config.cidade,
        endereco: formData.endereco,
        apoio: 'Simpatizante',
        tags: ['Portal Público', formData.categoria],
        totalDemandas: 1,
        dataCadastro: new Date().toISOString().slice(0, 10),
      };
      setEleitores(prev => [eleitor!, ...prev]);
    }

    const novaDemanda: Demanda = {
      id: `dem-${Date.now()}`,
      protocolo: protocolCode,
      eleitorId: eleitor.id,
      eleitorNome: formData.nome,
      eleitorTelefone: formData.whatsapp,
      eleitorWhatsapp: formData.whatsapp,
      bairro: formData.bairro,
      titulo: formData.titulo,
      descricao: formData.descricao,
      categoria: formData.categoria,
      status: 'Recebida',
      prioridade: 'Normal',
      orgaoDestino: 'Secretaria Responsável (Triagem)',
      dataAbertura: new Date().toISOString().slice(0, 10),
      historico: [
        {
          data: new Date().toISOString().slice(0, 10),
          descricao: 'Protocolo digital recebido através do Portal Público do Cidadão.',
          assessor: 'Triagem Automática',
        },
      ],
    };

    setDemandas(prev => [novaDemanda, ...prev]);
    return protocolCode;
  };

  // Actions connecting tabs
  const handleOpenOficioForDemanda = (demanda: Demanda) => {
    setPreselectedDemandaForOficio(demanda);
    setCurrentTab('redator-ia');
  };

  const handleSendWhatsAppToEleitor = (eleitor: Eleitor, templateTipo: 'aniversario' | 'demanda' | 'geral' = 'geral') => {
    setPreselectedEleitorForWhatsApp(eleitor);
    setPreselectedWhatsAppTipo(templateTipo);
    setCurrentTab('whatsapp');
  };

  const handleSendWhatsAppForDemanda = (demanda: Demanda) => {
    const voter = eleitores.find(e => e.id === demanda.eleitorId) || {
      id: demanda.eleitorId,
      nome: demanda.eleitorNome,
      whatsapp: demanda.eleitorWhatsapp || demanda.eleitorTelefone || '19987654321',
      bairro: demanda.bairro,
      cidade: config.cidade,
      apoio: 'Simpatizante' as any,
      tags: [],
      dataCadastro: demanda.dataAbertura,
    };
    setPreselectedEleitorForWhatsApp(voter);
    setPreselectedWhatsAppTipo('demanda');
    setCurrentTab('whatsapp');
  };

  const handleBroadcastEmenda = (emenda: EmendaParlamentar) => {
    const neighborhoodVoter = eleitores.find(e => e.bairro === emenda.bairro) || eleitores[0];
    if (neighborhoodVoter) {
      setPreselectedEleitorForWhatsApp(neighborhoodVoter);
    }
    setPreselectedWhatsAppTipo('geral');
    setCurrentTab('whatsapp');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
      {/* Top Application Header */}
      <Header 
        currentTab={currentTab}
        onOpenNewEleitor={() => setIsNewEleitorOpen(true)}
        onOpenNewDemanda={() => {
          setSelectedEleitorForDemanda(null);
          setIsNewDemandaOpen(true);
        }}
        onOpenConfig={() => setCurrentTab('configuracoes')}
        onOpenWhatsAppAniversariantes={() => {
          setPreselectedWhatsAppTipo('aniversario');
          setCurrentTab('whatsapp');
        }}
        aniversariantesHojeCount={aniversariantesHojeCount}
        config={config}
        setIsMobileOpen={setIsMobileOpen}
        eleitores={eleitores}
        onSelectEleitor={(eleitor) => setSelectedEleitorForDetails(eleitor)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={(tab) => setCurrentTab(tab as NavigationTab)}
          config={config}
          totalEleitores={eleitores.length}
          totalDemandas={demandas.length}
          aniversariantesHojeCount={aniversariantesHojeCount}
          onOpenConfig={() => setCurrentTab('configuracoes')}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Dynamic Main Workspace Container */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full lg:ml-72">
          {currentTab === 'dashboard' && (
            <Dashboard 
              eleitores={eleitores}
              demandas={demandas}
              liderancas={liderancas}
              emendas={emendas}
              config={config}
              onNavigateTab={(tab) => setCurrentTab(tab as NavigationTab)}
              onOpenNewEleitor={() => setIsNewEleitorOpen(true)}
              onOpenNewDemanda={() => {
                setSelectedEleitorForDemanda(null);
                setIsNewDemandaOpen(true);
              }}
              onSelectDemanda={(demanda) => setSelectedDemandaForDetails(demanda)}
              onSelectEleitor={(eleitor) => setSelectedEleitorForDetails(eleitor)}
              onSendWhatsApp={(eleitor, tipo) => handleSendWhatsAppToEleitor(eleitor, tipo)}
            />
          )}

          {currentTab === 'pesquisas' && (
            <PesquisasEMetas
              pesquisas={pesquisas}
              config={config}
              onUpdatePesquisa={(updatedPesq) => {
                setPesquisas(prev => prev.map(p => p.id === updatedPesq.id ? updatedPesq : p));
              }}
              onUpdateMetasGabinete={(novaMetaTotal) => {
                setConfig(prev => ({ ...prev, metaTotalVotos: novaMetaTotal }));
              }}
            />
          )}

          {currentTab === 'eleitores' && (
            <EleitoresCRM
              eleitores={eleitores}
              demandas={demandas}
              config={config}
              onOpenNewEleitor={() => setIsNewEleitorOpen(true)}
              onOpenNewDemandaForEleitor={(eleitor) => {
                setSelectedEleitorForDemanda(eleitor);
                setIsNewDemandaOpen(true);
              }}
              onSendWhatsApp={(eleitor, tipo) => handleSendWhatsAppToEleitor(eleitor, tipo)}
              onSelectEleitor={(eleitor) => setSelectedEleitorForDetails(eleitor)}
            />
          )}

          {currentTab === 'demandas' && (
            <DemandasProtocolos
              demandas={demandas}
              config={config}
              onOpenNewDemanda={() => {
                setSelectedEleitorForDemanda(null);
                setIsNewDemandaOpen(true);
              }}
              onSelectDemanda={(demanda) => setSelectedDemandaForDetails(demanda)}
              onGenerateOficio={handleOpenOficioForDemanda}
              onSendStatusWhatsApp={handleSendWhatsAppForDemanda}
              onUpdateDemandaStatus={handleUpdateDemandaStatus}
            />
          )}

          {currentTab === 'raiox' && (
            <RaioXEleitoral
              eleitores={eleitores}
              demandas={demandas}
              liderancas={liderancas}
              config={config}
              onNavigateToCRMWithBairro={(bairro) => {
                setCurrentTab('eleitores');
              }}
              onOpenEleitorDetails={(eleitorId) => {
                const found = eleitores.find(e => e.id === eleitorId);
                if (found) setSelectedEleitorForDetails(found);
              }}
            />
          )}

          {currentTab === 'liderancas' && (
            <LiderancasCampanha
              liderancas={liderancas}
              eleitores={eleitores}
              config={config}
              onAddLideranca={(newLead) => {
                const created: Lideranca = {
                  ...newLead,
                  id: `lid-${Date.now()}`,
                };
                setLiderancas([...liderancas, created]);
              }}
            />
          )}

          {currentTab === 'whatsapp' && (
            <CentralWhatsApp
              eleitores={eleitores}
              demandas={demandas}
              templates={templates}
              config={config}
              preselectedEleitor={preselectedEleitorForWhatsApp}
              preselectedTipo={preselectedWhatsAppTipo}
            />
          )}

          {currentTab === 'emendas' && (
            <EmendasParlamentares
              emendas={emendas}
              eleitores={eleitores}
              config={config}
              onAddEmenda={(newEmenda) => {
                const created: EmendaParlamentar = {
                  ...newEmenda,
                  id: `em-${Date.now()}`,
                };
                setEmendas([created, ...emendas]);
              }}
              onBroadcastEmenda={handleBroadcastEmenda}
            />
          )}

          {currentTab === 'redator-ia' && (
            <RedatorLegislativoIA
              config={config}
              demandas={demandas}
              documentosSalvos={documentosSalvos}
              onSaveDocumento={(doc) => setDocumentosSalvos([doc, ...documentosSalvos])}
              preselectedDemanda={preselectedDemandaForOficio}
            />
          )}

          {currentTab === 'portal-publico' && (
            <PortalPublicoEleitor
              config={config}
              demandas={demandas}
              onCitizenSubmitDemanda={handleCitizenSubmitDemanda}
            />
          )}

          {currentTab === 'configuracoes' && (
            <ConfiguracoesGabinete
              config={config}
              onUpdateConfig={(newConf) => setConfig(newConf)}
            />
          )}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <NewEleitorModal
        isOpen={isNewEleitorOpen}
        onClose={() => setIsNewEleitorOpen(false)}
        onSave={handleSaveNewEleitor}
        liderancas={liderancas}
      />

      <NewDemandaModal
        isOpen={isNewDemandaOpen}
        onClose={() => {
          setIsNewDemandaOpen(false);
          setSelectedEleitorForDemanda(null);
        }}
        onSave={handleSaveNewDemanda}
        eleitores={eleitores}
        preselectedEleitor={selectedEleitorForDemanda}
      />

      <DemandaDetailsModal
        isOpen={!!selectedDemandaForDetails}
        onClose={() => setSelectedDemandaForDetails(null)}
        demanda={selectedDemandaForDetails}
        onUpdateStatus={handleUpdateDemandaStatus}
        onAddHistorico={handleAddHistorico}
        onGenerateOficio={handleOpenOficioForDemanda}
        onSendWhatsApp={handleSendWhatsAppForDemanda}
      />

      <EleitorDetailsModal
        isOpen={!!selectedEleitorForDetails}
        onClose={() => setSelectedEleitorForDetails(null)}
        eleitor={selectedEleitorForDetails}
        demandas={demandas}
        onOpenNewDemanda={(eleitor) => {
          setSelectedEleitorForDemanda(eleitor);
          setIsNewDemandaOpen(true);
        }}
        onSendWhatsApp={(eleitor) => handleSendWhatsAppToEleitor(eleitor, 'geral')}
      />
    </div>
  );
}
