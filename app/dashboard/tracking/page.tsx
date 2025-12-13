"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { HabitPlan, Habit } from "@/app/types/assessment";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardList, TrendingUp, Calendar, Target } from "lucide-react";

export default function TrackingPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<HabitPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      const response = await fetch(`/api/plans`);

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth");
          return;
        }
        if (response.status === 404) {
          setError("No hay evaluaciones previas");
        } else {
          throw new Error("Error al cargar el plan");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50";
      case "medium":
        return "border-yellow-500 bg-yellow-50";
      case "low":
        return "border-green-500 bg-green-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
          <p className="text-gray-600">Cargando plan de hábitos...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="max-w-2xl mx-auto animate-slide-up">
        <Card className="border-2">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="h-8 w-8 text-gray-400" />
            </div>
            <CardTitle className="text-2xl">
              No hay evaluaciones previas
            </CardTitle>
            <CardDescription className="text-base">
              Realiza una evaluación para recibir tu plan personalizado de
              hábitos
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <Button
              className="bg-black hover:bg-gray-800 text-white"
              onClick={() => router.push("/dashboard/evaluation")}
              size="lg"
            >
              <ClipboardList className="w-4 h-4 mr-2 text-white" />
              Realizar Evaluación
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const highPriorityHabits = plan.habits.filter((h) => h.priority === "high");
  const mediumPriorityHabits = plan.habits.filter(
    (h) => h.priority === "medium"
  );
  const lowPriorityHabits = plan.habits.filter((h) => h.priority === "low");

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header Summary Card */}
      <Card className="border-2 border-slate-100 dark:border-slate-700/50 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Tu Plan de Hábitos Personalizado
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base font-medium">
                Generado el{" "}
                {new Date(plan.createdAt).toLocaleDateString("es", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/evaluation")}
              className="border-2 border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 hover:border-blue-600 transition-all w-full sm:w-auto"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Nueva Evaluación
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            {plan.summary}
          </p>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="border-2 border-slate-100 dark:border-slate-700/50 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all rounded-xl">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400">
              Total de Hábitos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 sm:gap-3">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {plan.habits.length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-100 dark:border-slate-700/50 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all rounded-xl">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400">
              Alta Prioridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400" />
              <span className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
                {highPriorityHabits.length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-100 dark:border-slate-700/50 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all rounded-xl sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400">
              Última Actualización
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
              <span className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                {new Date(plan.createdAt).toLocaleDateString("es")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Priority Habits */}
      {highPriorityHabits.length > 0 && (
        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
            Hábitos de Alta Prioridad
          </h2>
          <div className="space-y-4">
            {highPriorityHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        </div>
      )}

      {/* Medium Priority Habits */}
      {mediumPriorityHabits.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            Hábitos de Media Prioridad
          </h2>
          <div className="space-y-4">
            {mediumPriorityHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        </div>
      )}

      {/* Low Priority Habits */}
      {lowPriorityHabits.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Hábitos de Baja Prioridad
          </h2>
          <div className="space-y-4">
            {lowPriorityHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HabitCard({ habit }: { habit: Habit }) {
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      case "low":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600";
    }
  };

  const getBorderColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 dark:border-l-red-400";
      case "medium":
        return "border-l-yellow-500 dark:border-l-yellow-400";
      case "low":
        return "border-l-green-500 dark:border-l-green-400";
      default:
        return "border-l-gray-500 dark:border-l-slate-500";
    }
  };

  return (
    <Card
      className={`border-l-4 ${getBorderColor(
        habit.priority
      )} border border-slate-100 dark:border-slate-700/50 rounded-xl shadow-sm hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
              {habit.title}
            </CardTitle>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityBadgeColor(
              habit.priority
            )}`}
          >
            {habit.priority === "high"
              ? "Alta Prioridad"
              : habit.priority === "medium"
              ? "Media Prioridad"
              : "Baja Prioridad"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {habit.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm border border-blue-200 dark:border-blue-800 font-medium">
            📁 {habit.category}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded-full text-sm border border-purple-200 dark:border-purple-800 font-medium">
            📅 {habit.frequency}
          </span>
          {habit.timeOfDay && (
            <span className="px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 rounded-full text-sm border border-orange-200 dark:border-orange-800 font-medium">
              🕐 {habit.timeOfDay}
            </span>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white">
              💡 Por qué es importante:
            </strong>{" "}
            {habit.reasoning}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
