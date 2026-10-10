
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Heart,
  UserRound,
  Phone,
  CreditCard,
  Droplet,
  ArrowRight,
} from "lucide-react";

import Logo from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";

type LoginMode = "login" | "register" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, register } = useAuth();
  const { showToast, addNotification } = useNotifications();

  const [mode, setMode] = useState<LoginMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("O+");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);

  const changeMode = (newMode: LoginMode) => {
    setMode(newMode);
    setShowPassword(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      if (mode === "login") {
        await login(email.trim(), password);

        showToast(
          "Login realizado com sucesso! Bem-vindo(a) ao DOE + VIDA.",
          "success"
        );

        addNotification({
          title: "Sessão Iniciada",
          message:
            "Olá! Seu acesso foi autenticado. Verifique os hemocentros disponíveis em Blumenau.",
          type: "info",
          actionUrl: "/hemocentros",
          actionText: "Ver Hemocentros",
        });

        router.push("/");
      } else if (mode === "register") {
        if (!name.trim() || !email.trim()) {
          showToast(
            "Preencha todos os campos obrigatórios.",
            "error"
          );
          return;
        }

        // Mantém a assinatura de cadastro existente no projeto.
        // A integração da senha precisa ser conferida no AuthContext.
        await register({
          name: name.trim(),
          email: email.trim(),
          bloodType,
          cpf: cpf.trim() || "000.000.000-00",
          phone: phone.trim() || "(47) 99999-9999",
        });

        showToast(
          "Cadastro realizado com sucesso! Você já pode agendar sua doação.",
          "success"
        );

        router.push("/triagem-elegibilidade");
      } else {
        // Não simula o envio de e-mail de recuperação.
        showToast(
          "A recuperação de senha precisa ser conectada ao serviço de autenticação.",
          "info"
        );
      }
    } catch {
      showToast(
        "Não foi possível concluir a operação. Confira seus dados e tente novamente.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await loginWithGoogle();

      showToast(
        "Conectado via conta Google com sucesso!",
        "success"
      );

      router.push("/");
    } catch {
      showToast(
        "Falha na autenticação com Google.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-pink-200 bg-white py-3.5 pl-12 pr-4 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none transition focus:border-[#CF0000] focus:ring-2 focus:ring-red-100 disabled:opacity-60";

  const labelClass =
    "mb-2 block text-sm font-semibold text-neutral-700";

  return (
    <main className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center bg-[#FFE7F6] px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-3xl border border-pink-100 bg-white p-6 shadow-xl sm:p-8">

        {/* Logo oficial do projeto */}
        <header className="mb-6 flex flex-col items-center text-center">
          <Logo size="lg" showText={false} />

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900">
            {mode === "login"
              ? "Bem-vindo(a)!"
              : mode === "register"
                ? "Crie sua conta"
                : "Recuperar acesso"}
          </h1>

          <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-600">
            {mode === "login"
              ? "Entre na sua conta e faça parte da rede que ajuda a salvar vidas."
              : mode === "register"
                ? "Cadastre-se no DOE + VIDA e faça parte dessa missão."
                : "Informe seu e-mail para iniciar a recuperação do acesso."}
          </p>
        </header>

        {/* Navegação entre as opções */}
        <div className="mb-7 grid grid-cols-2 gap-1 rounded-xl bg-pink-50 p-1">
          <button
            type="button"
            onClick={() => changeMode("login")}
            aria-pressed={mode === "login"}
            className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${mode === "login"
                ? "bg-[#CF0000] text-white shadow-sm"
                : "text-neutral-600 hover:bg-white"
              }`}
          >
            Entrar
          </button>

          <button
            type="button"
            onClick={() => changeMode("register")}
            aria-pressed={mode === "register"}
            className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${mode === "register"
                ? "bg-[#CF0000] text-white shadow-sm"
                : "text-neutral-600 hover:bg-white"
              }`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Campos exclusivos do cadastro */}
          {mode === "register" && (
            <>
              <div>
                <label htmlFor="full-name" className={labelClass}>
                  Nome completo
                </label>

                <div className="relative">
                  <UserRound
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#CF0000]"
                  />

                  <input
                    id="full-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Digite seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cpf" className={labelClass}>
                  CPF
                </label>

                <div className="relative">
                  <CreditCard
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#CF0000]"
                  />

                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    autoComplete="off"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className={inputClass}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Telefone / WhatsApp
                </label>

                <div className="relative">
                  <Phone
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#CF0000]"
                  />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="(47) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="blood-type" className={labelClass}>
                  Tipo sanguíneo
                </label>

                <div className="relative">
                  <Droplet
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#CF0000]"
                  />

                  <select
                    id="blood-type"
                    name="bloodType"
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className={`${inputClass} appearance-none`}
                    disabled={loading}
                  >
                    <option value="Desconhecido">
                      Ainda não sei
                    </option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* E-mail */}
          <div>
            <label htmlFor="email" className={labelClass}>
              E-mail
            </label>

            <div className="relative">
              <Mail
                aria-hidden="true"
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#CF0000]"
              />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                disabled={loading}
              />
            </div>
          </div>

          {/* Senha: não aparece na recuperação de acesso */}
          {mode !== "forgot" && (
            <div>
              <label htmlFor="password" className={labelClass}>
                Senha
              </label>

              <div className="relative">
                <Lock
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#CF0000]"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "register"
                      ? "new-password"
                      : "current-password"
                  }
                  required
                  minLength={mode === "register" ? 6 : undefined}
                  placeholder={
                    mode === "register"
                      ? "Crie sua senha"
                      : "Digite sua senha"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-12`}
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Ocultar senha" : "Mostrar senha"
                  }
                  aria-pressed={showPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md text-neutral-500 transition hover:text-[#CF0000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Recuperação de senha */}
          {mode === "login" && (
            <div className="-mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => changeMode("forgot")}
                className="text-sm font-medium text-[#B00000] underline-offset-4 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
          )}

          {/* Botão principal */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#CF0000] px-5 py-3.5 font-semibold text-white shadow-md transition hover:bg-[#A80000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span
                  className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
                  aria-hidden="true"
                />
                Processando...
              </>
            ) : (
              <>
                {mode === "login"
                  ? "Entrar na minha conta"
                  : mode === "register"
                    ? "Criar minha conta"
                    : "Solicitar recuperação"}

                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {/* Retorno para o login */}
        {mode === "forgot" && (
          <button
            type="button"
            onClick={() => changeMode("login")}
            className="mt-4 w-full text-center text-sm font-medium text-neutral-600 hover:text-[#CF0000]"
          >
            Voltar para entrar
          </button>
        )}

        {/* Login com Google: mantido para preservar a integração */}
        {mode !== "forgot" && (
          <>
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-pink-200" />
              <span className="text-xs text-neutral-500">
                Ou continue com
              </span>
              <div className="h-px flex-1 bg-pink-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-pink-200 bg-white px-5 py-3 font-semibold text-neutral-700 transition hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                className="h-5 w-5"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                  transform="translate(0 6)"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.74 7.18l7.65 5.94c4.47-4.13 7.13-10.2 7.13-17.59Z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.15 15.9-5.86l-7.65-5.94c-2.13 1.43-4.85 2.27-8.25 2.27-6.34 0-11.72-4.28-13.64-10.02l-7.98 6.19C6.33 42.6 14.62 48 24 48Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.36 28.45A14.4 14.4 0 0 1 9.6 24c0-1.55.27-3.05.76-4.45l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.86.92 7.51 2.56 10.64l7.8-6.19Z"
                  transform="translate(0 0)"
                />
              </svg>

              Continuar com Google
            </button>
          </>
        )}

        <footer className="mt-7 border-t border-pink-100 pt-5 text-center">
          <div className="mb-2 flex items-center justify-center gap-2 text-[#CF0000]">
            <Heart className="h-4 w-4 fill-current" />
            <span className="text-sm font-semibold">
              DOE + VIDA
            </span>
          </div>

          <p className="text-xs leading-relaxed text-neutral-500">
            Cada doação pode fazer a diferença na vida de alguém.
          </p>
        </footer>
      </section>
    </main>
  );
}
