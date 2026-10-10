"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GitCompare,
  Check,
  X,
  Heart,
  Droplet,
  Info,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";

type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

const bloodData: Record<
  BloodType,
  {
    podeDoarPara: BloodType[];
    podeReceberDe: BloodType[];
    percentualPopulacao: string;
    caracteristica: string;
  }
> = {
  "O-": {
    podeDoarPara: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    podeReceberDe: ["O-"],
    percentualPopulacao: "7%",
    caracteristica: "Doador Universal de Hemácias. Vital para emergências e UTIs neonatais.",
  },
  "O+": {
    podeDoarPara: ["O+", "A+", "B+", "AB+"],
    podeReceberDe: ["O+", "O-"],
    percentualPopulacao: "36%",
    caracteristica: "O tipo mais frequente na população brasileira. Alta demanda diária.",
  },
  "A-": {
    podeDoarPara: ["A+", "A-", "AB+", "AB-"],
    podeReceberDe: ["A-", "O-"],
    percentualPopulacao: "6%",
    caracteristica: "Tipo raro e fundamental para pacientes com fator Rh negativo.",
  },
  "A+": {
    podeDoarPara: ["A+", "AB+"],
    podeReceberDe: ["A+", "A-", "O+", "O-"],
    percentualPopulacao: "34%",
    caracteristica: "Segundo tipo mais comum no Brasil. Muito utilizado em cirurgias eletivas.",
  },
  "B-": {
    podeDoarPara: ["B+", "B-", "AB+", "AB-"],
    podeReceberDe: ["B-", "O-"],
    percentualPopulacao: "2%",
    caracteristica: "Um dos tipos mais raros. Quando os estoques baixam, a busca é urgente.",
  },
  "B+": {
    podeDoarPara: ["B+", "AB+"],
    podeReceberDe: ["B+", "B-", "O+", "O-"],
    percentualPopulacao: "8%",
    caracteristica: "Compatível com B+ e AB+.",
  },
  "AB-": {
    podeDoarPara: ["AB+", "AB-"],
    podeReceberDe: ["AB-", "A-", "B-", "O-"],
    percentualPopulacao: "1%",
    caracteristica: "O tipo sanguíneo mais raro de todos no Brasil.",
  },
  "AB+": {
    podeDoarPara: ["AB+"],
    podeReceberDe: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    percentualPopulacao: "6%",
    caracteristica: "Receptor Universal de Hemácias e Doador Universal de Plasma.",
  },
};

const allTypes: BloodType[] = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

export default function CompatibilidadeSanguineaPage() {
  const [selectedType, setSelectedType] = useState<BloodType>("O-");

  // Interval Calculator State
  const [calcSexo, setCalcSexo] = useState<"masculino" | "feminino">("masculino");
  const [calcUltimaData, setCalcUltimaData] = useState("2026-08-15");

  const calcularProximaDoacao = () => {
    const data = new Date(calcUltimaData);
    const dias = calcSexo === "masculino" ? 60 : 90;
    data.setDate(data.getDate() + dias);
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-doevida-pink text-doevida-red text-xs font-bold mb-3 border border-pink-200">
          <GitCompare className="w-4 h-4" />
          Guia Interativo de Compatibilidade ABO & Fator Rh
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-black text-neutral-900">
          Compatibilidade dos Tipos Sanguíneos
        </h1>
        <p className="text-neutral-600 text-sm md:text-base mt-2 max-w-2xl mx-auto">
          Descubra para quem você pode doar e de quem você pode receber sangue. Selecione seu tipo sanguíneo abaixo:
        </p>
      </div>

      {/* Blood Type Selection Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
        {allTypes.map((type) => {
          const isSelected = selectedType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl font-serif font-black text-base sm:text-lg transition-all duration-200 flex flex-col items-center justify-center ${
                isSelected
                  ? "bg-doevida-red text-white shadow-soft-red scale-110 border-2 border-white ring-4 ring-pink-200"
                  : "bg-white hover:bg-doevida-pink text-neutral-800 border border-neutral-200 shadow-sm"
              }`}
            >
              <span>{type}</span>
              <span className={`text-[9px] font-sans ${isSelected ? "text-pink-100" : "text-neutral-400"}`}>
                {bloodData[type].percentualPopulacao}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Type Result Cards */}
      <div className="card-soft mb-12 border-2 border-doevida-pink bg-gradient-to-b from-white to-pink-50/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-pink-100 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-doevida-red text-white font-serif font-black text-2xl flex items-center justify-center shadow-md">
              {selectedType}
            </div>
            <div>
              <span className="text-xs font-bold text-doevida-red uppercase tracking-wide">
                Tipo Sanguíneo Selecionado
              </span>
              <h2 className="font-serif text-2xl font-bold text-neutral-900">
                Perfil de Doação do Tipo {selectedType}
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Representa cerca de <strong>{bloodData[selectedType].percentualPopulacao}</strong> da população brasileira.
              </p>
            </div>
          </div>

          <div className="text-xs bg-white border border-pink-200 p-3 rounded-2xl max-w-sm">
            <Info className="w-4 h-4 text-doevida-red inline mr-1" />
            {bloodData[selectedType].caracteristica}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pode Doar Para */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-doevida-red font-serif font-bold text-base">
              <Droplet className="w-5 h-5 fill-doevida-red" />
              Você pode DOAR para ({bloodData[selectedType].podeDoarPara.length} tipos):
            </div>
            <div className="flex flex-wrap gap-2.5">
              {bloodData[selectedType].podeDoarPara.map((t) => (
                <div
                  key={t}
                  className="px-4 py-2 bg-red-50 text-doevida-red border border-red-200 rounded-xl font-serif font-bold text-sm shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-green-600" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Pode Receber De */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-neutral-900 font-serif font-bold text-base">
              <Heart className="w-5 h-5 text-green-600 fill-green-600" />
              Você pode RECEBER de ({bloodData[selectedType].podeReceberDe.length} tipos):
            </div>
            <div className="flex flex-wrap gap-2.5">
              {bloodData[selectedType].podeReceberDe.map((t) => (
                <div
                  key={t}
                  className="px-4 py-2 bg-green-50 text-green-800 border border-green-200 rounded-xl font-serif font-bold text-sm shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-green-600" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Compatibility Matrix Table */}
      <div className="card-soft mb-12">
        <div className="mb-6">
          <h3 className="font-serif text-xl font-bold text-neutral-900">
            Matriz Geral de Compatibilidade de Hemácias
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Cruze o tipo doador (linhas) com o tipo receptor (colunas).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="bg-doevida-pink border-b border-pink-200">
                <th className="p-3 text-left font-serif font-bold text-neutral-900">Doador \ Receptor</th>
                {allTypes.map((t) => (
                  <th key={t} className="p-3 font-serif font-bold text-doevida-red">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {allTypes.map((doador) => (
                <tr
                  key={doador}
                  className={selectedType === doador ? "bg-red-50/50 font-bold" : "hover:bg-neutral-50"}
                >
                  <td className="p-3 text-left font-serif font-bold text-neutral-900 bg-neutral-50">
                    {doador}
                  </td>
                  {allTypes.map((receptor) => {
                    const isCompativel = bloodData[doador].podeDoarPara.includes(receptor);
                    return (
                      <td key={receptor} className="p-3">
                        {isCompativel ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-neutral-300">
                            <X className="w-3 h-3" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interval Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card-soft space-y-4">
          <div className="flex items-center gap-2 font-serif font-bold text-neutral-900 text-lg">
            <Calendar className="w-5 h-5 text-doevida-red" />
            Calculadora de Intervalo Entre Doações
          </div>
          <p className="text-xs text-neutral-600">
            O Ministério da Saúde estabelece intervalos mínimos de segurança para reposição completa do ferro no organismo.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Sexo Biológico:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCalcSexo("masculino")}
                  className={`flex-1 py-2 rounded-full text-xs font-bold transition ${
                    calcSexo === "masculino" ? "bg-doevida-red text-white" : "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  Homem (60 dias - máx 4x/ano)
                </button>
                <button
                  type="button"
                  onClick={() => setCalcSexo("feminino")}
                  className={`flex-1 py-2 rounded-full text-xs font-bold transition ${
                    calcSexo === "feminino" ? "bg-doevida-red text-white" : "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  Mulher (90 dias - máx 3x/ano)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Data da Última Doação:</label>
              <input
                type="date"
                value={calcUltimaData}
                onChange={(e) => setCalcUltimaData(e.target.value)}
                className="input-pill"
              />
            </div>

            <div className="p-4 rounded-2xl bg-green-50 border border-green-200 mt-3">
              <span className="text-xs text-green-900 block font-bold">Você estará apto para doar em:</span>
              <span className="font-serif text-2xl font-black text-green-800">{calcularProximaDoacao()}</span>
            </div>
          </div>
        </div>

        {/* Highlights: Doador e Receptor Universal */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-doevida-pink border border-pink-300 space-y-2">
            <span className="text-[11px] font-bold text-doevida-red uppercase tracking-wider">
              ⭐ Herói das Emergências
            </span>
            <h4 className="font-serif text-xl font-bold text-neutral-900">
              O- (Doador Universal)
            </h4>
            <p className="text-xs text-neutral-700 leading-relaxed">
              O sangue tipo <strong>O-</strong> não possui antígenos A, B ou fator Rh nas hemácias, podendo ser transfundido com segurança para qualquer pessoa em situação de choque hemorrágico antes do exame laboratorial.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              ⭐ Receptor Universal
            </span>
            <h4 className="font-serif text-xl font-bold text-neutral-900">
              AB+ (Receptor Universal)
            </h4>
            <p className="text-xs text-neutral-700 leading-relaxed">
              Indivíduos com tipo <strong>AB+</strong> possuem todos os antígenos e podem receber concentrado de hemácias de qualquer outro tipo sanguíneo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
