"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldAlert,
  Heart,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileCheck2,
} from "lucide-react";

export default function InformacoesGuiaPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      pergunta: "Doar sangue engorda ou emagrece?",
      resposta:
        "Mito! A doação de sangue não altera o peso corporal de nenhuma forma. O volume retirado (cerca de 450ml) é reposto pelo próprio organismo em cerca de 24 horas através da ingestão de líquidos.",
    },
    {
      pergunta: "Quem tem tatuagem ou piercing pode doar sangue?",
      resposta:
        "Sim! Basta aguardar o prazo de 12 meses após a realização da tatuagem, micropigmentação ou colocação de piercing em estúdios certificados.",
    },
    {
      pergunta: "O sangue do doador afina ou engrossa?",
      resposta:
        "Mito! O sangue mantém exatamente a mesma densidade e características biológicas. O corpo produz novas células vermelhas continuamente.",
    },
    {
      pergunta: "Posso doar sangue se estiver tomando remédios?",
      resposta:
        "Depende do medicamento. Remédios comuns para dor de cabeça ou anticoncepcionais geralmente não impedem a doação. Antibióticos e anticoagulantes exigem intervalos específicos. Consulte a triagem médica.",
    },
    {
      pergunta: "Mulheres menstruadas podem doar sangue?",
      resposta:
        "Sim! A menstruação não é impedimento para a doação, desde que a doadora esteja se sentindo bem e os níveis de hemoglobina estejam normais.",
    },
    {
      pergunta: "Existe risco de contrair doenças durante a doação?",
      resposta:
        "Nenhum risco! Todo o material utilizado no HEMOSC Blumenau (agulhas, bolsas, tubos) é 100% estéril, descartável e de uso único.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-doevida-pink text-doevida-red text-xs font-bold mb-3 border border-pink-200">
          <BookOpen className="w-4 h-4" />
          Tudo o Que Você Precisa Saber Antes de Doar
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-black text-neutral-900">
          Guia do Doador de Sangue
        </h1>
        <p className="text-neutral-600 text-sm md:text-base mt-2 max-w-2xl mx-auto">
          Tire dúvidas, conheça os requisitos legais e saiba exatamente o que acontece no dia da sua doação em Blumenau.
        </p>
      </div>

      {/* Grid: 4 Etapas do Dia da Doação */}
      <div className="mb-14">
        <h2 className="font-serif text-2xl font-bold text-neutral-900 text-center mb-8">
          Como Funciona o Passo a Passo no HEMOSC Blumenau?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card-soft border-t-4 border-doevida-red text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-doevida-pink text-doevida-red font-serif font-black flex items-center justify-center mx-auto text-base">
              1
            </div>
            <h3 className="font-serif font-bold text-neutral-900 text-base">Recepção & Cadastro</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Apresentação do documento com foto e cadastro inicial no sistema integrado.
            </p>
          </div>

          <div className="card-soft border-t-4 border-doevida-red text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-doevida-pink text-doevida-red font-serif font-black flex items-center justify-center mx-auto text-base">
              2
            </div>
            <h3 className="font-serif font-bold text-neutral-900 text-base">Triagem Clínica & Teste</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Entrevista confidencial com profissional de saúde, verificação de pressão, peso e teste de anemia (gota de sangue).
            </p>
          </div>

          <div className="card-soft border-t-4 border-doevida-red text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-doevida-pink text-doevida-red font-serif font-black flex items-center justify-center mx-auto text-base">
              3
            </div>
            <h3 className="font-serif font-bold text-neutral-900 text-base">Coleta do Sangue</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Processo seguro e confortável em poltrona reclinável. Dura de 10 a 12 minutos (coleta de ~450ml).
            </p>
          </div>

          <div className="card-soft border-t-4 border-doevida-red text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-doevida-pink text-doevida-red font-serif font-black flex items-center justify-center mx-auto text-base">
              4
            </div>
            <h3 className="font-serif font-bold text-neutral-900 text-base">Lanche & Descanso</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Momento de hidratação e lanche completo oferecido pela unidade para rápida recuperação.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Requisitos Básicos vs Impedimentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
        {/* Requisitos */}
        <div className="card-soft border-2 border-green-200 space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
            <div className="p-2 rounded-full bg-green-100 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-neutral-900 text-lg">
                Requisitos Básicos Obrigatórios
              </h3>
              <span className="text-xs text-neutral-500">O que você precisa para estar apto</span>
            </div>
          </div>

          <ul className="space-y-3 text-xs md:text-sm text-neutral-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Idade:</strong> Ter entre 16 e 69 anos (menores de 18 anos com autorização dos pais).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Peso mínimo:</strong> Pesar no mínimo 50 kg.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Documento:</strong> Apresentar documento oficial com foto (RG, CNH ou Carteira Profissional).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Descanso:</strong> Ter dormido pelo menos 6 horas nas últimas 24 horas.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Alimentação:</strong> Estar bem alimentado, evitando refeições gordurosas nas 4 horas anteriores.</span>
            </li>
          </ul>
        </div>

        {/* Impedimentos */}
        <div className="card-soft border-2 border-red-200 space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
            <div className="p-2 rounded-full bg-red-100 text-doevida-red">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-neutral-900 text-lg">
                Principais Impedimentos
              </h3>
              <span className="text-xs text-neutral-500">Temporários e definitivos</span>
            </div>
          </div>

          <ul className="space-y-3 text-xs md:text-sm text-neutral-700">
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-doevida-red mt-0.5 flex-shrink-0" />
              <span><strong>Álcool:</strong> Ingestão de bebidas alcoólicas nas últimas 12 a 24h (temporário).</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-doevida-red mt-0.5 flex-shrink-0" />
              <span><strong>Tatuagem/Piercing:</strong> Aguardar 12 meses após o procedimento (temporário).</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-doevida-red mt-0.5 flex-shrink-0" />
              <span><strong>Gripe/Febre:</strong> Aguardar 14 dias após o desaparecimento total dos sintomas.</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-doevida-red mt-0.5 flex-shrink-0" />
              <span><strong>Procedimentos Dentários:</strong> De 1 a 7 dias dependendo da intervenção.</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-doevida-red mt-0.5 flex-shrink-0" />
              <span><strong>Hepatite após os 11 anos:</strong> Impedimento definitivo conforme regulamento técnico.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Mitos e Verdades Accordion */}
      <div className="card-soft mb-12">
        <div className="text-center mb-6">
          <h3 className="font-serif text-2xl font-bold text-neutral-900 flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-doevida-red" />
            Mitos & Verdades sobre Doação de Sangue
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Clique nas perguntas para desmistificar os maiores tabus sobre a doação.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-neutral-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between font-serif font-bold text-sm text-neutral-900 bg-neutral-50 hover:bg-doevida-pink/30 transition"
                >
                  <span>{faq.pergunta}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-doevida-red" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </button>
                {isOpen && (
                  <div className="p-5 bg-white text-xs md:text-sm text-neutral-700 leading-relaxed border-t border-neutral-100">
                    {faq.resposta}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="card-pink text-center space-y-4">
        <h3 className="font-serif text-2xl font-black text-neutral-900">
          Pronto para dar o primeiro passo?
        </h3>
        <p className="text-xs md:text-sm text-neutral-700 max-w-xl mx-auto">
          Faça sua pré-triagem online agora mesmo, gere seu comprovante em PDF e agende seu horário no HEMOSC Blumenau.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/triagem-elegibilidade" className="btn-primary gap-2 w-full sm:w-auto">
            <FileCheck2 className="w-4 h-4" /> Fazer Pré-Triagem Online
          </Link>
          <Link href="/agendamentos" className="btn-secondary gap-2 w-full sm:w-auto">
            Agendar Horário em Blumenau
          </Link>
        </div>
      </div>
    </div>
  );
}
