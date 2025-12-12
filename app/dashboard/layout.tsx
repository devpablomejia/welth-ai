"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ClipboardList, TrendingUp, LogOut, User, Brain } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [username] = useState(() => {
    if (typeof window === "undefined") return "";
    const user = authService.getCurrentUser();
    return user?.username || "";
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/auth");
    }
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push("/landing");
  };

  const navItems = [
    {
      href: "/dashboard/evaluation",
      label: "Nueva Evaluación",
      icon: ClipboardList,
    },
    {
      href: "/dashboard/tracking",
      label: "Seguimiento",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/images/logo.jpg"
                alt="WelthIA Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold">WelthIA</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium" suppressHydrationWarning>
                  {username}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-gray-300 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-4 border-b-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
