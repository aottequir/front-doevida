"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCheck, AlertCircle, Calendar, HeartHandshake, Info, Trash2 } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
      case "success":
        return <HeartHandshake className="w-5 h-5 text-green-600 flex-shrink-0" />;
      case "reminder":
        return <Calendar className="w-5 h-5 text-amber-600 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-pink-600 flex-shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full bg-white hover:bg-doevida-pink text-neutral-700 hover:text-doevida-red border border-neutral-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-doevida-red/30 shadow-sm"
        aria-label="Abrir notificações"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-doevida-red text-[11px] font-bold text-white shadow-md animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white shadow-2xl border border-pink-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-doevida-pink to-white border-b border-pink-100">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-neutral-900">Notificações</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-doevida-red text-white">
                  {unreadCount} nova{unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-doevida-red hover:text-doevida-redDark font-medium transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Marcar lidas
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-neutral-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-neutral-400 text-sm">
                Nenhuma notificação no momento.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 transition-colors relative group hover:bg-doevida-pink/30 cursor-pointer ${
                    !notif.read ? "bg-pink-50/60" : "bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 rounded-xl bg-white shadow-sm border border-neutral-100">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-neutral-900 truncate">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-neutral-400 whitespace-nowrap ml-2">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>

                      {notif.actionUrl && (
                        <div className="mt-2.5">
                          <Link
                            href={notif.actionUrl}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center text-[11px] font-bold text-doevida-red hover:underline"
                          >
                            {notif.actionText || "Ver detalhes"} →
                          </Link>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(notif.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 p-1 transition"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 text-center bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-500">
            HEMOSC Blumenau & DOE + VIDA em tempo real
          </div>
        </div>
      )}
    </div>
  );
}
