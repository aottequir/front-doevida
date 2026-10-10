import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";

export const metadata: Metadata = {
  title: "DOE + VIDA | Sistema de Doação de Sangue Blumenau - SC",
  description: "Plataforma de doação de sangue para Blumenau e região. Verifique elegibilidade, baixe seu comprovante em PDF, consulte hemocentros, compatibilidade sanguínea e agende sua doação.",
  keywords: ["doação de sangue", "Blumenau", "HEMOSC", "DOE+VIDA", "salvar vidas", "sangue O-", "Santa Catarina"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col bg-[#FAF7F9] text-neutral-900 selection:bg-doevida-pink selection:text-doevida-red antialiased">
        <AuthProvider>
          <NotificationProvider>
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
