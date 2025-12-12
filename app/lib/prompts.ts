import type { AssessmentRequest } from '@/app/types/assessment';

export function buildAssessmentPrompt(assessment: AssessmentRequest): string {
    const bmi = assessment.weightKg / (assessment.heightM * assessment.heightM);
    const sleepHours = calculateSleepHours(assessment.sleepTime, assessment.wakeTime);

    return `Eres un experto en salud y bienestar. Analiza la siguiente evaluación de un usuario y genera un plan personalizado de hábitos saludables.

INFORMACIÓN DEL USUARIO:
- Edad: ${assessment.age} años
- Sexo: ${assessment.userSex}
- Peso: ${assessment.weightKg} kg
- Altura: ${assessment.heightM} m
- IMC: ${bmi.toFixed(1)}

PATRONES DE SUEÑO:
- Hora de despertar: ${assessment.wakeTime}
- Hora de dormir: ${assessment.sleepTime}
- Horas de sueño: ${sleepHours.toFixed(1)}
- Dificultad para despertar (1-10): ${assessment.wakeDifficulty}
- Despertares nocturnos: ${assessment.nightAwakenings}
- Calidad de sueño reparador (1-10): ${assessment.sleepRepairScore}
- Facilidad para conciliar sueño (1-10): ${assessment.sleepOnsetScore}

ALIMENTACIÓN:
- Desayuno: ${assessment.breakfastTime}
- Almuerzo: ${assessment.lunchTime}
- Cena: ${assessment.dinnerTime}
- Vasos de agua al día: ${assessment.waterCupsDay}
- Porciones de fruta al día: ${assessment.fruitServingsDay}
- Porciones de vegetales al día: ${assessment.vegetableServingsDay}
- Comida procesada por semana: ${assessment.processedFoodWeek}

ACTIVIDAD FÍSICA:
- Nivel de actividad: ${assessment.activityLevel}
- Frecuencia de ejercicio por semana: ${assessment.exerciseFrequencyPerWeek}

BIENESTAR GENERAL:
- Nivel de estrés (1-10): ${assessment.stressLevel}
- Sensación al final del día: ${assessment.endOfDayFeeling}
- Puntaje de bienestar (1-10): ${assessment.wellbeingScore}
- Disposición al cambio (1-10): ${assessment.readinessChange}
- Confianza en cambiar (1-10): ${assessment.confidenceChange}

HÁBITOS:
- Consume alcohol: ${assessment.drinksAlcohol ? 'Sí' : 'No'}
${assessment.drinksAlcohol ? `- Frecuencia de alcohol: ${assessment.alcoholFrequency}` : ''}
- Fuma tabaco: ${assessment.smokesTobacco ? 'Sí' : 'No'}
${assessment.smokesTobacco ? `- Unidades de tabaco al día: ${assessment.tobaccoUnitsPerDay}` : ''}

GENERA UN PLAN DE HÁBITOS en formato JSON con la siguiente estructura:
{
  "summary": "Un resumen breve del análisis del usuario y las áreas principales de mejora",
  "habits": [
    {
      "id": "habit-1",
      "title": "Título corto del hábito",
      "description": "Descripción detallada del hábito y cómo implementarlo",
      "category": "sueño | alimentación | ejercicio | hidratación | estrés | bienestar",
      "frequency": "diario | semanal | mensual",
      "timeOfDay": "mañana | tarde | noche | variable",
      "priority": "high | medium | low",
      "reasoning": "Por qué este hábito es importante para este usuario específico"
    }
  ]
}

INSTRUCCIONES:
1. Genera entre 5 y 10 hábitos priorizados
2. Enfócate en las áreas que más necesitan mejora según los datos
3. Sé específico y práctico en las recomendaciones
4. Considera la disposición al cambio del usuario
5. Prioriza hábitos de alto impacto y fácil implementación
6. Responde SOLO con el JSON, sin texto adicional`;
}

function calculateSleepHours(sleepTime: string, wakeTime: string): number {
    // Parse times (assuming format HH:mm)
    const [sleepHour, sleepMin] = sleepTime.split(':').map(Number);
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);

    const sleepMinutes = sleepHour * 60 + sleepMin;
    let wakeMinutes = wakeHour * 60 + wakeMin;

    // If wake time is earlier in the day than sleep time, add 24 hours to wake time
    if (wakeMinutes < sleepMinutes) {
        wakeMinutes += 24 * 60;
    }

    const totalMinutes = wakeMinutes - sleepMinutes;
    return totalMinutes / 60;
}
