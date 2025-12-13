import type { AssessmentRequest } from '@/app/types/assessment';

export function buildAssessmentPrompt(
  assessment: AssessmentRequest,
  options?: { historyContext?: string }
): string {
  const bmi = assessment.weightKg / (assessment.heightM * assessment.heightM);
  const sleepHours = calculateSleepHours(assessment.sleepTime, assessment.wakeTime);

  return `Eres un experto en salud y bienestar. Analiza la siguiente evaluación de un usuario y genera un plan personalizado de hábitos saludables.

GLOSARIO E INTERPRETACIÓN DE CAMPOS (para que entiendas cada clave y el significado de su valor):
- age: edad en años. Más edad suele implicar mayor énfasis en progresión gradual y prevención de lesiones.
- weightKg: peso en kilogramos. Úsalo con heightM para interpretar IMC (bmi).
- heightM: altura en metros.
- bmi (IMC): indicador aproximado (kg/m²). Úsalo solo como señal; evita recomendaciones clínicas/diagnósticos.

- userSex: sexo reportado. Valores posibles: MALE | FEMALE | OTHER. Úsalo para matizar lenguaje y ejemplos, no para asumir condiciones médicas.

- wakeTime / sleepTime / breakfastTime / lunchTime / dinnerTime: horarios en formato HH:mm. Interpreta consistencia, ventana de sueño y regularidad de comidas.
- sleepHours: horas totales estimadas (derivado de sleepTime y wakeTime). Si es bajo, prioriza higiene del sueño.

- wakeDifficulty (1-10): dificultad para despertar. 1=facilísimo, 10=muy difícil. Alto sugiere sueño insuficiente, mala calidad o horarios irregulares.
- nightAwakenings: número de despertares nocturnos. Alto sugiere fragmentación; prioriza rutina, ambiente y manejo de estímulos.
- sleepRepairScore (1-10): sueño reparador. 1=nada reparador, 10=muy reparador. Bajo: enfoca hábitos de sueño.
- sleepOnsetScore (1-10): facilidad para conciliar el sueño. 1=muy difícil, 10=muy fácil. Bajo: reduce estimulantes, pantallas, estrés.

- waterCupsDay: vasos de agua al día. Bajo: prioriza hidratación con acciones simples.
- fruitServingsDay / vegetableServingsDay: porciones diarias. Bajo: prioriza aumentos graduales y estrategias prácticas.
- processedFoodWeek: frecuencia semanal de comida procesada. Alto: prioriza sustituciones y planificación.

- activityLevel: nivel de actividad general. Valores: SEDENTARY | LIGHTLY_ACTIVE | MODERATELY_ACTIVE | VERY_ACTIVE | EXTREMELY_ACTIVE.
  Interpreta así: SEDENTARY=movimiento muy bajo; LIGHTLY_ACTIVE=bajo; MODERATELY_ACTIVE=medio; VERY_ACTIVE=alto; EXTREMELY_ACTIVE=muy alto.
- exerciseFrequencyPerWeek: sesiones de ejercicio por semana (número). Si es 0-1, propone hábitos de adherencia y “mínimo viable”.

- stressLevel (1-10): estrés percibido. 1=muy bajo, 10=muy alto. Alto: prioriza regulación y hábitos antiestrés.
- endOfDayFeeling: sensación al final del día. Valores: EXHAUSTED | TIRED | NEUTRAL | ENERGETIC | VERY_ENERGETIC.
  Interpreta EXHAUSTED/TIRED como señal de carga o recuperación pobre.
- wellbeingScore (1-10): bienestar global. 1=muy bajo, 10=muy alto. Bajo: prioriza hábitos de mayor impacto.
- readinessChange (1-10): disposición a cambiar. 1=nada dispuesto, 10=muy dispuesto.
- confidenceChange (1-10): confianza en poder cambiar. 1=nada confiado, 10=muy confiado.
  Si readiness/confidence son bajos, reduce complejidad, aumenta gradualidad y refuerza micro-hábitos.

- drinksAlcohol: booleano. true=consume alcohol, false=no.
- alcoholFrequency: si drinksAlcohol=true, frecuencia. Valores: NEVER | RARELY | OCCASIONALLY | WEEKLY | DAILY.
  Interpretación: RARELY/ OCCASIONALLY = baja; WEEKLY = media; DAILY = alta.
- smokesTobacco: booleano. true=fuma, false=no.
- tobaccoUnitsPerDay: si smokesTobacco=true, unidades diarias. Alto: prioriza reducción gradual y sustituciones saludables.

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

${options?.historyContext
      ? `HISTORIAL DEL USUARIO (solo Premium; úsalo como contexto para detectar progreso/regresiones, evitar recomendaciones repetidas sin aportar valor y proponer mejoras más personalizadas):
${options.historyContext}
`
      : ''}

SALIDA REQUERIDA:
Genera un plan en formato JSON. Significado de cada clave de salida:
- summary: resumen breve (2-5 frases) del análisis del usuario y las áreas principales de mejora (sin lenguaje médico/diagnóstico).
- habits: lista de hábitos accionables. Cada hábito debe:
  - ser específico, medible y realista;
  - incluir "reasoning" conectando explícitamente con los datos del usuario;
  - evitar consejos médicos y suposiciones clínicas;
  - no repetir exactamente hábitos ya sugeridos en historial (si hay historial), a menos que ajustes la estrategia y lo justifiques.

GENERA UN PLAN DE HÁBITOS en formato JSON con la siguiente estructura EXACTA:
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
