export interface Hemocentro {
  id: string;
  nome: string;
  tipo: "HEMOSC" | "Hospital" | "Posto Avançado";
  cidade: string;
  bairro: string;
  endereco: string;
  cep: string;
  telefone: string;
  whatsapp?: string;
  horarioFuncionamento: string;
  horarioSabado?: string;
  estacionamento: boolean;
  acessibilidade: boolean;
  latitude: number;
  longitude: number;
  distanciaKm: number;
  estoqueSanguineo: {
    "A+": "Adequado" | "Alerta" | "Crítico";
    "A-": "Adequado" | "Alerta" | "Crítico";
    "B+": "Adequado" | "Alerta" | "Crítico";
    "B-": "Adequado" | "Alerta" | "Crítico";
    "AB+": "Adequado" | "Alerta" | "Crítico";
    "AB-": "Adequado" | "Alerta" | "Crítico";
    "O+": "Adequado" | "Alerta" | "Crítico";
    "O-": "Adequado" | "Alerta" | "Crítico";
  };
  observacoes: string;
}

export const hemocentrosBlumenau: Hemocentro[] = [
  {
    id: "hemosc-blumenau",
    nome: "HEMOSC Blumenau - Centro de Hematologia e Hemoterapia de Santa Catarina",
    tipo: "HEMOSC",
    cidade: "Blumenau",
    bairro: "Vila Nova",
    endereco: "Rua Theodoro Holtrup, 40",
    cep: "89035-300",
    telefone: "(47) 3222-9800",
    whatsapp: "(47) 99123-4567",
    horarioFuncionamento: "Segunda a Sexta: 07h15 às 16h30",
    horarioSabado: "1º e 3º Sábado do mês: 08h00 às 11h30 (mediante agendamento)",
    estacionamento: true,
    acessibilidade: true,
    latitude: -26.9115,
    longitude: -49.0792,
    distanciaKm: 1.2,
    estoqueSanguineo: {
      "A+": "Adequado",
      "A-": "Crítico",
      "B+": "Adequado",
      "B-": "Alerta",
      "AB+": "Adequado",
      "AB-": "Alerta",
      "O+": "Alerta",
      "O-": "Crítico",
    },
    observacoes: "Principal polo de captação e fracionamento de sangue do Médio Vale do Itajaí. Atendimento por agendamento prévio ou demanda espontânea controlada.",
  },
  {
    id: "hospital-santa-isabel",
    nome: "Hospital Santa Isabel - Agência Transfusional",
    tipo: "Hospital",
    cidade: "Blumenau",
    bairro: "Centro",
    endereco: "Rua Floriano Peixoto, 300",
    cep: "89010-500",
    telefone: "(47) 3321-1000",
    horarioFuncionamento: "Segunda a Sexta: 08h00 às 17h00",
    estacionamento: true,
    acessibilidade: true,
    latitude: -26.9208,
    longitude: -49.0655,
    distanciaKm: 2.8,
    estoqueSanguineo: {
      "A+": "Adequado",
      "A-": "Alerta",
      "B+": "Adequado",
      "B-": "Alerta",
      "AB+": "Adequado",
      "AB-": "Adequado",
      "O+": "Alerta",
      "O-": "Crítico",
    },
    observacoes: "Referência em cirurgias de alta complexidade e transplantes de órgãos em Santa Catarina.",
  },
  {
    id: "hospital-santo-antonio",
    nome: "Hospital Santo Antônio - Unidade de Apoio Transfusional",
    tipo: "Hospital",
    cidade: "Blumenau",
    bairro: "Vorstadt",
    endereco: "Rua Itajaí, 545",
    cep: "89015-200",
    telefone: "(47) 3231-4000",
    horarioFuncionamento: "Segunda a Sexta: 08h00 às 16h00",
    estacionamento: true,
    acessibilidade: true,
    latitude: -26.9272,
    longitude: -49.0494,
    distanciaKm: 4.1,
    estoqueSanguineo: {
      "A+": "Alerta",
      "A-": "Crítico",
      "B+": "Adequado",
      "B-": "Crítico",
      "AB+": "Adequado",
      "AB-": "Adequado",
      "O+": "Crítico",
      "O-": "Crítico",
    },
    observacoes: "Referência Materno-Infantil e Oncológica pediátrica para todo o Vale Europeu.",
  },
  {
    id: "posto-gaspar",
    nome: "Posto de Coleta Regional - Gaspar (Convênio Hemosc)",
    tipo: "Posto Avançado",
    cidade: "Gaspar",
    bairro: "Centro",
    endereco: "Rua Coronel Aristiliano Ramos, 453",
    cep: "89110-000",
    telefone: "(47) 3332-2000",
    horarioFuncionamento: "Terças e Quintas: 08h00 às 12h00",
    estacionamento: false,
    acessibilidade: true,
    latitude: -26.9325,
    longitude: -48.9592,
    distanciaKm: 14.5,
    estoqueSanguineo: {
      "A+": "Adequado",
      "A-": "Alerta",
      "B+": "Adequado",
      "B-": "Alerta",
      "AB+": "Adequado",
      "AB-": "Adequado",
      "O+": "Alerta",
      "O-": "Crítico",
    },
    observacoes: "Coletas programadas quinzenais para moradores de Gaspar e Ilhota.",
  },
  {
    id: "posto-indaial",
    nome: "Posto de Captação Comunitária - Indaial",
    tipo: "Posto Avançado",
    cidade: "Indaial",
    bairro: "Nações",
    endereco: "Av. Brasil, 1100",
    cep: "89080-000",
    telefone: "(47) 3333-5500",
    horarioFuncionamento: "Quartas-feiras: 08h30 às 14h00",
    estacionamento: true,
    acessibilidade: true,
    latitude: -26.8988,
    longitude: -49.2319,
    distanciaKm: 18.2,
    estoqueSanguineo: {
      "A+": "Adequado",
      "A-": "Alerta",
      "B+": "Adequado",
      "B-": "Alerta",
      "AB+": "Adequado",
      "AB-": "Adequado",
      "O+": "Alerta",
      "O-": "Crítico",
    },
    observacoes: "Unidade volante de captação periódica em parceria com a Secretaria Municipal de Saúde de Indaial.",
  },
];
