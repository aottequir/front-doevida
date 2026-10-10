"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
  Droplet,
  Trash2,
  Share2,
  Sparkles,
} from "lucide-react";
import { hemocentrosBlumenau } from "@/data/hemocentros";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { saveAgendamento, getAgendamentos, cancelAgendamento, AgendamentoRecord } from "@/lib/db";

export default function AgendamentosPage() {
  const { user } = useAuth();
  const { showToast, addNotification } = useNotifications();

  // Selected state
  const [selectedHemocentro, setSelectedHemocentro] = useState(hemocentrosBlumenau[0].nome);
  const [tipoDoacao, setTipoDoacao] = useState<"Sangue Total" | "Plaquetas por Aférese">("Sangue Total");
  const [selectedData, setSelectedData] = useState("2026-10-15");
  const [selectedHorario, setSelectedHorario] = useState("08:30");
  const [nome, setNome] = useState(user?.name || "Carlos Eduardo Silva");
  const [telefone, setPhone] = useState(user?.phone || "(47) 99876-5432");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);

  // Existing user appointments
  const [agendamentos, setAgendamentos] = useState<AgendamentoRecord[]>([]);

  // Load appointments from Firebase/LocalStorage on mount
  React.useEffect(() => {
    async function loadData() {
      const data = await getAgendamentos(user?.id);
      if (data.length > 0) {
        setAgendamentos(data);
      } else {
        setAgendamentos([
          {
            id: "agd-001",
            hemocentroNome: "HEMOSC Blumenau - Centro de Hematologia e Hemoterapia",
            tipoDoacao: "Sangue Total",
            data: "2026-10-15",
            horario: "08:30",
            userName: user?.name || "Carlos Eduardo Silva",
            userPhone: user?.phone || "(47) 99876-5432",
            userCpf: user?.cpf || "123.456.789-00",
            status: "Confirmado",
          },
        ]);
      }
    }
    loadData();
  }, [user]);

  const horariosDisponiveis = [
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
  ];

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const novoAgendamento: AgendamentoRecord = {
      id: "agd-" + Date.now(),
      userId: user?.id,
      userEmail: user?.email,
      userName: nome,
      userPhone: telefone,
      userCpf: user?.cpf || "123.456.789-00",
      hemocentroNome: selectedHemocentro,
      tipoDoacao,
      data: selectedData,
      horario: selectedHorario,
      status: "Confirmado",
    };

    try {
      await saveAgendamento(novoAgendamento);
      setAgendamentos([novoAgendamento, ...agendamentos]);
      showToast("Agendamento salvo com sucesso no banco de dados!", "success");

      addNotification({
        title: "📅 Agendamento Confirmado",
        message: `Sua doação de ${tipoDoacao} foi agendada para ${selectedData} às ${selectedHorario} no ${selectedHemocentro}.`,
        type: "reminder",
        actionUrl: "/agendamentos",
        actionText: "Ver Agendamento",
      });
    } catch (err) {
      showToast("Erro ao gravar agendamento.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id: string) => {
    await cancelAgendamento(id);
    setAgendamentos(agendamentos.filter((a) => a.id !== id));
    showToast("Agendamento cancelado.", "info");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-doevida-pink text-doevida-red text-xs font-bold mb-3 border border-pink-200">
          <CalendarCheck className="w-4 h-4" />
          Agendamento Online Sem Filas • Blumenau - SC
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-black text-neutral-900">
          Agendamento de Doação de Sangue
        </h1>
        <p className="text-neutral-600 text-sm md:text-base mt-2 max-w-2xl mx-auto">
          Escolha a unidade, a modalidade de doação, a data e o melhor horário para salvar vidas com conforto e agilidade.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form de Agendamento */}
        <div className="lg:col-span-2">
          <form onSubmit={handleAgendar} className="card-soft space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-doevida-red" />
                Selecione os Dados da sua Doação
              </h2>
            </div>

            {/* Unidade */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2">
                1. Escolha a Unidade / Hemocentro em Blumenau *
              </label>
              <select
                value={selectedHemocentro}
                onChange={(e) => setSelectedHemocentro(e.target.value)}
                className="input-pill font-medium"
                required
              >
                {hemocentrosBlumenau.map((h) => (
                  <option key={h.id} value={h.nome}>
                    {h.nome} ({h.bairro}, {h.cidade})
                  </option>
                ))}
              </select>
            </div>

            {/* Modalidade */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2">
                2. Tipo de Doação *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setTipoDoacao("Sangue Total")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                    tipoDoacao === "Sangue Total"
                      ? "border-doevida-red bg-doevida-pink/30 shadow-soft-pink"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-sm text-neutral-900">
                      Sangue Total
                    </span>
                    <span className="text-xs bg-red-100 text-doevida-red px-2 py-0.5 rounded-full font-bold">
                      Mais Comum
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Duração média de 10 a 15 minutos na cadeira de coleta. Coleta de cerca de 450ml.
                  </p>
                </div>

                <div
                  onClick={() => setTipoDoacao("Plaquetas por Aférese")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                    tipoDoacao === "Plaquetas por Aférese"
                      ? "border-doevida-red bg-doevida-pink/30 shadow-soft-pink"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-sm text-neutral-900">
                      Plaquetas (Aférese)
                    </span>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      Especial
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Duração de cerca de 60 a 90 minutos. Fundamental para pacientes em quimioterapia e transplantes.
                  </p>
                </div>
              </div>
            </div>

            {/* Data e Horário */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-2">
                  3. Escolha a Data *
                </label>
                <input
                  type="date"
                  value={selectedData}
                  min="2026-10-10"
                  onChange={(e) => setSelectedData(e.target.value)}
                  className="input-pill"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-2">
                  4. Selecione o Horário Disponível *
                </label>
                <select
                  value={selectedHorario}
                  onChange={(e) => setSelectedHorario(e.target.value)}
                  className="input-pill font-semibold"
                  required
                >
                  {horariosDisponiveis.map((h) => (
                    <option key={h} value={h}>
                      {h} horas
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dados do Doador */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="input-pill"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Telefone / WhatsApp *</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-pill"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="text-xs text-neutral-500">
                Cancelamento gratuito até 2 horas antes do procedimento.
              </div>
              <button type="submit" className="btn-primary gap-2">
                <CheckCircle2 className="w-4 h-4" /> Confirmar Meu Agendamento
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Meus Agendamentos */}
        <div className="space-y-6">
          <div className="card-soft border-2 border-pink-200">
            <h3 className="font-serif font-bold text-neutral-900 text-lg flex items-center gap-2 mb-4">
              <CalendarCheck className="w-5 h-5 text-doevida-red" />
              Meus Agendamentos
            </h3>

            {agendamentos.length === 0 ? (
              <div className="text-center py-8 text-neutral-400 text-xs">
                Você ainda não possui agendamentos ativos.
              </div>
            ) : (
              <div className="space-y-4">
                {agendamentos.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-doevida-pink/40 border border-pink-200 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        {item.status}
                      </span>
                      <button
                        onClick={() => handleCancelar(item.id)}
                        className="text-neutral-400 hover:text-red-600 transition p-1"
                        title="Cancelar agendamento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-neutral-900 leading-snug">
                      {item.hemocentroNome}
                    </h4>

                    <div className="text-xs text-neutral-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-3.5 h-3.5 text-doevida-red" />
                        <span>Data: <strong>{item.data}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-doevida-red" />
                        <span>Horário: <strong>{item.horario}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplet className="w-3.5 h-3.5 text-doevida-red" />
                        <span>Modalidade: <strong>{item.tipoDoacao}</strong></span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <a
                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Doacao+de+Sangue+DOE+VIDA&dates=${item.data.replace(
                          /-/g,
                          ""
                        )}T080000Z/${item.data.replace(/-/g, "")}T090000Z&details=Doacao+de+sangue+no+HEMOSC+Blumenau&location=${encodeURIComponent(
                          item.hemocentroNome
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center block py-1.5 bg-white hover:bg-neutral-50 text-doevida-red border border-doevida-red/30 text-[11px] font-bold rounded-full transition shadow-sm"
                      >
                        + Adicionar ao Google Calendar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick tips */}
          <div className="p-4 rounded-2xl bg-neutral-100 text-xs text-neutral-600 space-y-2">
            <h4 className="font-serif font-bold text-neutral-900">Orientações do HEMOSC:</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>Chegue com 10 minutos de antecedência.</li>
              <li>Apresente documento original com foto.</li>
              <li>Tome bastante líquido no dia da doação.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
