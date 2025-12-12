"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";
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
    const userId = authService.getCurrentUserId();
    if (!userId) {
      setError("Usuario no autenticado");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/plans?userId=${userId}`);

      if (!response.ok) {
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
            <CardTitle className="text-2xl">No hay evaluaciones previas</CardTitle>
            <CardDescription className="text-base">
              Realiza una evaluación para recibir tu plan personalizado de hábitos
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <Button 
              onClick={() => router.push("/dashboard/evaluation")}
              size="lg"
              className="bg-black hover:bg-gray-800"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
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
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header Summary Card */}
      <Card className="border-2 shadow-lg bg-gradient-to-br from-gray-50 to-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">
                Tu Plan de Hábitos Personalizado
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2 text-base">
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
              className="border-2"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Nueva Evaluación
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 text-lg">{plan.summary}</p>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Hábitos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold">{plan.habits.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Alta Prioridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-red-600" />
              <span className="text-3xl font-bold text-red-600">
                {highPriorityHabits.length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Última Actualización
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-green-600" />
              <span className="text-lg font-semibold">
                {new Date(plan.createdAt).toLocaleDateString("es")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Priority Habits */}
      {highPriorityHabits.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
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
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
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
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
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
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getBorderColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <Card className={`border-l-4 ${getBorderColor(habit.priority)}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{habit.title}</CardTitle>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityBadgeColor(
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
        <p className="text-gray-700">{habit.description}</p>

        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-200">
            📁 {habit.category}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm border border-purple-200">
            📅 {habit.frequency}
          </span>
          {habit.timeOfDay && (
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm border border-orange-200">
              🕐 {habit.timeOfDay}
            </span>
          )}
        </div>

        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong className="text-gray-900">💡 Por qué es importante:</strong>{" "}
            {habit.reasoning}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
