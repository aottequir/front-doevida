import React from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { Heart, MapPin, Phone, Mail, Clock, ShieldCheck, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-pink-100 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-4">
            <Logo size="md" showText={true} />
            <p className="text-xs text-neutral-600 leading-relaxed font-sans mt-2">
              A plataforma <strong className="text-doevida-red"> DOE+VIDA</strong> conecta doadores voluntários aos hemocentros de Blumenau e região, facilitando o processo de doação de sangue.
            </p>
            <div className="flex items-center gap-2 text-xs text-doevida-red font-semibold bg-doevida-pink px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4" />
              Conectado ao HEMOSC Blumenau
            </div>
          </div>

          {/* Col 2: Unidades e Hemocentros em Blumenau */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-neutral-900 text-sm tracking-wide uppercase border-b border-pink-100 pb-2">
              Hemocentros Blumenau
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-doevida-red mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-neutral-900 block font-sans">HEMOSC Blumenau</strong>
                  Rua Theodoro Holtrup, 40 - Vila Nova
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-doevida-red mt-0.5 flex-shrink-0" />
                <span>(47) 3222-9800 / (47) 3222-9801</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-doevida-red mt-0.5 flex-shrink-0" />
                <span>Seg a Sex: 07h15 às 16h30</span>
              </li>
              <li className="pt-1">
                <Link
                  href="/hemocentros"
                  className="text-doevida-red hover:underline font-bold flex items-center gap-1"
                >
                  Ver todos os postos de coleta <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Links Rápidos */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-neutral-900 text-sm tracking-wide uppercase border-b border-pink-100 pb-2">
              Navegação Rápida
            </h3>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <Link href="/triagem-elegibilidade" className="hover:text-doevida-red transition">
                  • Teste de Pré-Elegibilidade Online
                </Link>
              </li>
              <li>
                <Link href="/agendamentos" className="hover:text-doevida-red transition">
                  • Agendar Doação de Sangue
                </Link>
              </li>
              <li>
                <Link href="/compatibilidade-sanguinea" className="hover:text-doevida-red transition">
                  • Matriz de Compatibilidade Sanguínea
                </Link>
              </li>
              <li>
                <Link href="/campanhas" className="hover:text-doevida-red transition">
                  • Campanhas e Coletas Itinerantes
                </Link>
              </li>
              <li>
                <Link href="/informacoes-guia" className="hover:text-doevida-red transition">
                  • Mitos, Verdades e Requisitos
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-doevida-red transition">
                  • Área do Doador / Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Dica de Vida */}
          <div className="space-y-3 bg-doevida-pink/50 p-4 rounded-2xl border border-pink-200">
            <h3 className="font-serif font-bold text-doevida-red text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 fill-doevida-red" />
              Sabia que...?
            </h3>
            <p className="text-xs text-neutral-700 leading-relaxed">
              Uma única doação de sangue total (cerca de 450ml) é fracionada em até 4 componentes (hemácias, plaquetas, plasma e crioprecipitado), podendo salvar até  <strong className="text-doevida-red">4 vidas</strong> em hospitais da região.
            </p>
            <div className="pt-2">
              <Link
                href="/agendamentos"
                className="block text-center py-2 px-3 bg-doevida-red hover:bg-doevida-redHover text-white text-xs font-serif font-bold rounded-full transition shadow-sm"
              >
                Agende Sua Doação
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} DOE + VIDA Blumenau - Santa Catarina. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Desenvolvido com Next.js & Tailwind CSS</span>
            <span>•</span>
            <span className="text-doevida-red font-medium">Salve Vidas</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
