"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Heart,
  Calendar,
  MapPin,
  FileCheck2,
  Megaphone,
  BookOpen,
  GitCompare,
  User,
  LogOut,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import NotificationDropdown from "@/components/ui/NotificationDropdown";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/", label: "Início", icon: Heart },
  { href: "/triagem-elegibilidade", label: "Pré-Triagem & PDF", icon: FileCheck2 },
  { href: "/hemocentros", label: "Hemocentros Blumenau", icon: MapPin },
  { href: "/agendamentos", label: "Agendamentos", icon: Calendar },
  { href: "/campanhas", label: "Campanhas", icon: Megaphone },
  { href: "/compatibilidade-sanguinea", label: "Compatibilidade", icon: GitCompare },
  { href: "/informacoes-guia", label: "Guia do Doador", icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={true} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-doevida-pink text-doevida-red font-bold shadow-sm"
                      : "text-neutral-700 hover:text-doevida-red hover:bg-doevida-pink/40"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-doevida-red" : "text-neutral-500"}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-3">
            <NotificationDropdown />

            {isAuthenticated && user ? (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-neutral-200">
                <div className="text-right">
                  <div className="text-xs font-bold text-neutral-900 truncate max-w-[120px]">
                    {user.name.split(" ")[0]}
                  </div>
                  <div className="text-[10px] font-semibold text-doevida-red bg-pink-100 px-2 py-0.2 rounded-full inline-block">
                    {user.bloodType || "Doador"}
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Sair da conta"
                  className="p-2 text-neutral-400 hover:text-doevida-red rounded-full hover:bg-doevida-pink transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 bg-doevida-red hover:bg-doevida-redHover text-white text-xs font-serif font-bold tracking-wide rounded-full shadow-sm hover:shadow-soft-red transition active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                Entrar
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-neutral-700 hover:text-doevida-red hover:bg-doevida-pink/50 focus:outline-none"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-pink-100 shadow-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${
                    isActive
                      ? "bg-doevida-pink text-doevida-red font-bold"
                      : "text-neutral-700 hover:bg-doevida-pink/40 hover:text-doevida-red"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-doevida-red" : "text-neutral-400"}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between w-full px-2">
                <div>
                  <div className="text-sm font-bold text-neutral-900">{user.name}</div>
                  <div className="text-xs text-doevida-red">{user.email}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-doevida-red rounded-full shadow-sm"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-doevida-red text-white text-sm font-serif font-bold rounded-full shadow-md"
              >
                Acessar Minha Conta / Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
