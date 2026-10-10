"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  MapPin,
  Calendar,
  Clock,
  Users,
  Share2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import { campanhasBlumenau, Campanha } from "@/data/campanhas";
import { useNotifications } from "@/context/NotificationContext";

export default function CampanhasPage() {
  const [campanhas, setCampanhas] = useState<Campanha[]>(campanhasBlumenau);
  const [participacoes, setParticipacoes] = useState<string[]>([]);
  const { showToast, addNotification } = useNotifications();

  const handleParticipar = (campanhaId: string, titulo: string) => {
    if (participacoes.includes(campanhaId)) {
      setParticipacoes(participacoes.filter((id) => id !== campanhaId));
      showToast("Participação cancelada.", "info");
    } else {
      setParticipacoes([...participacoes, campanhaId]);
      showToast(`Você confirmou presença na campanha: ${titulo}!`, "success");

      addNotification({
        title: "🎉 Presença Confirmada em Campanha",
        message: `Obrigado por apoiar a campanha "${titulo}" em Blumenau. Compartilhe com amigos!`,
        type: "success",
        actionUrl: "/campanhas",
        actionText: "Ver Campanha",
      });
    }
  };

  const getUrgencyBadge = (urgencia: string) => {
    switch (urgencia) {
      case "Urgência Máxima":
        return "bg-red-600 text-white animate-pulse";
      case "Alta":
        return "bg-amber-500 text-white";
      default:
        return "bg-green-600 text-white";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-doevida-pink text-doevida-red text-xs font-bold mb-3 border border-pink-200">
          <Megaphone className="w-4 h-4" />
          Mobilizações Solidárias em Blumenau e Vale do Itajaí
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-black text-neutral-900">
          Campanhas de Doação de Sangue
        </h1>
        <p className="text-neutral-600 text-sm md:text-base mt-2 max-w-2xl mx-auto">
          Conheça as coletas itinerantes em universidades, praças e empresas locais. Participe e convide sua rede para bater as metas de bolsas salvas!
        </p>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {campanhas.map((campanha) => {
          const isParticipando = participacoes.includes(campanha.id);
          const percentual = Math.min(
            100,
            Math.round((campanha.bolsasArrecadadas / campanha.metaBolsas) * 100)
          );

          return (
            <div
              key={campanha.id}
              className="card-soft border-2 hover:border-doevida-red/30 transition flex flex-col justify-between"
            >
              <div>
                {/* Header with Urgency and Location */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getUrgencyBadge(
                      campanha.urgencia
                    )}`}
                  >
                    {campanha.urgencia}
                  </span>
                  <span className="text-xs font-semibold text-neutral-500">
                    {campanha.bairro}, {campanha.cidade}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-neutral-900 mb-2">
                  {campanha.titulo}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  {campanha.descricao}
                </p>

                {/* Info List */}
                <div className="space-y-2 text-xs text-neutral-600 bg-neutral-50 p-4 rounded-2xl mb-4 border border-neutral-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-doevida-red flex-shrink-0" />
                    <span><strong>Local:</strong> {campanha.local}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-doevida-red flex-shrink-0" />
                    <span><strong>Período:</strong> {campanha.dataInicio} até {campanha.dataFim} ({campanha.horario})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-doevida-red flex-shrink-0" />
                    <span><strong>Organização:</strong> {campanha.organizador}</span>
                  </div>
                </div>

                {/* Tipos Sanguíneos Solicitados */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-neutral-700 block mb-1">
                    Tipos com Maior Necessidade:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {campanha.tiposNecessarios.map((tipo) => (
                      <span
                        key={tipo}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-100 text-doevida-red border border-pink-200"
                      >
                        {tipo}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-700 mb-1.5">
                    <span>Meta de Bolsas: {campanha.metaBolsas}</span>
                    <span className="text-doevida-red font-serif">{percentual}% Concluído ({campanha.bolsasArrecadadas + (isParticipando ? 1 : 0)} bolsas)</span>
                  </div>
                  <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-doevida-red rounded-full transition-all duration-500"
                      style={{ width: `${percentual}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions Bottom */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => handleParticipar(campanha.id, campanha.titulo)}
                  className={`w-full sm:flex-1 py-3 font-serif font-bold text-xs rounded-full shadow-sm transition flex items-center justify-center gap-2 ${
                    isParticipando
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-doevida-red text-white hover:bg-doevida-redHover"
                  }`}
                >
                  {isParticipando ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Presença Confirmada
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="w-4 h-4" /> Quero Participar
                    </>
                  )}
                </button>

                <a
                  href={campanha.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-green-50 border border-green-600 text-green-700 font-serif font-bold text-xs rounded-full shadow-sm flex items-center justify-center gap-2 transition"
                >
                  <Share2 className="w-4 h-4" />
                  Divulgar no WhatsApp
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
