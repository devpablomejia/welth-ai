"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  AssessmentRequest,
  UserSex,
  ActivityLevel,
  EndOfDayFeeling,
  AlcoholFrequency,
} from "@/app/types/assessment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Moon,
  Utensils,
  Activity,
  Heart,
  Cigarette,
  Loader2,
  CheckCircle,
} from "lucide-react";

const STEPS = [
  {
    id: 1,
    title: "Información Personal",
    description: "Datos básicos de salud",
    icon: User,
  },
  {
    id: 2,
    title: "Patrones de Sueño",
    description: "Horarios y calidad de descanso",
    icon: Moon,
  },
  {
    id: 3,
    title: "Alimentación",
    description: "Hábitos alimenticios e hidratación",
    icon: Utensils,
  },
  {
    id: 4,
    title: "Actividad Física",
    description: "Nivel de ejercicio y movimiento",
    icon: Activity,
  },
  {
    id: 5,
    title: "Bienestar General",
    description: "Estrés, energía y motivación",
    icon: Heart,
  },
  {
    id: 6,
    title: "Hábitos",
    description: "Alcohol y tabaco",
    icon: Cigarette,
  },
];

export default function EvaluationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<Partial<AssessmentRequest>>({
    age: undefined,
    weightKg: undefined,
    heightM: undefined,
    userSex: "MALE" as UserSex,
    wakeTime: "00:00",
    sleepTime: "00:00",
    breakfastTime: "00:00",
    lunchTime: "00:00",
    dinnerTime: "00:00",
    waterCupsDay: undefined,
    wakeDifficulty: 5,
    nightAwakenings: 0,
    sleepRepairScore: 5,
    sleepOnsetScore: 5,
    activityLevel: "SEDENTARY" as ActivityLevel,
    exerciseFrequencyPerWeek: 0,
    stressLevel: 5,
    endOfDayFeeling: "NEUTRAL" as EndOfDayFeeling,
    wellbeingScore: 5,
    readinessChange: 5,
    confidenceChange: 5,
    drinksAlcohol: false,
    alcoholFrequency: "NEVER" as AlcoholFrequency,
    smokesTobacco: false,
    tobaccoUnitsPerDay: 0,
    fruitServingsDay: 0,
    vegetableServingsDay: 0,
    processedFoodWeek: 0,
  });

  const updateField = (
    field: keyof AssessmentRequest,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.age &&
          formData.weightKg &&
          formData.heightM &&
          formData.userSex
        );
      case 2:
        return !!(
          formData.wakeTime &&
          formData.sleepTime &&
          formData.wakeDifficulty !== undefined &&
          formData.nightAwakenings !== undefined &&
          formData.sleepRepairScore !== undefined &&
          formData.sleepOnsetScore !== undefined
        );
      case 3:
        return !!(
          formData.breakfastTime &&
          formData.lunchTime &&
          formData.dinnerTime &&
          formData.waterCupsDay !== undefined &&
          formData.fruitServingsDay !== undefined &&
          formData.vegetableServingsDay !== undefined &&
          formData.processedFoodWeek !== undefined
        );
      case 4:
        return !!(
          formData.activityLevel &&
          formData.exerciseFrequencyPerWeek !== undefined
        );
      case 5:
        return !!(
          formData.stressLevel !== undefined &&
          formData.endOfDayFeeling &&
          formData.wellbeingScore !== undefined &&
          formData.readinessChange !== undefined &&
          formData.confidenceChange !== undefined
        );
      case 6:
        return true; // All fields have defaults
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }
    setError("");
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setError("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    setError("");

    const assessment: AssessmentRequest = {
      ...formData,
    } as AssessmentRequest;

    try {
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al generar el plan");
      }

      // Redirect to tracking page to see results
      router.push("/dashboard/tracking");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Edad *</Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age || ""}
                  onChange={(e) => updateField("age", Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userSex">Sexo *</Label>
                <Select
                  id="userSex"
                  value={formData.userSex}
                  onChange={(e) =>
                    updateField("userSex", e.target.value as UserSex)
                  }
                >
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Femenino</option>
                  <option value="OTHER">Otro</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightKg">Peso (kg) *</Label>
                <Input
                  id="weightKg"
                  type="number"
                  step="0.1"
                  min="1"
                  value={formData.weightKg || ""}
                  onChange={(e) =>
                    updateField("weightKg", Number(e.target.value))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heightM">Altura (m) *</Label>
                <Input
                  id="heightM"
                  type="number"
                  step="0.01"
                  min="0.5"
                  max="2.5"
                  placeholder="1.75"
                  value={formData.heightM || ""}
                  onChange={(e) =>
                    updateField("heightM", Number(e.target.value))
                  }
                  required
                />
              </div>
            </div>
            {formData.weightKg && formData.heightM && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-4 rounded-r-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
                  <strong>IMC:</strong>{" "}
                  {(
                    formData.weightKg /
                    (formData.heightM * formData.heightM)
                  ).toFixed(1)}
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg flex items-start gap-3">
              <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium leading-relaxed">
                El sueño es fundamental para tu salud. Comparte tus horarios
                habituales y cómo te sientes al despertar.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <TimePicker
                  id="wakeTime"
                  label="Hora habitual de despertar"
                  value={formData.wakeTime || "00:00"}
                  onChange={(value) => updateField("wakeTime", value)}
                  required
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  ¿A qué hora sueles levantarte entre semana?
                </p>
              </div>

              <div className="space-y-2">
                <TimePicker
                  id="sleepTime"
                  label="Hora habitual de dormir"
                  value={formData.sleepTime || "00:00"}
                  onChange={(value) => updateField("sleepTime", value)}
                  required
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  ¿A qué hora te acuestas normalmente?
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wakeDifficulty" className="text-sm font-medium">
                  ¿Qué tan difícil te resulta despertar? *
                </Label>
                <Input
                  id="wakeDifficulty"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="5"
                  value={formData.wakeDifficulty}
                  onChange={(e) =>
                    updateField("wakeDifficulty", Number(e.target.value))
                  }
                  className="h-11"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  1-3: Despiertas fácilmente
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1 ml-2"></span>
                  4-6: Normal
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1 ml-2"></span>
                  7-10: Muy difícil
                </p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="nightAwakenings"
                  className="text-sm font-medium"
                >
                  Despertares durante la noche *
                </Label>
                <Input
                  id="nightAwakenings"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.nightAwakenings}
                  onChange={(e) =>
                    updateField("nightAwakenings", Number(e.target.value))
                  }
                  className="h-11"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  ¿Cuántas veces te despiertas en promedio?
                </p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="sleepRepairScore"
                  className="text-sm font-medium"
                >
                  ¿Qué tan reparador es tu sueño? *
                </Label>
                <Input
                  id="sleepRepairScore"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="5"
                  value={formData.sleepRepairScore}
                  onChange={(e) =>
                    updateField("sleepRepairScore", Number(e.target.value))
                  }
                  className="h-11"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  1-3: Siento que no descansé • 4-6: Moderado • 7-10: Me siento
                  renovado
                </p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="sleepOnsetScore"
                  className="text-sm font-medium"
                >
                  ¿Qué tan rápido te duermes? *
                </Label>
                <Input
                  id="sleepOnsetScore"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="5"
                  value={formData.sleepOnsetScore}
                  onChange={(e) =>
                    updateField("sleepOnsetScore", Number(e.target.value))
                  }
                  className="h-11"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  1-3: Tardo mucho • 4-6: Tiempo normal • 7-10: Me duermo
                  rápidamente
                </p>
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg flex items-start gap-3">
              <Utensils className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium leading-relaxed">
                Tus hábitos alimenticios son clave. Cuéntanos sobre tus horarios
                de comida y consumo de agua.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <TimePicker
                  id="breakfastTime"
                  label="Hora habitual de desayuno"
                  value={formData.breakfastTime || "00:00"}
                  onChange={(value) => updateField("breakfastTime", value)}
                  required
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Tu primera comida del día
                </p>
              </div>

              <div className="space-y-2">
                <TimePicker
                  id="lunchTime"
                  label="Hora habitual de almuerzo"
                  value={formData.lunchTime || "00:00"}
                  onChange={(value) => updateField("lunchTime", value)}
                  required
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Tu comida principal del mediodía
                </p>
              </div>

              <div className="space-y-2">
                <TimePicker
                  id="dinnerTime"
                  label="Hora habitual de cena"
                  value={formData.dinnerTime || "00:00"}
                  onChange={(value) => updateField("dinnerTime", value)}
                  required
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Tu última comida del día
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="waterCupsDay"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Vasos de agua diarios (250ml c/u) *
                </Label>
                <Input
                  id="waterCupsDay"
                  type="number"
                  min="0"
                  placeholder="8"
                  value={formData.waterCupsDay || ""}
                  onChange={(e) =>
                    updateField("waterCupsDay", Number(e.target.value))
                  }
                  className="h-11"
                  required
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Recomendado: 8 vasos (2 litros) al día
                </p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="fruitServingsDay"
                  className="text-sm font-medium"
                >
                  Porciones de fruta al día *
                </Label>
                <Input
                  id="fruitServingsDay"
                  type="number"
                  min="0"
                  placeholder="2"
                  value={formData.fruitServingsDay}
                  onChange={(e) =>
                    updateField("fruitServingsDay", Number(e.target.value))
                  }
                  className="h-11"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  1 porción = 1 manzana, plátano o taza de fresas
                </p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="vegetableServingsDay"
                  className="text-sm font-medium"
                >
                  Porciones de vegetales al día *
                </Label>
                <Input
                  id="vegetableServingsDay"
                  type="number"
                  min="0"
                  placeholder="3"
                  value={formData.vegetableServingsDay}
                  onChange={(e) =>
                    updateField("vegetableServingsDay", Number(e.target.value))
                  }
                  className="h-11"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  1 porción = 1 taza de ensalada o 1/2 taza cocidos
                </p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="processedFoodWeek"
                  className="text-sm font-medium"
                >
                  Comidas procesadas por semana *
                </Label>
                <Input
                  id="processedFoodWeek"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.processedFoodWeek}
                  onChange={(e) =>
                    updateField("processedFoodWeek", Number(e.target.value))
                  }
                  className="h-11"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Comida rápida, snacks, empaquetados, etc.
                </p>
              </div>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg flex items-start gap-3">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium leading-relaxed">
                La actividad física es esencial. Ayúdanos a entender tu nivel de
                movimiento diario y ejercicio.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="activityLevel" className="text-sm font-medium">
                  Nivel de actividad diaria *
                </Label>
                <Select
                  id="activityLevel"
                  value={formData.activityLevel}
                  onChange={(e) =>
                    updateField(
                      "activityLevel",
                      e.target.value as ActivityLevel
                    )
                  }
                  className="h-11"
                >
                  <option value="SEDENTARY">
                    Sedentario (oficina, poco movimiento)
                  </option>
                  <option value="LIGHTLY_ACTIVE">
                    Ligeramente activo (caminas ocasionalmente)
                  </option>
                  <option value="MODERATELY_ACTIVE">
                    Moderadamente activo (ejercicio 3-5 días/semana)
                  </option>
                  <option value="VERY_ACTIVE">
                    Muy activo (ejercicio intenso 6-7 días)
                  </option>
                  <option value="EXTREMELY_ACTIVE">
                    Extremadamente activo (atleta/trabajo físico)
                  </option>
                </Select>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Considera tu actividad en un día típico
                </p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="exerciseFrequencyPerWeek"
                  className="text-sm font-medium"
                >
                  Días de ejercicio por semana *
                </Label>
                <Input
                  id="exerciseFrequencyPerWeek"
                  type="number"
                  min="0"
                  max="7"
                  placeholder="3"
                  value={formData.exerciseFrequencyPerWeek}
                  onChange={(e) =>
                    updateField(
                      "exerciseFrequencyPerWeek",
                      Number(e.target.value)
                    )
                  }
                  className="h-11"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Ejercicio intencional de al menos 30 minutos (gym, running,
                  deporte, etc.)
                </p>
              </div>
            </div>
          </>
        );

      case 5:
        return (
          <>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg flex items-start gap-3">
              <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium leading-relaxed">
                Tu bienestar emocional es tan importante como el físico.
                Compártenos cómo te sientes.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="stressLevel" className="text-sm font-medium">
                  ¿Cuánto estrés sientes? *
                </Label>
                <Input
                  id="stressLevel"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="5"
                  value={formData.stressLevel}
                  onChange={(e) =>
                    updateField("stressLevel", Number(e.target.value))
                  }
                  className="h-11"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  1-3: Relajado
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1 ml-2"></span>
                  4-6: Moderado
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1 ml-2"></span>
                  7-10: Alto estrés
                </p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="endOfDayFeeling"
                  className="text-sm font-medium"
                >
                  ¿Cómo terminas tu día normalmente? *
                </Label>
                <Select
                  id="endOfDayFeeling"
                  value={formData.endOfDayFeeling}
                  onChange={(e) =>
                    updateField(
                      "endOfDayFeeling",
                      e.target.value as EndOfDayFeeling
                    )
                  }
                  className="h-11"
                >
                  <option value="EXHAUSTED">
                    Exhausto (completamente agotado)
                  </option>
                  <option value="TIRED">Cansado (necesito descansar)</option>
                  <option value="NEUTRAL">Neutral (energía normal)</option>
                  <option value="ENERGETIC">
                    Energético (aún con energía)
                  </option>
                  <option value="VERY_ENERGETIC">
                    Muy energético (podría hacer más)
                  </option>
                </Select>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Piensa en cómo te sientes al final de un día típico
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wellbeingScore" className="text-sm font-medium">
                  ¿Cómo calificarías tu bienestar general? *
                </Label>
                <Input
                  id="wellbeingScore"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="7"
                  value={formData.wellbeingScore}
                  onChange={(e) =>
                    updateField("wellbeingScore", Number(e.target.value))
                  }
                  className="h-11"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Considera tu salud física, mental y emocional en conjunto
                </p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="readinessChange"
                  className="text-sm font-medium"
                >
                  ¿Qué tan listo estás para cambiar hábitos? *
                </Label>
                <Input
                  id="readinessChange"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="8"
                  value={formData.readinessChange}
                  onChange={(e) =>
                    updateField("readinessChange", Number(e.target.value))
                  }
                  className="h-11"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  1: No estoy listo • 5: Pensando en ello • 10: Muy motivado
                  para cambiar
                </p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confidenceChange"
                  className="text-sm font-medium"
                >
                  ¿Qué tan seguro estás de poder lograrlo? *
                </Label>
                <Input
                  id="confidenceChange"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="7"
                  value={formData.confidenceChange}
                  onChange={(e) =>
                    updateField("confidenceChange", Number(e.target.value))
                  }
                  className="h-11"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  1: Muy inseguro • 5: Moderadamente seguro • 10: Totalmente
                  confiado
                </p>
              </div>
            </div>
          </>
        );

      case 6:
        return (
          <>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg flex items-start gap-3">
              <Cigarette className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium leading-relaxed">
                Información confidencial sobre alcohol y tabaco. Tus respuestas
                nos ayudan a darte mejores recomendaciones.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="drinksAlcohol" className="text-sm font-medium">
                  ¿Consumes alcohol? *
                </Label>
                <Select
                  id="drinksAlcohol"
                  value={formData.drinksAlcohol ? "true" : "false"}
                  onChange={(e) =>
                    updateField("drinksAlcohol", e.target.value === "true")
                  }
                  className="h-11"
                >
                  <option value="false">No consumo alcohol</option>
                  <option value="true">Sí, consumo alcohol</option>
                </Select>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Selecciona con honestidad, es confidencial
                </p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="alcoholFrequency"
                  className="text-sm font-medium"
                >
                  Frecuencia de consumo de alcohol *
                </Label>
                <Select
                  id="alcoholFrequency"
                  value={formData.alcoholFrequency}
                  onChange={(e) =>
                    updateField(
                      "alcoholFrequency",
                      e.target.value as AlcoholFrequency
                    )
                  }
                  disabled={!formData.drinksAlcohol}
                  className="h-11"
                >
                  <option value="NEVER">Nunca</option>
                  <option value="RARELY">Rara vez (1-2 veces al mes)</option>
                  <option value="OCCASIONALLY">
                    Ocasionalmente (1 vez/semana)
                  </option>
                  <option value="WEEKLY">
                    Semanalmente (2-4 veces/semana)
                  </option>
                  <option value="DAILY">Diariamente</option>
                </Select>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {formData.drinksAlcohol
                    ? "Cuéntanos con qué frecuencia"
                    : "Deshabilitado porque no consumes"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smokesTobacco" className="text-sm font-medium">
                  ¿Fumas o vapeas? *
                </Label>
                <Select
                  id="smokesTobacco"
                  value={formData.smokesTobacco ? "true" : "false"}
                  onChange={(e) =>
                    updateField("smokesTobacco", e.target.value === "true")
                  }
                  className="h-11"
                >
                  <option value="false">No fumo</option>
                  <option value="true">Sí, fumo o vapeo</option>
                </Select>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Incluye cigarrillos, vaper, puros, etc.
                </p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="tobaccoUnitsPerDay"
                  className="text-sm font-medium"
                >
                  Cigarrillos/vapes por día *
                </Label>
                <Input
                  id="tobaccoUnitsPerDay"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.tobaccoUnitsPerDay}
                  onChange={(e) =>
                    updateField("tobaccoUnitsPerDay", Number(e.target.value))
                  }
                  disabled={!formData.smokesTobacco}
                  className="h-11"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {formData.smokesTobacco
                    ? "Cantidad promedio diaria"
                    : "Deshabilitado porque no fumas"}
                </p>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Evaluación de Salud
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Paso {currentStep} de {STEPS.length}
        </p>
        {/* Progress Bar */}
        <div className="w-full max-w-xs mx-auto h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Visual Stepper */}
      <div className="flex justify-between items-start w-full max-w-4xl mx-auto relative px-4">
        {/* Connection Line */}
        <div className="absolute top-6 left-0 right-0 mx-auto w-[calc(100%-8rem)] h-0.5 bg-slate-200 dark:bg-slate-700 z-[1] hidden md:block"></div>

        {STEPS.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex flex-col items-center gap-2 relative z-2 ${
                !isCompleted && !isCurrent
                  ? "opacity-90 cursor-not-allowed"
                  : "cursor-pointer"
              } ${
                !isCurrent && isCompleted ? "group hover:opacity-100" : ""
              } transition-opacity`}
              onClick={() => isCompleted && setCurrentStep(step.id)}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all relative ${
                  isCompleted
                    ? "bg-primary text-white shadow-lg shadow-blue-500/20 group-hover:scale-105"
                    : isCurrent
                    ? "bg-white dark:bg-primary border-2 border-primary text-white shadow-lg shadow-blue-500/10 ring-4 ring-blue-50 dark:ring-blue-900/20"
                    : "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <StepIcon className="w-6 h-6" />
                )}
              </div>
              <span
                className={`text-xs font-${
                  isCurrent ? "bold" : isCompleted ? "semibold" : "medium"
                } text-center w-20 ${
                  isCompleted || isCurrent
                    ? "text-primary dark:text-blue-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {step.title.split(" ").map((word, i) => (
                  <span key={i}>
                    {word}
                    <br />
                  </span>
                ))}
              </span>
            </div>
          );
        })}
      </div>

      {/* Card del contenido */}
      <Card className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden animate-slide-up">
        <CardHeader className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700/50">
          <div className="flex items-start gap-4">
            <div className="bg-primary rounded-lg p-2.5 text-white shadow-md shadow-blue-500/20">
              {(() => {
                const StepIcon = STEPS[currentStep - 1].icon;
                return <StepIcon className="w-6 h-6" strokeWidth={2} />;
              })()}
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                {STEPS[currentStep - 1].title}
              </CardTitle>
              <CardDescription className="text-sm mt-0.5 text-slate-500 dark:text-slate-400">
                {STEPS[currentStep - 1].description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          {/* Step Content */}
          <div className="space-y-8">{renderStepContent()}</div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3 animate-slide-down">
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-900 dark:text-red-100 font-medium">
                {error}
              </p>
            </div>
          )}
        </CardContent>

        {/* Navigation Buttons */}
        <div className="px-6 py-5 md:px-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700/50 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            className="w-full md:w-auto px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-primary transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Anterior
          </Button>
          {currentStep < STEPS.length ? (
            <Button
              onClick={handleNext}
              disabled={loading}
              className="w-full md:w-auto px-8 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all group"
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full md:w-auto px-8 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all group"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Generando plan...
                </>
              ) : (
                <>
                  Generar Plan
                  <CheckCircle className="w-4 h-4 ml-2 transition-transform group-hover:scale-110" />
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
