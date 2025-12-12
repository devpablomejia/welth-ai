# Welth AI - Sistema de Evaluación y Plan de Hábitos

Sistema de generación de planes de hábitos personalizados basado en evaluaciones de salud y bienestar usando IA.

## Estructura del Proyecto

```
app/
├── types/
│   └── assessment.ts          # Tipos TypeScript para AssessmentRequest y HabitPlan
├── lib/
│   ├── storage.ts             # Sistema de persistencia en archivo local
│   └── prompts.ts             # Generación de prompts para el modelo de IA
├── api/
│   ├── assessment/
│   │   └── route.ts           # Endpoint para procesar evaluaciones
│   └── chat/
│       └── route.ts           # Endpoint de chat original
├── _components/
│   ├── AssessmentForm.tsx     # Formulario de evaluación completo
│   └── Chat.tsx               # Componente de chat original
└── page.tsx                   # Página principal
```

## Características

### 1. Evaluación Completa

El formulario recopila información sobre:

- **Información Personal**: edad, peso, altura, sexo
- **Patrones de Sueño**: horarios, calidad, despertares
- **Alimentación**: horarios de comidas, hidratación, porciones de frutas/vegetales
- **Actividad Física**: nivel de actividad, frecuencia de ejercicio
- **Bienestar General**: estrés, energía, disposición al cambio
- **Hábitos**: consumo de alcohol y tabaco

### 2. Generación de Hábitos con IA

- Usa Gemini 2.0 Flash para analizar la evaluación
- Genera hábitos personalizados basados en:
  - Áreas que necesitan mejora
  - Disposición al cambio del usuario
  - Impacto y facilidad de implementación
- Cada hábito incluye:
  - Título y descripción detallada
  - Categoría (sueño, alimentación, ejercicio, etc.)
  - Frecuencia y momento del día
  - Prioridad (alta, media, baja)
  - Razonamiento personalizado

### 3. Persistencia Local

- Los planes se guardan en `data/habit-plans.json`
- Cada plan incluye la evaluación completa y los hábitos generados
- Timestamp de creación para tracking histórico

## Instalación

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno (ya configurado en `.env`):

```env
GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key
GEMINI_MODEL=gemini-2.0-flash
```

3. Ejecutar en desarrollo:

```bash
npm run dev
```

## Uso

1. Abrir `http://localhost:3000`
2. Completar el formulario de evaluación
3. Hacer clic en "Generar Plan de Hábitos"
4. Revisar el plan personalizado generado por la IA
5. Los datos se guardan automáticamente en `data/habit-plans.json`

## API Endpoints

### POST /api/assessment

Genera un plan de hábitos basado en una evaluación.

**Request Body**:

```typescript
{
  userId: number;
  age: number;
  weightKg: number;
  heightM: number;
  // ... todos los campos de AssessmentRequest
}
```

**Response**:

```typescript
{
  userId: number;
  createdAt: string;
  assessment: AssessmentRequest;
  habits: Habit[];
  summary: string;
}
```

## Tipos de Datos

### Enums

- `UserSex`: MALE, FEMALE, OTHER
- `ActivityLevel`: SEDENTARY, LIGHTLY_ACTIVE, MODERATELY_ACTIVE, VERY_ACTIVE, EXTREMELY_ACTIVE
- `EndOfDayFeeling`: EXHAUSTED, TIRED, NEUTRAL, ENERGETIC, VERY_ENERGETIC
- `AlcoholFrequency`: NEVER, RARELY, OCCASIONALLY, WEEKLY, DAILY

### Interfaces Principales

- `AssessmentRequest`: Datos completos de la evaluación
- `Habit`: Hábito individual con detalles
- `HabitPlan`: Plan completo con evaluación y hábitos

## Tecnologías

- **Next.js 16**: Framework React
- **TypeScript**: Tipado estático
- **Gemini 2.0 Flash**: Modelo de IA para generación de hábitos
- **Vercel AI SDK**: Integración con modelos de IA
- **Tailwind CSS**: Estilos

## Próximos Pasos

- [ ] Agregar autenticación de usuarios
- [ ] Implementar base de datos real (PostgreSQL/MongoDB)
- [ ] Dashboard para ver historial de evaluaciones
- [ ] Tracking de progreso de hábitos
- [ ] Notificaciones y recordatorios
- [ ] Gráficas y métricas de mejora
