"use client";

import { useState } from "react";
import type {
  AssessmentRequest,
  UserSex,
  ActivityLevel,
  EndOfDayFeeling,
  AlcoholFrequency,
  HabitPlan,
} from "@/app/types/assessment";

export default function AssessmentForm() {
  const [loading, setLoading] = useState(false);
  const [habitPlan, setHabitPlan] = useState<HabitPlan | null>(null);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setHabitPlan(null);

    const formData = new FormData(e.currentTarget);

    const assessment: AssessmentRequest = {
      age: Number(formData.get("age")),
      weightKg: Number(formData.get("weightKg")),
      heightM: Number(formData.get("heightM")),
      userSex: formData.get("userSex") as UserSex,
      wakeTime: formData.get("wakeTime") as string,
      sleepTime: formData.get("sleepTime") as string,
      breakfastTime: formData.get("breakfastTime") as string,
      lunchTime: formData.get("lunchTime") as string,
      dinnerTime: formData.get("dinnerTime") as string,
      waterCupsDay: Number(formData.get("waterCupsDay")),
      wakeDifficulty: Number(formData.get("wakeDifficulty")),
      nightAwakenings: Number(formData.get("nightAwakenings")),
      sleepRepairScore: Number(formData.get("sleepRepairScore")),
      sleepOnsetScore: Number(formData.get("sleepOnsetScore")),
      activityLevel: formData.get("activityLevel") as ActivityLevel,
      exerciseFrequencyPerWeek: Number(
        formData.get("exerciseFrequencyPerWeek")
      ),
      stressLevel: Number(formData.get("stressLevel")),
      endOfDayFeeling: formData.get("endOfDayFeeling") as EndOfDayFeeling,
      wellbeingScore: Number(formData.get("wellbeingScore")),
      readinessChange: Number(formData.get("readinessChange")),
      confidenceChange: Number(formData.get("confidenceChange")),
      drinksAlcohol: formData.get("drinksAlcohol") === "true",
      alcoholFrequency: formData.get("alcoholFrequency") as AlcoholFrequency,
      smokesTobacco: formData.get("smokesTobacco") === "true",
      tobaccoUnitsPerDay: Number(formData.get("tobaccoUnitsPerDay")),
      fruitServingsDay: Number(formData.get("fruitServingsDay")),
      vegetableServingsDay: Number(formData.get("vegetableServingsDay")),
      processedFoodWeek: Number(formData.get("processedFoodWeek")),
    };

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

      const plan: HabitPlan = await response.json();
      setHabitPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Evaluación de Salud y Bienestar
        </h1>
        <p className="text-gray-600 text-lg">
          Completa esta evaluación para recibir tu plan personalizado de hábitos
          saludables
        </p>
      </div>

      {!habitPlan ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <section className="group bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">
                1
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Información Personal
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Edad
                </label>
                <input
                  type="number"
                  name="age"
                  required
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="Ej: 30"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  max={200}
                  min={1}
                  name="weightKg"
                  required
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="Ej: 70.5"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Altura (m)
                </label>
                <input
                  type="number"
                  name="heightM"
                  required
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="Ej: 1.75"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Sexo
                </label>
                <select
                  name="userSex"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300 bg-white cursor-pointer"
                >
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Femenino</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>
            </div>
          </section>

          {/* Patrones de Sueño */}
          <section className="group bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">
                2
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Patrones de Sueño
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Hora de Despertar
                </label>
                <input
                  type="time"
                  name="wakeTime"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Hora de Dormir
                </label>
                <input
                  type="time"
                  name="sleepTime"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Dificultad para Despertar (1-10)
                </label>
                <input
                  type="number"
                  name="wakeDifficulty"
                  required
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="1-10"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Despertares Nocturnos
                </label>
                <input
                  type="number"
                  name="nightAwakenings"
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="Ej: 2"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Calidad de Sueño Reparador (1-10)
                </label>
                <input
                  type="number"
                  name="sleepRepairScore"
                  required
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="1-10"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Facilidad para Conciliar Sueño (1-10)
                </label>
                <input
                  type="number"
                  name="sleepOnsetScore"
                  required
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="1-10"
                />
              </div>
            </div>
          </section>

          {/* Alimentación */}
          <section className="group bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">
                3
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Alimentación</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Hora de Desayuno
                </label>
                <input
                  type="time"
                  name="breakfastTime"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Hora de Almuerzo
                </label>
                <input
                  type="time"
                  name="lunchTime"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Hora de Cena
                </label>
                <input
                  type="time"
                  name="dinnerTime"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Vasos de Agua al Día
                </label>
                <input
                  type="number"
                  name="waterCupsDay"
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="Ej: 8"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Porciones de Fruta al Día
                </label>
                <input
                  type="number"
                  name="fruitServingsDay"
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="Ej: 3"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Porciones de Vegetales al Día
                </label>
                <input
                  type="number"
                  name="vegetableServingsDay"
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="Ej: 5"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Comida Procesada por Semana
                </label>
                <input
                  type="number"
                  name="processedFoodWeek"
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="Ej: 2"
                />
              </div>
            </div>
          </section>

          {/* Actividad Física */}
          <section className="group bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">
                4
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Actividad Física
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Nivel de Actividad
                </label>
                <select
                  name="activityLevel"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300 bg-white cursor-pointer"
                >
                  <option value="SEDENTARY">Sedentario</option>
                  <option value="LIGHTLY_ACTIVE">Ligeramente Activo</option>
                  <option value="MODERATELY_ACTIVE">
                    Moderadamente Activo
                  </option>
                  <option value="VERY_ACTIVE">Muy Activo</option>
                  <option value="EXTREMELY_ACTIVE">
                    Extremadamente Activo
                  </option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Frecuencia de Ejercicio por Semana
                </label>
                <input
                  type="number"
                  name="exerciseFrequencyPerWeek"
                  required
                  min="0"
                  max="7"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="0-7 días"
                />
              </div>
            </div>
          </section>

          {/* Bienestar General */}
          <section className="group bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">
                5
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Bienestar General
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Nivel de Estrés (1-10)
                </label>
                <input
                  type="number"
                  name="stressLevel"
                  required
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="1-10"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Sensación al Final del Día
                </label>
                <select
                  name="endOfDayFeeling"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300 bg-white cursor-pointer"
                >
                  <option value="EXHAUSTED">Exhausto</option>
                  <option value="TIRED">Cansado</option>
                  <option value="NEUTRAL">Neutral</option>
                  <option value="ENERGETIC">Energético</option>
                  <option value="VERY_ENERGETIC">Muy Energético</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Puntaje de Bienestar (1-10)
                </label>
                <input
                  type="number"
                  name="wellbeingScore"
                  required
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="1-10"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Disposición al Cambio (1-10)
                </label>
                <input
                  type="number"
                  name="readinessChange"
                  required
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="1-10"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Confianza en Cambiar (1-10)
                </label>
                <input
                  type="number"
                  name="confidenceChange"
                  required
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="1-10"
                />
              </div>
            </div>
          </section>

          {/* Hábitos */}
          <section className="group bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">
                6
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Hábitos</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  ¿Consume Alcohol?
                </label>
                <select
                  name="drinksAlcohol"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300 bg-white cursor-pointer"
                >
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Frecuencia de Alcohol
                </label>
                <select
                  name="alcoholFrequency"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300 bg-white cursor-pointer"
                >
                  <option value="NEVER">Nunca</option>
                  <option value="RARELY">Rara Vez</option>
                  <option value="OCCASIONALLY">Ocasionalmente</option>
                  <option value="WEEKLY">Semanalmente</option>
                  <option value="DAILY">Diariamente</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  ¿Fuma Tabaco?
                </label>
                <select
                  name="smokesTobacco"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300 bg-white cursor-pointer"
                >
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Unidades de Tabaco al Día
                </label>
                <input
                  type="number"
                  name="tobaccoUnitsPerDay"
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 transition-all duration-200 outline-none hover:border-gray-300"
                  placeholder="Ej: 0"
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-start gap-3 animate-slide-down">
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-black/20 text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generando Plan de Hábitos...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Generar Plan de Hábitos
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white p-8 rounded-2xl shadow-2xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-7 h-7"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-3">
                  ¡Tu Plan de Hábitos Personalizado está Listo!
                </h2>
                <p className="text-gray-200 text-lg leading-relaxed">
                  {habitPlan.summary}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300 mt-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span suppressHydrationWarning>
                Generado el:{" "}
                {new Date(habitPlan.createdAt).toLocaleDateString("es", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {habitPlan.habits.map((habit, index) => (
              <div
                key={habit.id}
                className="group bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 flex-1 group-hover:text-black transition-colors">
                    {habit.title}
                  </h3>
                  <span
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 flex-shrink-0 ${
                      habit.priority === "high"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : habit.priority === "medium"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-green-50 text-green-700 border-green-200"
                    }`}
                  >
                    {habit.priority === "high"
                      ? "🔥 Alta Prioridad"
                      : habit.priority === "medium"
                      ? "⚡ Media Prioridad"
                      : "✓ Baja Prioridad"}
                  </span>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  {habit.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium border-2 border-blue-200">
                    📁 {habit.category}
                  </span>
                  <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium border-2 border-purple-200">
                    📅 {habit.frequency}
                  </span>
                  {habit.timeOfDay && (
                    <span className="px-4 py-2 bg-orange-50 text-orange-700 rounded-xl text-sm font-medium border-2 border-orange-200">
                      🕐 {habit.timeOfDay}
                    </span>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-100">
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Por qué es importante:
                    </span>
                    {habit.reasoning}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setHabitPlan(null);
              setError("");
            }}
            className="group w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-900/20 text-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-45"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Realizar Nueva Evaluación
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
