"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Droplet,
  Calendar,
  FileCheck2,
  MapPin,
  Megaphone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  Activity,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { hemocentrosBlumenau } from "@/data/hemocentros";
import { campanhasBlumenau } from "@/data/campanhas";

export default function HomePage() {
  const hemoscCentral = hemocentrosBlumenau[0];
  const [selectedBlood, setSelectedBlood] = useState("O-");

  const compatibilityMap: Record<string, { doar: string[]; receber: string[] }> = {
    "O-": { doar: ["Todos os tipos (Universal)"], receber: ["O-"] },
    "O+": { doar: ["O+", "A+", "B+", "AB+"], receber: ["O+", "O-"] },
    "A-": { doar: ["A+", "A-", "AB+", "AB-"], receber: ["A-", "O-"] },
    "A+": { doar: ["A+", "AB+"], receber: ["A+", "A-", "O+", "O-"] },
    "B-": { doar: ["B+", "B-", "AB+", "AB-"], receber: ["B-", "O-"] },
    "B+": { doar: ["B+", "AB+"], receber: ["B+", "B-", "O+", "O-"] },
    "AB-": { doar: ["AB+", "AB-"], receber: ["AB-", "A-", "B-", "O-"] },
    "AB+": { doar: ["AB+"], receber: ["Todos os tipos (Universal)"] },
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFE7F6] via-[#FFF5FA] to-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-pink-100">
        {/* Background Decorative Rings */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-pink-200/50 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-red-100/40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 shadow-sm border border-pink-200 text-doevida-red text-xs font-bold mb-6 animate-pulse-subtle">
            <span className="w-2 h-2 rounded-full bg-doevida-red animate-ping" />
            <span>HEMOSC Blumenau: Estoque de Sangue O- e A- em Alerta Crítico</span>
          </div>

          {/* Centered Big Logo */}
          <div className="mb-6">
            <Logo size="xl" showText={true} />
          </div>

          {/* Main Titles */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight max-w-4xl leading-tight sm:leading-none">
            Um simples gesto,{" "}
            <span className="text-doevida-red underline decoration-pink-300 decoration-wavy">
              infinitos batimentos
            </span>
            .
          </h1>

          <p className="font-sans text-neutral-600 text-base sm:text-lg max-w-2xl mt-4 leading-relaxed">
            Conectamos doadores aos hospitais e hemocentros de Blumenau. Faça sua pré-triagem online, gere seu comprovante em PDF e agende sua doação em menos de 2 minutos.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full justify-center max-w-md sm:max-w-none">
            <Link
              href="/agendamentos"
              className="w-full sm:w-auto px-8 py-4 bg-doevida-red hover:bg-doevida-redHover text-white font-serif font-bold text-sm sm:text-base rounded-full shadow-lg hover:shadow-soft-red transition-all duration-200 flex items-center justify-center gap-2 group active:scale-95"
            >
              <Calendar className="w-5 h-5" />
              <span>Quero Doar Agora</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/triagem-elegibilidade"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-doevida-pink border-2 border-doevida-red text-doevida-red font-serif font-bold text-sm sm:text-base rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <FileCheck2 className="w-5 h-5" />
              <span>Fazer Pré-Triagem & Gerar PDF</span>
            </Link>
          </div>

          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-14 pt-8 border-t border-pink-200/80 w-full max-w-4xl">
            <div className="space-y-1">
              <div className="font-serif font-black text-2xl sm:text-3xl text-doevida-red">1 Bolsa</div>
              <div className="text-xs text-neutral-600 font-medium">Salva até 4 vidas</div>
            </div>
            <div className="space-y-1">
              <div className="font-serif font-black text-2xl sm:text-3xl text-neutral-900">12 Minutos</div>
              <div className="text-xs text-neutral-600 font-medium">Tempo médio de coleta</div>
            </div>
            <div className="space-y-1">
              <div className="font-serif font-black text-2xl sm:text-3xl text-doevida-red">100%</div>
              <div className="text-xs text-neutral-600 font-medium">Material estéril & seguro</div>
            </div>
            <div className="space-y-1">
              <div className="font-serif font-black text-2xl sm:text-3xl text-neutral-900">450 ml</div>
              <div className="text-xs text-neutral-600 font-medium">Reposto pelo corpo em 24h</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ESTOQUE DE SANGUE EM TEMPO REAL (BLUMENAU) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-soft border-2 border-pink-200 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-pink-100">
            <div>
              <div className="flex items-center gap-2 text-doevida-red text-xs font-bold uppercase tracking-wider mb-1">
                <Activity className="w-4 h-4 animate-pulse" />
                Painel do Doador Blumenau
              </div>
              <h2 className="font-serif text-2xl font-bold text-neutral-900">
                Termômetro de Estoque Sanguíneo - HEMOSC Blumenau
              </h2>
            </div>
            <Link
              href="/hemocentros"
              className="text-xs font-bold text-doevida-red hover:underline flex items-center gap-1"
            >
              Ver todas as unidades em SC <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {Object.entries(hemoscCentral.estoqueSanguineo).map(([tipo, status]) => (
              <div
                key={tipo}
                className={`p-3 rounded-2xl border text-center transition ${
                  status === "Crítico"
                    ? "bg-red-50 border-red-300 ring-2 ring-red-400/30"
                    : status === "Alerta"
                    ? "bg-amber-50 border-amber-300"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="font-serif font-black text-xl text-neutral-900 mb-1">{tipo}</div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                    status === "Crítico"
                      ? "bg-red-600 text-white animate-pulse"
                      : status === "Alerta"
                      ? "bg-amber-500 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SIMULADOR RÁPIDO DE COMPATIBILIDADE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-pink">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
              Descubra Sua Compatibilidade Sanguínea
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Selecione o seu tipo para saber quem você pode salvar hoje:
            </p>
          </div>

          {/* Blood Selector Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.keys(compatibilityMap).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedBlood(type)}
                className={`w-12 h-12 rounded-2xl font-serif font-black text-sm transition-all ${
                  selectedBlood === type
                    ? "bg-doevida-red text-white shadow-soft-red scale-110"
                    : "bg-white text-neutral-800 hover:bg-pink-100 border border-pink-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Result Highlight Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto bg-white p-6 rounded-3xl border border-pink-200 shadow-sm">
            <div className="space-y-2">
              <div className="text-xs font-bold text-doevida-red flex items-center gap-1.5">
                <Droplet className="w-4 h-4 fill-doevida-red" />
                Como doador ({selectedBlood}), você salva:
              </div>
              <div className="text-sm font-bold text-neutral-900">
                {compatibilityMap[selectedBlood].doar.join(", ")}
              </div>
            </div>

            <div className="space-y-2 border-t md:border-t-0 md:border-l border-neutral-100 pt-3 md:pt-0 md:pl-6">
              <div className="text-xs font-bold text-green-700 flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-green-600" />
                Como receptor ({selectedBlood}), você pode receber de:
              </div>
              <div className="text-sm font-bold text-neutral-900">
                {compatibilityMap[selectedBlood].receber.join(", ")}
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/compatibilidade-sanguinea"
              className="text-xs font-bold text-doevida-red hover:underline inline-flex items-center gap-1"
            >
              Ver Matriz Completa & Calculadora de Intervalo →
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CAMPANHAS EM DESTAQUE EM BLUMENAU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-doevida-red text-xs font-bold uppercase tracking-wider mb-1">
              <Megaphone className="w-4 h-4" />
              Mobilizações Locais
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
              Campanhas Ativas em Blumenau
            </h2>
          </div>
          <Link
            href="/campanhas"
            className="btn-secondary text-xs px-5 py-2.5"
          >
            Ver Todas as Campanhas
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campanhasBlumenau.slice(0, 2).map((campanha) => (
            <div
              key={campanha.id}
              className="card-soft border border-neutral-200 hover:border-doevida-red/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-doevida-red">
                    {campanha.urgencia}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    {campanha.bairro}, {campanha.cidade}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-neutral-900 mb-2">
                  {campanha.titulo}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                  {campanha.descricao}
                </p>
                <div className="text-xs text-neutral-700 space-y-1 mb-4">
                  <p>📍 <strong>Local:</strong> {campanha.local}</p>
                  <p>📅 <strong>Data:</strong> {campanha.dataInicio} até {campanha.dataFim}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs text-doevida-red font-bold">
                  {campanha.bolsasArrecadadas} / {campanha.metaBolsas} Bolsas Arrecadadas
                </span>
                <Link
                  href="/campanhas"
                  className="text-xs font-bold text-neutral-900 hover:text-doevida-red underline"
                >
                  Participar →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PASSO A PASSO SIMPLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-soft border border-neutral-100 bg-gradient-to-r from-white via-pink-50/20 to-white">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
              Como Funciona a Doação pelo DOE + VIDA?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Criamos uma jornada sem burocracia para valorizar o seu tempo e salvar vidas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-doevida-pink text-doevida-red font-serif font-bold text-lg flex items-center justify-center mx-auto shadow-sm">
                1
              </div>
              <h3 className="font-serif font-bold text-base text-neutral-900">Pré-Triagem Online</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Responda ao questionário médico no site e faça o download automático do seu comprovante com QR Code em PDF.
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-doevida-pink text-doevida-red font-serif font-bold text-lg flex items-center justify-center mx-auto shadow-sm">
                2
              </div>
              <h3 className="font-serif font-bold text-base text-neutral-900">Agendamento de Horário</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Selecione o HEMOSC Blumenau ou o posto de coleta mais próximo e reserve o melhor horário do seu dia.
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-doevida-pink text-doevida-red font-serif font-bold text-lg flex items-center justify-center mx-auto shadow-sm">
                3
              </div>
              <h3 className="font-serif font-bold text-base text-neutral-900">Coleta & Lanche</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Apresente seu documento e o PDF no local. A doação dura poucos minutos e você recebe um lanche especial ao final.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
