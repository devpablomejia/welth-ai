"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Brain,
  TrendingUp,
  Sparkles,
  Check,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-sm text-gray-900"
            : "bg-white text-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/landing"
              className="flex items-center space-x-3 text-gray-900 hover:opacity-80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-lg px-2 py-1 -ml-2"
            >
              <Image
                src="/images/logo.jpg"
                alt="WelthIA Logo"
                width={40}
                height={40}
                className="rounded-lg transition-transform duration-200 hover:scale-110"
              />
              <span className="text-2xl font-bold">WelthIA</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/auth">
                <Button variant="outline" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="sm">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-900 hover:bg-gray-100 active:bg-gray-200 rounded-lg p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 transition-transform duration-200 rotate-0 hover:rotate-90" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-blue-900 hover:bg-gray-200 hover:scale-105 transition-all duration-300 cursor-default">
              <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
              IA Personalizada para tu Bienestar
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Tu Asistente de
              <br />
              <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                Salud Integral
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Evaluaciones personalizadas impulsadas por IA que transforman tus
              datos de salud en planes de hábitos efectivos y sostenibles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="text-lg px-4 h-12 outline outline-black w-fit hover:scale-105 transition-transform duration-300"
                >
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-black text-white border-0 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl">
            <CardContent className="relative py-16 text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Comienza tu Transformación Hoy
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Únete a miles de personas que ya están mejorando su salud con
                WelthIA
              </p>
              <Link href="/auth">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 h-12 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 ring-2 hover:bg-white hover:text-black hover:cursor-pointer ring-white focus:ring-white/30 mt-7"
                >
                  Crear Cuenta Gratis
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer">
                <Brain className="h-6 w-6" />
                <span className="text-xl font-bold">WelthIA</span>
              </div>
              <p className="text-sm text-gray-600">
                Tu asistente inteligente para una vida más saludable.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a
                    href="#features"
                    className="hover:text-gray-900 transition-all duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-gray-400 rounded px-1"
                  >
                    Características
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-gray-900 transition-all duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-gray-400 rounded px-1"
                  >
                    Precios
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-all duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-gray-400 rounded px-1"
                  >
                    Actualizaciones
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Acerca de
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Términos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-gray-600">
            <p>© 2025 WelthIA. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center space-y-2">
      <div className="text-4xl font-bold">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="group border-2 hover:border-black hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer focus-within:ring-4 focus-within:ring-gray-300 focus-within:ring-offset-2">
      <CardHeader>
        <div className="mb-4 text-gray-700 group-hover:text-black transition-colors duration-300 group-hover:scale-110 transform-gpu">
          {icon}
        </div>
        <CardTitle className="text-xl group-hover:text-black transition-colors duration-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative p-6 rounded-xl transition-all duration-300 hover:bg-gray-50 hover:shadow-lg cursor-default">
      <div className="text-6xl font-bold text-gray-100 group-hover:text-gray-200 mb-4 transition-all duration-300 group-hover:scale-110 transform-gpu">
        {number}
      </div>
      <h3 className="text-2xl font-bold mb-2 group-hover:text-black transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
        {description}
      </p>
    </div>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-black flex items-center justify-center">
        <Check className="h-3 w-3 text-white" />
      </div>
      <span className="text-gray-700">{text}</span>
    </li>
  );
}
