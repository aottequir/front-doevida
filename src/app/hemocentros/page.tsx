"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Search,
  Filter,
  Car,
  Accessibility,
  ExternalLink,
} from "lucide-react";
import { hemocentrosBlumenau, Hemocentro } from "@/data/hemocentros";
import { useNotifications } from "@/context/NotificationContext";

export default function HemocentrosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("todos");
  const [selectedHemocentro, setSelectedHemocentro] = useState<Hemocentro | null>(
    hemocentrosBlumenau[0]
  );
  const { showToast } = useNotifications();

  const filteredHemocentros = hemocentrosBlumenau.filter((h) => {
    const matchesSearch =
      h.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.cidade.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo = filterTipo === "todos" || h.tipo === filterTipo;
    return matchesSearch && matchesTipo;
  });

  const getStatusColor = (status: "Adequado" | "Alerta" | "Crítico") => {
    switch (status) {
      case "Crítico":
        return "bg-red-100 text-red-700 border-red-200 font-bold";
      case "Alerta":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Adequado":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-neutral-100 text-neutral-600";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-doevida-pink text-doevida-red text-xs font-bold mb-3 border border-pink-200">
          <MapPin className="w-4 h-4" />
          Rede de Atendimento em Blumenau & Médio Vale do Itajaí
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-black text-neutral-900">
          Hemocentros e Postos de Coleta
        </h1>
        <p className="text-neutral-600 text-sm md:text-base mt-2 max-w-2xl mx-auto">
          Encontre a unidade mais próxima de você em Blumenau, consulte os estoques em tempo real e trace sua rota até o local de doação.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card-soft p-4 sm:p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por bairro, cidade ou nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-full text-xs sm:text-sm focus:outline-none focus:border-doevida-red focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-neutral-500 flex-shrink-0" />
          <button
            onClick={() => setFilterTipo("todos")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
              filterTipo === "todos"
                ? "bg-doevida-red text-white shadow-sm"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            Todos ({hemocentrosBlumenau.length})
          </button>
          <button
            onClick={() => setFilterTipo("HEMOSC")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
              filterTipo === "HEMOSC"
                ? "bg-doevida-red text-white shadow-sm"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            HEMOSC Central
          </button>
          <button
            onClick={() => setFilterTipo("Hospital")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
              filterTipo === "Hospital"
                ? "bg-doevida-red text-white shadow-sm"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            Hospitais
          </button>
          <button
            onClick={() => setFilterTipo("Posto Avançado")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
              filterTipo === "Posto Avançado"
                ? "bg-doevida-red text-white shadow-sm"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            Postos Regionais
          </button>
        </div>
      </div>

      {/* Grid: List + Detail / Map Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Col 1 & 2: Hemocentros Cards */}
        <div className="lg:col-span-2 space-y-6">
          {filteredHemocentros.map((item) => {
            const isSelected = selectedHemocentro?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedHemocentro(item)}
                className={`card-soft transition-all cursor-pointer border-2 hover:border-doevida-red/50 ${
                  isSelected ? "border-doevida-red shadow-soft-red bg-pink-50/20" : "border-neutral-100"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-doevida-pink text-doevida-red border border-pink-200">
                        {item.tipo}
                      </span>
                      <span className="text-xs font-semibold text-neutral-500">
                        {item.bairro}, {item.cidade}
                      </span>
                      <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-full">
                        ~{item.distanciaKm} km
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-neutral-900">
                      {item.nome}
                    </h3>
                  </div>

                  <Link
                    href={`/agendamentos?unidade=${encodeURIComponent(item.nome)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center px-4 py-2 bg-doevida-red hover:bg-doevida-redHover text-white text-xs font-serif font-bold rounded-full shadow-sm transition whitespace-nowrap"
                  >
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    Agendar Aqui
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs text-neutral-600 pt-3 border-t border-neutral-100">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-doevida-red mt-0.5 flex-shrink-0" />
                    <span>{item.endereco} - CEP {item.cep}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-doevida-red flex-shrink-0" />
                    <span>{item.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-doevida-red flex-shrink-0" />
                    <span>{item.horarioFuncionamento}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.estacionamento && (
                      <span className="flex items-center gap-1 text-green-700 font-medium">
                        <Car className="w-3.5 h-3.5" /> Estacionamento
                      </span>
                    )}
                    {item.acessibilidade && (
                      <span className="flex items-center gap-1 text-blue-700 font-medium">
                        <Accessibility className="w-3.5 h-3.5" /> Acessível
                      </span>
                    )}
                  </div>
                </div>

                {/* Estoque Sanguíneo Pills */}
                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <div className="text-[11px] font-bold text-neutral-700 mb-2 uppercase tracking-wider">
                    Nível de Estoque por Tipo Sanguíneo:
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {Object.entries(item.estoqueSanguineo).map(([tipo, status]) => (
                      <div
                        key={tipo}
                        className={`text-center py-1.5 px-1 rounded-xl border text-[11px] font-sans ${getStatusColor(
                          status
                        )}`}
                        title={`${tipo}: ${status}`}
                      >
                        <div className="font-black text-xs">{tipo}</div>
                        <div className="text-[9px] truncate">{status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Col 3: Selected Unit Detail & Interactive Map Route */}
        {selectedHemocentro && (
          <div className="space-y-6">
            <div className="card-soft border-2 border-doevida-pink sticky top-28 space-y-5">
              <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                <h3 className="font-serif font-bold text-neutral-900 text-base">
                  Detalhes da Unidade
                </h3>
                <span className="text-xs bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full font-semibold">
                  Aberto Hoje
                </span>
              </div>

              <div>
                <h4 className="font-serif font-black text-lg text-doevida-red">
                  {selectedHemocentro.nome}
                </h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  {selectedHemocentro.observacoes}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${selectedHemocentro.nome}, ${selectedHemocentro.endereco}, ${selectedHemocentro.cidade}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-doevida-red hover:bg-doevida-redHover text-white font-serif font-bold text-xs rounded-full shadow-md flex items-center justify-center gap-2 transition"
                >
                  <Navigation className="w-4 h-4" />
                  Abrir Rota no Google Maps / Waze
                </a>

                <a
                  href={`tel:${selectedHemocentro.telefone.replace(/\D/g, "")}`}
                  className="w-full py-3 bg-white hover:bg-doevida-pink border border-doevida-red text-doevida-red font-serif font-bold text-xs rounded-full shadow-sm flex items-center justify-center gap-2 transition"
                >
                  <Phone className="w-4 h-4" />
                  Ligar para a Unidade ({selectedHemocentro.telefone})
                </a>
              </div>

              {/* Map Preview Simulation */}
              <div className="rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 p-4 text-center">
                <div className="w-full h-36 bg-gradient-to-br from-pink-100 via-rose-50 to-neutral-200 rounded-xl flex flex-col items-center justify-center p-3 relative">
                  <div className="w-10 h-10 rounded-full bg-doevida-red text-white flex items-center justify-center shadow-lg animate-bounce">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-neutral-800 mt-2 bg-white/90 px-2 py-0.5 rounded shadow-sm">
                    {selectedHemocentro.bairro}, Blumenau
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 mt-2 block">
                  Geolocalização calibrada para o Vale do Itajaí
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
