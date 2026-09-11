export type CargoPolitico = 
  | 'Vereador' 
  | 'Deputada Estadual' 
  | 'Deputado Estadual' 
  | 'Deputado Federal' 
  | 'Senador' 
  | 'Prefeito' 
  | 'Liderança Política';

export type ApoioPolitico = 'Fiel' | 'Simpatizante' | 'Indeciso' | 'Oposição';

export type StatusDemanda = 
  | 'Recebida' 
  | 'Em Análise' 
  | 'Ofício Encaminhado' 
  | 'Em Execução' 
  | 'Concluída' 
  | 'Indeferida';

export type PrioridadeDemanda = 'Baixa' | 'Normal' | 'Alta' | 'Urgente';

export type CategoriaDemanda = 
  | 'Saúde' 
  | 'Infraestrutura & Asfalto' 
  | 'Iluminação Pública' 
  | 'Educação & Creches' 
  | 'Segurança Pública' 
  | 'Meio Ambiente & Limpeza' 
  | 'Transporte & Trânsito' 
  | 'Assistência Social' 
  | 'Esporte & Lazer' 
  | 'Outros';

export type EstagioRelacionamento = 'falta_trabalhar' | 'relacionamento' | 'conquistado' | 'perdido';

export type NavigationTab = 
  | 'dashboard' 
  | 'pesquisas'
  | 'eleitores' 
  | 'demandas' 
  | 'raiox' 
  | 'liderancas' 
  | 'whatsapp' 
  | 'emendas' 
  | 'redator-ia' 
  | 'portal-publico' 
  | 'configuracoes';

export interface CandidatoPesquisa {
  nome: string;
  partido: string;
  intencaoEstimulada: number;
  intencaoEspontanea: number;
  rejeicao: number;
  isMandatoAtual?: boolean;
}

export interface BairroPesquisa {
  bairro: string;
  eleitoresAptos: number;
  intencaoKauan: number; // %
  principalDemanda: string;
  metaVotosSugerida: number;
  metaAtualDefinida: number;
}

export interface PesquisaEleitoral {
  id: string;
  titulo: string;
  instituto: string;
  dataRealizacao: string;
  amostra: number;
  margemErro: number;
  nivelConfianca: number;
  tipo: 'Estimulada/Espontânea' | 'Tracking Interno' | 'Qualitativa de Bairros';
  candidatos: CandidatoPesquisa[];
  bairros: BairroPesquisa[];
  indecisos: number;
  brancosNulos: number;
  quocienteEstimado: number;
  vagasCamara: number;
  analiseEstrategica?: string;
  recomendacoesTaticas?: string[];
}

export interface Eleitor {
  id: string;
  nome: string;
  whatsapp: string;
  email?: string;
  cpf?: string;
  dataNascimento?: string; // YYYY-MM-DD
  sexo?: 'Feminino' | 'Masculino' | 'Outro';
  bairro: string;
  cidade: string;
  uf?: string;
  endereco?: string;
  cep?: string;
  regiao?: string; // Sede Urbana, Região do Taiano, Região do Paredão, Região São Silvestre, etc.
  zona?: 'Urbana' | 'Rural';
  latitude?: number;
  longitude?: number;
  zonaEleitoral?: string;
  secaoEleitoral?: string;
  tituloEleitor?: string;
  liderancaId?: string;
  liderancaNome?: string;
  apoio: ApoioPolitico;
  estagio?: EstagioRelacionamento;
  tags: string[];
  categoria2?: string; // Prioridade Alta, Normal, Baixa
  categoria3?: string; // Visita Domiciliar, WhatsApp, Reunião
  totalDemandas?: number;
  observacoes?: string;
  dataCadastro?: string;
  criadoEm?: string;
}

export interface Demanda {
  id: string;
  protocolo: string; // Ex: #DEM-2026-0042
  titulo: string;
  descricao: string;
  categoria: CategoriaDemanda;
  status: StatusDemanda;
  prioridade: PrioridadeDemanda;
  eleitorId: string;
  eleitorNome: string;
  eleitorWhatsapp?: string;
  eleitorTelefone?: string;
  bairro: string;
  logradouro?: string;
  orgaoDestino: string; // Ex: Secretaria de Obras
  numeroOficio?: string;
  assessorResponsavel?: string;
  dataAbertura: string;
  dataAtualizacao?: string;
  dataPrevisao?: string;
  dataConclusao?: string;
  historico: {
    data: string;
    assessor: string;
    descricao: string;
    statusAnterior?: StatusDemanda;
    statusNovo?: StatusDemanda;
  }[];
}

export interface Lideranca {
  id: string;
  nome: string;
  whatsapp: string;
  bairroPrincipal: string;
  metaVotos: number;
  eleitoresCaptados: number;
  grauInfluencia: 'Alto' | 'Médio' | 'Muito Alto';
  observacao?: string;
}

export interface EmendaParlamentar {
  id: string;
  ano: number;
  numero: string;
  objeto: string;
  beneficiario: string;
  bairro: string;
  valorPrevisto: number;
  valorLiquidado: number;
  statusExecucao: 'Planejamento' | 'Empenhado' | 'Em Execução' | 'Entregue';
}

export interface MandatoConfig {
  nomeParlamentar: string;
  cargo: CargoPolitico;
  partido: string;
  numeroPartido?: string;
  cidade: string;
  uf: string;
  slogan: string;
  telefoneGabinete: string;
  emailGabinete: string;
  enderecoGabinete: string;
  nomeChefeGabinete: string;
  anoEleicao?: string;
  metaTotalVotos?: number;
  assessores?: string[];
}

export interface TemplateMensagem {
  id: string;
  titulo: string;
  categoria: 'Aniversário' | 'Demanda' | 'Convocação' | 'Prestação de Contas' | 'Feriado';
  conteudo: string;
}

export interface DocumentoOficial {
  id: string;
  tipo: 'Ofício' | 'Indicação Legislativa' | 'Requerimento' | 'Projeto de Lei' | 'Discurso';
  numero: string;
  ano: number;
  assunto: string;
  destinatario: string;
  conteudo: string;
  dataGeracao: string;
  protocoloDemanda?: string;
}
