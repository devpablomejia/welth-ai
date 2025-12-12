"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, ArrowLeft } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = authService.login(loginData.username, loginData.password);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    const result = authService.register(
      registerData.username,
      registerData.password
    );

    if (result.success) {
      authService.login(registerData.username, registerData.password);
      router.push("/dashboard");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <Link
              href="/landing"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Image
                src="/images/logo.jpg"
                alt="WelthIA Logo"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <span className="text-3xl font-bold">WelthIA</span>
            </div>
            <h1 className="text-2xl font-bold">Bienvenido</h1>
            <p className="text-gray-600">
              Accede a tu asistente de salud personalizado
            </p>
          </div>

          <Card className="border-2 shadow-lg">
            <CardContent className="pt-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    Iniciar Sesión
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    Registrarse
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="login"
                  className="space-y-4 animate-slide-up"
                >
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Usuario</Label>
                      <Input
                        id="login-username"
                        placeholder="usuario"
                        value={loginData.username}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            username: e.target.value,
                          })
                        }
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Contraseña</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        required
                        className="h-11"
                      />
                    </div>
                    {error && (
                      <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                        {error}
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="w-full h-11 bg-black text-white hover:bg-gray-800 transition-colors"
                      disabled={loading}
                    >
                      {loading ? "Ingresando..." : "Iniciar Sesión"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent
                  value="register"
                  className="space-y-4 animate-slide-up"
                >
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Usuario</Label>
                      <Input
                        id="register-username"
                        placeholder="usuario"
                        value={registerData.username}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            username: e.target.value,
                          })
                        }
                        required
                        minLength={3}
                        className="h-11"
                      />
                      <p className="text-xs text-gray-500">
                        Mínimo 3 caracteres
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Contraseña</Label>
                      <Input
                        id="register-password"
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
                        className="h-11"
                      />
                      <p className="text-xs text-gray-500">
                        Mínimo 6 caracteres
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirmar Contraseña
                      </Label>
                      <Input
                        id="confirm-password"
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
                        className="h-11"
                      />
                    </div>
                    {error && (
                      <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                        {error}
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="w-full h-11 text-white bg-black hover:bg-gray-800 transition-colors"
                      disabled={loading}
                    >
                      {loading ? "Registrando..." : "Crear Cuenta"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-gray-600">
            Al continuar, aceptas nuestros{" "}
            <a href="#" className="underline hover:text-gray-900">
              Términos de Servicio
            </a>{" "}
            y{" "}
            <a href="#" className="underline hover:text-gray-900">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Hero Image/Gradient */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-black items-center justify-center p-12 animate-fade-in">
        <div className="max-w-md space-y-6 text-white">
          <h2 className="text-4xl font-bold">
            Transforma tu Salud con Inteligencia Artificial
          </h2>
          <p className="text-xl text-gray-300">
            Evaluaciones personalizadas que se adaptan a tus necesidades únicas.
          </p>
          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold mb-1">Análisis Completo</h3>
                <p className="text-gray-400">
                  Evaluamos cada aspecto de tu bienestar
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold mb-1">Planes Personalizados</h3>
                <p className="text-gray-400">
                  Recomendaciones únicas basadas en IA
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold mb-1">Seguimiento Continuo</h3>
                <p className="text-gray-400">
                  Monitorea tu progreso en tiempo real
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
