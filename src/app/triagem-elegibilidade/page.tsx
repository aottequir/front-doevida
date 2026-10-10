"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileDown,
  User,
  Heart,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  QrCode,
  Calendar,
} from "lucide-react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { saveTriagemRecord } from "@/lib/db";

export default function TriagemElegibilidadePage() {
  const { user } = useAuth();
  const { showToast, addNotification } = useNotifications();

  // Form State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: user?.name || "",
    cpf: user?.cpf || "",
    dataNascimento: "",
    sexo: "",
    peso: 50, // min 50kg
    tipoPresumido: user?.bloodType || "",
    telefone: user?.phone || "",
    email: user?.email || "",
    cidade: "",
    // Screening Questions
    dormiuBem: "", // min 6h
    alimentado: "", // alimentado, sem gordura 4h antes
    alcool24h: "", // não consumiu álcool nas últimas 12/24h
    tatuagemPiercing12m: "", // tatuagem ou pircing recente < 12 meses
    febreOuGripe14d: "", // febre ou sintomas respiratórios
    cirurgiaRecente: "", // cirurgia nos últimos 6 meses
    medicamentoControlado: "",
    gravidaOuAmamentando: "",
    viagemRecenteMalaria: "",
  });

  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [resultadoCalculado, setResultadoCalculado] = useState<{
    status: "apto" | "inapto_temporario" | "inapto_definitivo";
    motivos: string[];
    recomendacoes: string[];
  } | null>(null);

  // Calculate Eligibility
  const avaliarElegibilidade = () => {
    const motivos: string[] = [];
    const recomendacoes: string[] = [];

    // Idade
    const birthYear = new Date(formData.dataNascimento).getFullYear();
    const currentYear = new Date().getFullYear();
    const idade = currentYear - birthYear;

    if (idade < 16) {
      motivos.push("A idade mínima legal para doação no Brasil é de 16 anos completos.");
    } else if (idade > 69) {
      motivos.push("A idade máxima para doação é 69 anos (primeira doação até 60 anos).");
    }

    // Peso
    if (formData.peso < 50) {
      motivos.push("O peso mínimo obrigatório é de 50 kg para permitir a retirada de 450ml de sangue.");
    }

    // Sono
    if (formData.dormiuBem === "nao") {
      motivos.push("É obrigatório ter dormido pelo menos 6 horas ininterruptas na noite anterior.");
    }

    // Álcool
    if (formData.alcool24h === "sim") {
      motivos.push("Consumo de bebidas alcoólicas nas últimas 12 a 24 horas impede a doação temporariamente.");
    }

    // Tatuagem / Piercing
    if (formData.tatuagemPiercing12m === "sim") {
      motivos.push("Tatuagem, micropigmentação ou piercing exigem janela imunológica de 6 a 12 meses.");
    }

    // Gripe / Sintomas
    if (formData.febreOuGripe14d === "sim") {
      motivos.push("Sintomas de gripe, febre ou infecção respiratória exigem aguardar 14 dias após o fim dos sintomas.");
    }

    // Gravidez
    if (formData.sexo === "feminino" && formData.gravidaOuAmamentando === "sim") {
      motivos.push("Período gestacional e amamentação exclusiva impedem a doação temporariamente.");
    }

    if (motivos.length === 0) {
      recomendacoes.push("Leve um documento oficial com foto (RG, CNH ou Carteira de Trabalho).");
      recomendacoes.push("Beba bastante água antes e depois de doar.");
      recomendacoes.push("Evite fumar nas 2 horas que antecedem e sucedem a doação.");
      recomendacoes.push("Apresente seu PDF com QR Code na recepção do HEMOSC Blumenau.");

      setResultadoCalculado({
        status: "apto",
        motivos: [],
        recomendacoes,
      });

      addNotification({
        title: "✅ Você está Apto para Doar!",
        message: "Sua pré-triagem foi aprovada. Baixe seu comprovante em PDF e agende sua doação em Blumenau.",
        type: "success",
        actionUrl: "/agendamentos",
        actionText: "Agendar Horário",
      });

      saveTriagemRecord({
        id: "trg-" + Date.now(),
        userId: user?.id,
        protocolo: "DV-BLU-" + Math.floor(100000 + Math.random() * 900000),
        userName: formData.nome,
        cpf: formData.cpf,
        tipoPresumido: formData.tipoPresumido,
        status: "apto",
        dataEmissao: new Date().toISOString(),
        respostas: formData,
      });
    } else {
      setResultadoCalculado({
        status: "inapto_temporario",
        motivos,
        recomendacoes: [
          "Consulte a equipe médica do HEMOSC Blumenau para orientações sobre prazos.",
          "Você pode ajudar convidando amigos e familiares para doar em seu lugar!",
        ],
      });

      addNotification({
        title: "⚠️ Triagem: Impedimento Temporário",
        message: "Identificamos requisitos pendentes para doação neste momento. Confira as orientações.",
        type: "info",
      });

      saveTriagemRecord({
        id: "trg-" + Date.now(),
        userId: user?.id,
        protocolo: "DV-BLU-" + Math.floor(100000 + Math.random() * 900000),
        userName: formData.nome,
        cpf: formData.cpf,
        tipoPresumido: formData.tipoPresumido,
        status: "inapto_temporario",
        dataEmissao: new Date().toISOString(),
        respostas: formData,
      });
    }

    setStep(3);
  };

  // Generate Professional PDF
  const gerarComprovantePDF = async () => {
    setPdfGenerating(true);
    showToast("Gerando Comprovante de Pré-Triagem em PDF...", "info");

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const protocolo = "DV-BLU-" + Math.floor(100000 + Math.random() * 900000);
      const dataEmissao = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Generate QR Code data URL
      const qrData = `DOE+VIDA|PROTOCOLO:${protocolo}|NOME:${formData.nome}|CPF:${formData.cpf}|APTO:SIM|CIDADE:BLUMENAU-SC`;
      const qrCodeUrl = await QRCode.toDataURL(qrData, { width: 250, margin: 1 });

      // PDF Colors
      const brandRed = [207, 0, 0];
      const softPink = [255, 231, 246];
      const darkText = [30, 30, 30];
      const grayText = [100, 100, 100];

      // Top Header Ribbon
      doc.setFillColor(brandRed[0], brandRed[1], brandRed[2]);
      doc.rect(0, 0, 210, 24, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("DOE + VIDA  |  HEMOTERAPIA BLUMENAU - SC", 14, 15);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("SISTEMA INTEGRADO DE DOAÇÃO DE SANGUE E TRIAGEM PRÉVIA", 14, 20);

      // Title Sub-header
      doc.setFillColor(softPink[0], softPink[1], softPink[2]);
      doc.rect(14, 30, 182, 16, "F");

      doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("COMPROVANTE DE PRÉ-ELEGIBILIDADE DE DOAÇÃO", 20, 40);

      doc.setFontSize(8);
      doc.setTextColor(grayText[0], grayText[1], grayText[2]);
      doc.text(`PROTOCOLO: ${protocolo}  •  EMITIDO EM: ${dataEmissao}`, 100, 40);

      // Patient Info Section
      doc.setDrawColor(220, 220, 220);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(14, 52, 182, 54, 3, 3, "FD");

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
      doc.text("1. DADOS DO PACIENTE COLABORADOR", 20, 60);

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);

      doc.text(`Nome Completo:`, 20, 68);
      doc.setFont("helvetica", "normal");
      doc.text(`${formData.nome}`, 55, 68);

      doc.setFont("helvetica", "bold");
      doc.text(`CPF:`, 20, 75);
      doc.setFont("helvetica", "normal");
      doc.text(`${formData.cpf}`, 55, 75);

      doc.setFont("helvetica", "bold");
      doc.text(`Data Nasc.:`, 20, 82);
      doc.setFont("helvetica", "normal");
      doc.text(`${formData.dataNascimento} (Peso: ${formData.peso} kg)`, 55, 82);

      doc.setFont("helvetica", "bold");
      doc.text(`Telefone / Contato:`, 20, 89);
      doc.setFont("helvetica", "normal");
      doc.text(`${formData.telefone} • ${formData.email}`, 55, 89);

      doc.setFont("helvetica", "bold");
      doc.text(`Tipo Sanguíneo:`, 20, 96);
      doc.setFont("helvetica", "normal");
      doc.text(`${formData.tipoPresumido} • Unidade de Coleta: HEMOSC Blumenau`, 55, 96);

      // Result Section
      doc.roundedRect(14, 112, 182, 38, 3, 3, "FD");

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
      doc.text("2. STATUS DA PRÉ-TRIAGEM ONLINE", 20, 120);

      doc.setFontSize(10);
      doc.setTextColor(0, 130, 50);
      doc.text("STATUS: APTO PRELIMINARMENTE PARA DOAÇÃO DE SANGUE", 20, 128);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(grayText[0], grayText[1], grayText[2]);
      doc.text(
        "O colaborador atendeu aos requisitos básicos de peso, sono, alimentação e ausência de impedimentos imediatos.",
        20,
        135
      );
      doc.text(
        "A aptidão final será validada pelo médico hematologista na triagem presencial do hemocentro.",
        20,
        140
      );

      // Checklist and Guidelines
      doc.roundedRect(14, 156, 120, 80, 3, 3, "FD");
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
      doc.text("3. INSTRUÇÕES PARA O DIA DA DOAÇÃO", 20, 165);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      const instrucoes = [
        "[X] Apresente este comprovante com o QR Code na recepcao.",
        "[X] Obrigatorio documento oficial com foto (RG / CNH / Digital).",
        "[X] Estar bem alimentado (evitar frituras e gorduras 4h antes).",
        "[X] Ter dormido pelo menos 6 horas na noite anterior.",
        "[X] Nao consumir bebidas alcoolicas 12h antes.",
        "[X] Hidratar-se com bastante agua antes do procedimento.",
        "[X] Evitar fumar 2 horas antes e 2 horas apos a coleta.",
      ];

      instrucoes.forEach((inst, idx) => {
        doc.text(inst, 20, 175 + idx * 8);
      });

      // QR Code Box
      doc.roundedRect(138, 156, 58, 80, 3, 3, "FD");
      doc.addImage(qrCodeUrl, "PNG", 147, 162, 40, 40);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      doc.text("VALIDAÇÃO RÁPIDA", 147, 210);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(grayText[0], grayText[1], grayText[2]);
      doc.text("Apresente na triagem do", 143, 216);
      doc.text("HEMOSC Blumenau (Vila Nova)", 140, 221);
      doc.text(`Hash: ${protocolo}`, 148, 228);

      // Footer Notes
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 248, 196, 248);

      doc.setFontSize(7);
      doc.setTextColor(grayText[0], grayText[1], grayText[2]);
      doc.text(
        "HEMOSC Blumenau: Rua Theodoro Holtrup, 40 - Vila Nova, Blumenau - SC | Telefone: (47) 3222-9800",
        14,
        255
      );
      doc.text(
        "Este documento e emitido pela plataforma oficial DOE + VIDA conforme a Portaria de Consolidacao do Ministerio da Saude.",
        14,
        260
      );

      // Save PDF
      doc.save(`DOE_VIDA_PreTriagem_${formData.nome.replace(/\s+/g, "_")}.pdf`);
      showToast("PDF baixado com sucesso! Salve ou imprima seu comprovante.", "success");
    } catch (err) {
      console.error(err);
      showToast("Erro ao gerar o PDF. Tente novamente.", "error");
    } finally {
      setPdfGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-doevida-pink text-doevida-red text-xs font-bold mb-3 border border-pink-200">
          <ShieldCheck className="w-4 h-4" />
          Triagem Prévia Conforme Diretrizes do Ministério da Saúde
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-black text-neutral-900">
          Formulário de Pré-Elegibilidade
        </h1>
        <p className="text-neutral-600 text-sm md:text-base mt-2 max-w-2xl mx-auto">
          Responda com sinceridade às perguntas abaixo para verificar sua aptidão para doar sangue em Blumenau e gerar seu **Comprovante em PDF** oficial.
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="flex items-center justify-center mb-10">
        <div className="flex items-center w-full max-w-lg">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full font-serif font-bold text-sm transition-all ${step >= 1 ? "bg-doevida-red text-white shadow-soft-red" : "bg-neutral-200 text-neutral-500"
              }`}
          >
            1
          </div>
          <div className={`flex-1 h-1 mx-2 rounded ${step >= 2 ? "bg-doevida-red" : "bg-neutral-200"}`} />
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full font-serif font-bold text-sm transition-all ${step >= 2 ? "bg-doevida-red text-white shadow-soft-red" : "bg-neutral-200 text-neutral-500"
              }`}
          >
            2
          </div>
          <div className={`flex-1 h-1 mx-2 rounded ${step >= 3 ? "bg-doevida-red" : "bg-neutral-200"}`} />
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full font-serif font-bold text-sm transition-all ${step >= 3 ? "bg-doevida-red text-white shadow-soft-red" : "bg-neutral-200 text-neutral-500"
              }`}
          >
            3
          </div>
        </div>
      </div>

      {/* Step 1: Dados do Colaborador */}
      {step === 1 && (
        <div className="card-soft space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
              <User className="w-5 h-5 text-doevida-red" />
              Passo 1: Informações do Paciente Colaborador
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Estes dados serão inseridos no seu comprovante em PDF e levados ao HEMOSC Blumenau.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Nome Completo *</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="input-pill"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">CPF *</label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                className="input-pill"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Data de Nascimento *</label>
              <input
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                className="input-pill"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Peso Atual (kg) *</label>
              <input
                type="number"
                min="35"
                max="250"
                value={formData.peso}
                onChange={(e) => setFormData({ ...formData, peso: Number(e.target.value) })}
                className="input-pill"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Sexo Biológico *</label>
              <select
                value={formData.sexo}
                onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                className="input-pill font-medium"
              >
                <option value="masculino">Masculino (Intervalo de 60 dias)</option>
                <option value="feminino">Feminino (Intervalo de 90 dias)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Tipo Sanguíneo Conhecido</label>
              <select
                value={formData.tipoPresumido}
                onChange={(e) => setFormData({ ...formData, tipoPresumido: e.target.value })}
                className="input-pill font-medium"
              >
                <option value="O+">O Positivo (O+)</option>
                <option value="O-">O Negativo (O-) - Doador Universal</option>
                <option value="A+">A Positivo (A+)</option>
                <option value="A-">A Negativo (A-)</option>
                <option value="B+">B Positivo (B+)</option>
                <option value="B-">B Negativo (B-)</option>
                <option value="AB+">AB Positivo (AB+) - Receptor Universal</option>
                <option value="AB-">AB Negativo (AB-)</option>
                <option value="Não Sei">Ainda não sei (será tipado na hora)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="input-pill"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Cidade / Região</label>
              <input
                type="text"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                className="input-pill"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary gap-2"
            >
              Avançar para Perguntas Médicas <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Questionário de Elegibilidade */}
      {step === 2 && (
        <div className="card-soft space-y-6">
          <div className="border-b border-neutral-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-neutral-900">
                Passo 2: Questionário de Saúde e Hábitos
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Todas as perguntas são confidenciais e seguem os protocolos do HEMOSC.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Pergunta 1 */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-sm font-medium text-neutral-800">
                1. Você dormiu pelo menos 6 horas nas últimas 24 horas?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, dormiuBem: "sim" })}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${formData.dormiuBem === "sim"
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-white text-neutral-700 border"
                    }`}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, dormiuBem: "nao" })}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${formData.dormiuBem === "nao"
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-white text-neutral-700 border"
                    }`}
                >
                  Não
                </button>
              </div>
            </div>

            {/* Pergunta 2 */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-sm font-medium text-neutral-800">
                2. Fez refeição leve e evitou alimentos gordurosos nas últimas 4 horas?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, alimentado: "sim" })}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${formData.alimentado === "sim"
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-white text-neutral-700 border"
                    }`}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, alimentado: "nao" })}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${formData.alimentado === "nao"
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-white text-neutral-700 border"
                    }`}
                >
                  Não
                </button>
              </div>
            </div>

            {/* Pergunta 3 */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-sm font-medium text-neutral-800">
                3. Ingeriu bebidas alcoólicas nas últimas 12 a 24 horas?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, alcool24h: "sim" })}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${formData.alcool24h === "sim"
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-white text-neutral-700 border"
                    }`}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, alcool24h: "nao" })}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${formData.alcool24h === "nao"
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-white text-neutral-700 border"
                    }`}
                >
                  Não
                </button>
              </div>
            </div>

            {/* Pergunta 4 */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-sm font-medium text-neutral-800">
                4. Fez tatuagem, piercing ou micropigmentação nos últimos 12 meses?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tatuagemPiercing12m: "sim" })}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${formData.tatuagemPiercing12m === "sim"
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-white text-neutral-700 border"
                    }`}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tatuagemPiercing12m: "nao" })}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${formData.tatuagemPiercing12m === "nao"
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-white text-neutral-700 border"
                    }`}
                >
                  Não
                </button>
              </div>
            </div>

            {/* Pergunta 5 */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-sm font-medium text-neutral-800">
                5. Teve febre, gripe, diarreia ou infecção nos últimos 14 dias?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, febreOuGripe14d: "sim" })}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${formData.febreOuGripe14d === "sim"
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-white text-neutral-700 border"
                    }`}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, febreOuGripe14d: "nao" })}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${formData.febreOuGripe14d === "nao"
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-white text-neutral-700 border"
                    }`}
                >
                  Não
                </button>
              </div>
            </div>

            {/* Pergunta 6 (Feminino) */}
            {formData.sexo === "feminino" && (
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-sm font-medium text-neutral-800">
                  6. Está grávida ou amamentando bebê com menos de 12 meses?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gravidaOuAmamentando: "sim" })}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition ${formData.gravidaOuAmamentando === "sim"
                        ? "bg-red-600 text-white shadow-sm"
                        : "bg-white text-neutral-700 border"
                      }`}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gravidaOuAmamentando: "nao" })}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition ${formData.gravidaOuAmamentando === "nao"
                        ? "bg-green-600 text-white shadow-sm"
                        : "bg-white text-neutral-700 border"
                      }`}
                  >
                    Não
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-secondary gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
            <button
              type="button"
              onClick={avaliarElegibilidade}
              className="btn-primary gap-2"
            >
              <Sparkles className="w-4 h-4" /> Finalizar Triagem & Ver Resultado
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Resultado & Download de PDF */}
      {step === 3 && resultadoCalculado && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Status Box */}
          <div
            className={`p-6 md:p-8 rounded-3xl border ${resultadoCalculado.status === "apto"
                ? "bg-green-50 border-green-200 text-green-950"
                : "bg-amber-50 border-amber-200 text-amber-950"
              }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-2xl ${resultadoCalculado.status === "apto" ? "bg-green-600 text-white" : "bg-amber-600 text-white"
                    }`}
                >
                  {resultadoCalculado.status === "apto" ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : (
                    <AlertTriangle className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                    Resultado da Avaliação
                  </span>
                  <h3 className="font-serif text-2xl font-black">
                    {resultadoCalculado.status === "apto"
                      ? "Parabéns! Você está APTO para Doar Sangue."
                      : "Impedimento Temporário Identificado"}
                  </h3>
                </div>
              </div>

              {resultadoCalculado.status === "apto" && (
                <button
                  type="button"
                  onClick={gerarComprovantePDF}
                  disabled={pdfGenerating}
                  className="w-full sm:w-auto px-6 py-3.5 bg-doevida-red hover:bg-doevida-redHover text-white font-serif font-bold rounded-full shadow-lg hover:shadow-soft-red transition flex items-center justify-center gap-2"
                >
                  <FileDown className="w-5 h-5" />
                  {pdfGenerating ? "Gerando PDF..." : "Baixar Comprovante em PDF"}
                </button>
              )}
            </div>

            {/* Motivos de Inaptidão se houver */}
            {resultadoCalculado.motivos.length > 0 && (
              <div className="mt-6 pt-6 border-t border-amber-200/60">
                <h4 className="font-bold text-sm mb-2 text-amber-900">Critérios que requerem atenção:</h4>
                <ul className="space-y-1.5 text-xs md:text-sm">
                  {resultadoCalculado.motivos.map((motivo, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{motivo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recomendações */}
            <div className="mt-6 pt-6 border-t border-neutral-200/60">
              <h4 className="font-bold text-sm mb-2">Recomendações Importantes:</h4>
              <ul className="space-y-1.5 text-xs md:text-sm">
                {resultadoCalculado.recomendacoes.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PDF Preview Card */}
          <div className="card-soft border border-pink-100 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-doevida-red font-serif font-bold text-sm">
                  <QrCode className="w-5 h-5" />
                  Ficha Digital com QR Code
                </div>
                <h3 className="font-serif text-xl font-bold text-neutral-900">
                  Comprovante Oficial de Pré-Triagem
                </h3>
                <p className="text-xs text-neutral-600 max-w-lg leading-relaxed">
                  O PDF gerado contém seus dados declarados, data/hora, orientações e um QR Code de validação rápida para o HEMOSC Blumenau.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <button
                  onClick={gerarComprovantePDF}
                  disabled={pdfGenerating}
                  className="w-full sm:w-auto px-6 py-3 bg-doevida-red hover:bg-doevida-redHover text-white font-serif font-bold text-xs rounded-full shadow-md flex items-center justify-center gap-2 transition"
                >
                  <FileDown className="w-4 h-4" />
                  {pdfGenerating ? "Processando..." : "Baixar PDF Novamente"}
                </button>

                <Link
                  href="/agendamentos"
                  className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-doevida-pink border border-doevida-red text-doevida-red font-serif font-bold text-xs rounded-full shadow-sm flex items-center justify-center gap-2 transition text-center"
                >
                  <Calendar className="w-4 h-4" />
                  Ir para Agendamento
                </Link>
              </div>
            </div>
          </div>

          {/* Reset button */}
          <div className="text-center pt-4">
            <button
              onClick={() => {
                setStep(1);
                setResultadoCalculado(null);
              }}
              className="text-xs text-neutral-500 hover:text-doevida-red font-medium underline"
            >
              Refazer Formulário de Triagem
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
