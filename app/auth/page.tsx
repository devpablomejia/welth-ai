"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BarChart3, Sparkles, TrendingUp } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const humanizeAuthError = (message: string) => {
    const raw = (message || "").trim();
    const lower = raw.toLowerCase();

    if (lower.includes("email signups are disabled")) {
      return (
        "Supabase bloqueó el registro: “Email signups are disabled”. " +
        "Revisa en Supabase → Authentication → Providers: " +
        "(1) Email = Enabled, (2) Allow new users to sign up = ON, " +
        "y haz clic en “Save changes”. " +
        "Si ya está así, probablemente tu app está usando las llaves de OTRO proyecto: " +
        "compara el project ref de tu dashboard con el de NEXT_PUBLIC_SUPABASE_URL."
      );
    }

    if (lower.includes("user already registered")) {
      return "Ese usuario ya existe. Intenta con otro.";
    }

    return raw || "Ocurrió un error";
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/dashboard");
    });
  }, [router, supabase]);

  const normalizeUsername = (raw: string) =>
    raw
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ".")
      .replace(/[^a-z0-9._-]/g, "")
      .replace(/\.+/g, ".")
      .replace(/^\.|\.$/g, "");

  const usernameToSyntheticEmail = (raw: string) => {
    const username = normalizeUsername(raw);
    if (!username) return "";
    // Internal-only email for Supabase Email Auth. Not shown to the user.
    return `${username}@welth.local`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const username = normalizeUsername(loginData.username);
      if (!username) {
        setError("Ingresa un usuario válido");
        return;
      }

      const email = usernameToSyntheticEmail(username);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: loginData.password,
      });

      if (signInError) {
        setError(humanizeAuthError(signInError.message));
        return;
      }

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const normalizedUsername = normalizeUsername(registerData.username);
    if (!normalizedUsername || normalizedUsername.length < 3) {
      setError("El usuario debe tener al menos 3 caracteres (a-z, 0-9, . _ -)");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const email = usernameToSyntheticEmail(normalizedUsername);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: registerData.password,
        options: {
          data: {
            username: normalizedUsername,
          },
        },
      });

      if (signUpError) {
        setError(humanizeAuthError(signUpError.message));
        return;
      }

      if (!data.session) {
        setError(
          "Cuenta creada. Como usamos usuario (sin email real), desactiva la confirmación por email en Supabase Auth o no podrás iniciar sesión."
        );
        setActiveTab("login");
        return;
      }

      // Persist unique username in profiles table (enforced with UNIQUE constraint)
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: data.user?.id,
        username: normalizedUsername,
      });

      if (profileError) {
        await supabase.auth.signOut();
        setError(
          "No se pudo completar el registro (usuario ya existe). Intenta con otro."
        );
        setActiveTab("register");
        return;
      }

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white dark:bg-slate-900">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col h-full relative z-10 overflow-y-auto">
        <div className="p-6 md:p-8">
          <Link
            href="/landing"
            className="inline-flex items-center text-sm text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>
        </div>

        <div className="flex-grow flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 max-w-lg mx-auto w-full">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4 space-x-2">
              <Image
                src="/images/logo.jpg"
                alt="WelthIA Logo"
                width={40}
                height={40}
                className="rounded-xl"
                unoptimized
              />
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                WelthIA
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Bienvenido
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Accede a tu asistente de salud personalizado
            </p>
          </div>

          <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-1">
            {/* Custom Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 m-4">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === "login"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === "register"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Registrarse
              </button>
            </div>

            {/* Login Form */}
            {activeTab === "login" && (
              <form
                onSubmit={handleLogin}
                className="space-y-5 px-4 pb-6 sm:px-6"
              >
                <div>
                  <Label
                    htmlFor="username"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Usuario
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={loginData.username}
                    onChange={(e) =>
                      setLoginData({ ...loginData, username: e.target.value })
                    }
                    required
                    className="block w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Contraseña
                    </Label>
                    <a
                      href="#"
                      className="text-xs font-medium text-primary hover:text-primary/80"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                    className="block w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 rounded-r-lg">
                    <p className="text-sm text-red-900 dark:text-red-100 font-medium">
                      {error}
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Ingresando...
                      </div>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Register Form */}
            {activeTab === "register" && (
              <form
                onSubmit={handleRegister}
                className="space-y-5 px-4 pb-6 sm:px-6"
              >
                <div>
                  <Label
                    htmlFor="register-username"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Usuario
                  </Label>
                  <Input
                    id="register-username"
                    name="username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        username: e.target.value,
                      })
                    }
                    required
                    minLength={3}
                    className="block w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
                  />
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                    Mínimo 3 caracteres
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="register-password"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Contraseña
                  </Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                    className="block w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
                  />
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                    Mínimo 6 caracteres
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Confirmar Contraseña
                  </Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="block w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 rounded-r-lg">
                    <p className="text-sm text-red-900 dark:text-red-100 font-medium">
                      {error}
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Registrando...
                      </div>
                    ) : (
                      "Crear Cuenta"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-500 max-w-xs">
            Al continuar, aceptas nuestros{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              Términos de Servicio
            </a>{" "}
            y{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              Política de Privacidad
            </a>
            .
          </p>
        </div>

        <div className="h-8 md:h-12"></div>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex w-1/2 bg-[#0a1120] relative items-center justify-center p-12 overflow-hidden">
        {/* Animated blur effects */}
        <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Transforma tu Salud con{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Inteligencia Artificial
            </span>
          </h2>
          <p className="text-lg text-slate-300 mb-12 leading-relaxed">
            Evaluaciones personalizadas que se adaptan a tus necesidades únicas
            para un estilo de vida más saludable.
          </p>

          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">
                  Análisis Completo
                </h3>
                <p className="mt-1 text-slate-400 text-sm">
                  Evaluamos cada aspecto de tu bienestar físico y mental con
                  precisión.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">
                  Planes Personalizados
                </h3>
                <p className="mt-1 text-slate-400 text-sm">
                  Recomendaciones únicas basadas en IA adaptadas a tu perfil.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">
                  Seguimiento Continuo
                </h3>
                <p className="mt-1 text-slate-400 text-sm">
                  Monitorea tu progreso en tiempo real y ajusta tus metas
                  fácilmente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
