"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: "urgent" | "info" | "success" | "reminder";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationContextType {
  notifications: SystemNotification[];
  unreadCount: number;
  addNotification: (notif: Omit<SystemNotification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  toast: {
    message: string;
    type: "success" | "error" | "info" | "urgent" | "reminder";
  } | null;
  showToast: (message: string, type?: "success" | "error" | "info" | "urgent" | "reminder") => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: "notif-1",
      title: "🚨 Alerta Crítico de Estoque em Blumenau",
      message: "Os estoques de sangue O- e A- no HEMOSC Blumenau atingiram níveis críticos de segurança. Sua doação é urgente!",
      type: "urgent",
      timestamp: "Há 10 minutos",
      read: false,
      actionUrl: "/agendamentos",
      actionText: "Agendar Doação",
    },
    {
      id: "notif-2",
      title: "🎉 Você já pode doar novamente!",
      message: "Completaram-se 60 dias desde a sua última doação. Seu corpo está renovado e pronto para salvar mais até 4 vidas.",
      type: "success",
      timestamp: "Hoje às 08:00",
      read: false,
      actionUrl: "/triagem-elegibilidade",
      actionText: "Fazer Pré-Triagem",
    },
    {
      id: "notif-3",
      title: "📍 Nova Campanha na FURB",
      message: "Posto de coleta itinerante no Ginásio da FURB aberto de 15 a 17 de Outubro. Garanta sua vaga!",
      type: "info",
      timestamp: "Ontem às 14:30",
      read: true,
      actionUrl: "/campanhas",
      actionText: "Ver Campanha",
    },
    {
      id: "notif-4",
      title: "📋 Comprovante de Elegibilidade",
      message: "Lembre-se de levar seu documento oficial com foto e o PDF de pré-triagem ao comparecer ao hemocentro.",
      type: "reminder",
      timestamp: "2 dias atrás",
      read: true,
      actionUrl: "/triagem-elegibilidade",
      actionText: "Gerar PDF",
    },
  ]);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "urgent" | "reminder";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "urgent" | "reminder" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (notif: Omit<SystemNotification, "id" | "timestamp" | "read">) => {
    const newNotif: SystemNotification = {
      ...notif,
      id: "notif-" + Date.now(),
      timestamp: "Agora mesmo",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(newNotif.title, newNotif.type);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("Todas as notificações foram lidas!", "info");
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        toast,
        showToast,
      }}
    >
      {children}

      {/* Floating Toast Notification Bar */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in">
          <div
            className={`flex items-start gap-3 p-4 rounded-2xl shadow-elevated border transition-all ${
              toast.type === "urgent"
                ? "bg-red-600 text-white border-red-700"
                : toast.type === "success"
                ? "bg-[#1E1E1E] text-white border-green-500"
                : toast.type === "error"
                ? "bg-red-500 text-white border-red-600"
                : "bg-[#1E1E1E] text-white border-pink-400"
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white mt-1.5 animate-pulse" />
            <div className="flex-1 text-sm font-medium">{toast.message}</div>
            <button
              onClick={() => setToast(null)}
              className="text-white/80 hover:text-white text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
