export interface Campanha {
  id: string;
  titulo: string;
  descricao: string;
  local: string;
  bairro: string;
  cidade: string;
  dataInicio: string;
  dataFim: string;
  horario: string;
  metaBolsas: number;
  bolsasArrecadadas: number;
  urgencia: "Normal" | "Alta" | "Urgência Máxima";
  tiposNecessarios: string[];
  publicoAlvo: string;
  whatsappLink: string;
  imagemUrl?: string;
  organizador: string;
}

export const campanhasBlumenau: Campanha[] = [
  {
    id: "campanha-furb-solidaria",
    titulo: "FURB Solidária: Sangue Universitário Salva Vidas",
    descricao: "Mobilização da comunidade acadêmica, professores e moradores do bairro Victor Konder para abastecimento do banco de sangue antes do período de férias.",
    local: "Campus 1 FURB - Ginásio Poliesportivo",
    bairro: "Victor Konder",
    cidade: "Blumenau - SC",
    dataInicio: "2026-10-15",
    dataFim: "2026-10-17",
    horario: "08h00 às 17h00",
    metaBolsas: 250,
    bolsasArrecadadas: 184,
    urgencia: "Alta",
    tiposNecessarios: ["O-", "O+", "A-", "B-"],
    publicoAlvo: "Estudantes, professores e comunidade em geral",
    whatsappLink: "https://wa.me/?text=Participe%20da%20Campanha%20FURB%20Solidaria%20de%20Doacao%20de%20Sangue!%20DOE%2BVIDA",
    organizador: "Diretório Central dos Estudantes (DCE) & HEMOSC",
  },
  {
    id: "campanha-vila-germanica",
    titulo: "Oktober Solidária: Doe Sangue no Parque Vila Germânica",
    descricao: "Posto móvel especial de coleta com estrutura climatizada e lanche típico aos doadores participantes.",
    local: "Parque Vila Germânica - Setor 3",
    bairro: "Velha",
    cidade: "Blumenau - SC",
    dataInicio: "2026-10-20",
    dataFim: "2026-10-22",
    horario: "09h00 às 18h00",
    metaBolsas: 400,
    bolsasArrecadadas: 312,
    urgencia: "Alta",
    tiposNecessarios: ["TODOS OS TIPOS", "Destaque para O- e A-"],
    publicoAlvo: "Público geral de Blumenau e turistas",
    whatsappLink: "https://wa.me/?text=Participe%20da%20Oktober%20Solidaria%20na%20Vila%20Germanica!%20DOE%2BVIDA",
    organizador: "Prefeitura Municipal de Blumenau & HEMOSC",
  },
  {
    id: "campanha-emergencia-hemosc",
    titulo: "SOS Tipos O- e A-: Emergência Hospital Santa Isabel",
    descricao: "Convocação de emergência para reposição imediata de concentrado de hemácias para atendimento de politraumatizados e cirurgias cardíacas.",
    local: "HEMOSC Blumenau (Rua Theodoro Holtrup, 40)",
    bairro: "Vila Nova",
    cidade: "Blumenau - SC",
    dataInicio: "2026-10-10",
    dataFim: "2026-10-14",
    horario: "07h15 às 16h30",
    metaBolsas: 150,
    bolsasArrecadadas: 62,
    urgencia: "Urgência Máxima",
    tiposNecessarios: ["O-", "A-", "B-"],
    publicoAlvo: "Doadores de tipo negativo prioritariamente",
    whatsappLink: "https://wa.me/?text=URGENTE:%20Precisamos%20de%20sangue%20tipo%20O-%20e%20A-%20no%20HEMOSC%20Blumenau!%20DOE%2BVIDA",
    organizador: "HEMOSC Blumenau & Hospital Santa Isabel",
  },
  {
    id: "campanha-shopping-neumarkt",
    titulo: "Vida no Centro: Doação Itinerante Neumarkt Shopping",
    descricao: "Facilidade de acesso para quem trabalha ou transita pelo Centro de Blumenau. Estacionamento gratuito para doadores durante o período da coleta.",
    local: "Neumarkt Shopping - Espaço Cultural Piso L2",
    bairro: "Centro",
    cidade: "Blumenau - SC",
    dataInicio: "2026-10-25",
    dataFim: "2026-10-26",
    horario: "10h00 às 19h00",
    metaBolsas: 200,
    bolsasArrecadadas: 45,
    urgencia: "Normal",
    tiposNecessarios: ["Todos os tipos"],
    publicoAlvo: "Trabalhadores do comércio e visitantes do shopping",
    whatsappLink: "https://wa.me/?text=Doe%20sangue%20com%20estacionamento%20gratis%20no%20Neumarkt%20Shopping!%20DOE%2BVIDA",
    organizador: "CDL Blumenau & HEMOSC",
  },
];
