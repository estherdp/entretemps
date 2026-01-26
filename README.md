# Entretemps

Generador de aventuras personalizadas para fiestas infantiles. Un wizard guía al usuario para configurar la aventura y genera un pack completo con historia, puzzles y materiales imprimibles.

## Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **BD/Auth**: Supabase
- **Tests**: Vitest + Testing Library
- **Package Manager**: pnpm

## Estructura del proyecto

```
src/
├── app/                    # Rutas Next.js (App Router)
│   └── wizard/             # Wizard de configuración (steps 1-6)
├── application/            # Casos de uso y DTOs
│   └── dto/                # Data Transfer Objects
├── domain/                 # Tipos e interfaces de dominio
├── infrastructure/         # Supabase, IA, PDF
├── lib/                    # Utilidades y configuración
│   └── schemas/            # Schemas Zod para validación
└── ui/                     # Componentes UI
    ├── components/         # Componentes reutilizables
    └── wizard/             # Componentes específicos del wizard

tests/
├── domain/                 # Tests de dominio y contratos
├── application/            # Tests de casos de uso
├── ui/                     # Tests de componentes
└── integration/            # Tests de integración
```

## Wizard Flow

El wizard consta de 6 pasos:

1. **Ocasión** - Tipo de evento (cumpleaños, fiesta, etc.)
2. **Participantes** - Número y edades de los niños
3. **Intereses** - Gustos del protagonista
4. **Lugar** - Ubicación de la aventura
5. **Creatividad** - Tipo de aventura, tono y dificultad
6. **Resumen** - Revisión de selecciones

## Contratos de API

### GeneratePackRequest (entrada)

```typescript
{
  locale: "es",
  wizardData: {
    occasion?: "birthday" | "family-afternoon" | "party" | "excursion",
    ages?: { min: number, max: number },
    kidsCount?: number,
    interests?: string,
    place?: "home" | "garden" | "park" | "indoor" | "outdoor",
    adventureType?: "mystery" | "adventure" | "fantasy" | "action" | "humor",
    tone?: "funny" | "enigmatic" | "exciting" | "calm",
    difficulty?: "easy" | "medium" | "hard"
  },
  constraints: {
    phases: 3,
    puzzlesPerPhase: 2,
    screenFree: true
  }
}
```

### AdventurePack (salida)

```typescript
{
  meta: {
    title: string,
    createdAt: string  // ISO datetime
  },
  story: {
    synopsis: string,
    setting: string
  },
  characters: [{
    name: string,
    role: string,
    description: string
  }],
  phases: [{  // Exactamente 3 fases
    index: 1 | 2 | 3,
    title: string,
    objective: string,
    puzzles: [{  // Exactamente 2 puzzles por fase
      index: 1 | 2,
      type: string,
      statement: string,
      solution: string,
      hints: string[]
    }]
  }],
  setupGuide: {
    steps: string[],
    materials: string[]
  },
  printables: [{
    title: string,
    content: string
  }]
}
```

## Scripts

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Tests
pnpm test:run      # Ejecutar todos los tests
pnpm test:watch    # Tests en modo watch

# Lint
pnpm lint
```

## Convenciones

- **camelCase** para funciones y variables
- **PascalCase** para tipos y componentes
- **kebab-case** para nombres de ficheros
- TypeScript tipado (evitar `any`)
- No lógica de negocio en UI
- Tests para cada cambio
