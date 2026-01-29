# Entretemps

## Descripción general

**Entretemps** es una aplicación web interactiva que permite a padres, educadores y organizadores de eventos crear aventuras personalizadas para fiestas y actividades infantiles. A través de un wizard intuitivo de 6 pasos, los usuarios configuran todos los aspectos de su aventura (ocasión, participantes, intereses, ubicación, tono y dificultad) y la aplicación genera automáticamente un pack completo que incluye:

- Una historia narrativa con personajes y ambientación
- 3 fases de juego con 6 puzzles sin pantallas
- Guía de preparación paso a paso
- Materiales imprimibles listos para usar

El objetivo es facilitar la organización de actividades lúdicas y educativas que promuevan el juego activo, la resolución de problemas y la creatividad, sin depender de dispositivos electrónicos.

## Stack tecnológico

### Frontend
- **Framework**: Next.js 16 (App Router) - Framework React con renderizado del lado del servidor
- **Lenguaje**: TypeScript - Tipado estático para mayor seguridad y mantenibilidad
- **Estilos**: Tailwind CSS 4 - Framework de utilidades CSS
- **Componentes UI**: shadcn/ui - Componentes accesibles basados en Radix UI
- **Iconos**: Lucide React - Biblioteca de iconos

### Backend y Servicios
- **Base de datos**: Supabase - Base de datos PostgreSQL con API REST autogenerada
- **Autenticación**: Supabase Auth - Sistema de autenticación con proveedores sociales
- **Generación de contenido IA**:
  - Arquitectura multimodal con proveedores intercambiables
  - N8N (producción actual), OpenAI, Google Gemini (preparados)
  - Abstracción mediante patrón Adapter e Inversión de Dependencias
- **Generación de imágenes**: Nanobanana (preparado para integración)
- **Generación de PDF**: @react-pdf/renderer - Creación de documentos PDF desde React

### Desarrollo y Testing
- **Tests**: Vitest - Framework de testing unitario y de integración
- **Testing Library**: @testing-library/react - Utilidades para testing de componentes React
- **Validación**: Zod - Validación de esquemas y tipos en runtime
- **Linting**: ESLint - Análisis estático de código
- **Package Manager**: pnpm - Gestor de paquetes eficiente

## Instalación y ejecución

### Requisitos previos

- Node.js 20 o superior
- pnpm 8 o superior
- Cuenta de Supabase (gratuita)
- Cuenta de n8n o webhook alternativo (opcional para generación real de contenido)

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd entretemps
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Crear un archivo [.env.local](.env.local) en la raíz del proyecto con las siguientes variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui

# n8n Webhook (opcional - usa adaptador mock si no está configurado)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/entretemps

# IA Providers (opcional - los adaptadores usan mocks por defecto)
OPENAI_API_KEY=sk-tu-key-aqui                    # Para OpenAIAdapter
GOOGLE_AI_API_KEY=tu-gemini-key-aqui             # Para GeminiAdapter
NANOBANANA_API_KEY=tu-nanobanana-key-aqui        # Para NanobananaAdapter
```

### 4. Configurar Supabase

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Obtener la URL y la clave anónima desde Project Settings > API
3. Ejecutar las migraciones de base de datos (si existen en `/supabase/migrations`)
4. Configurar autenticación con Google/GitHub en Authentication > Providers

### 5. Ejecutar en desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### 6. Ejecutar tests

```bash
# Ejecutar todos los tests una vez
pnpm test:run

# Ejecutar tests en modo watch
pnpm test:watch
```

### 7. Build para producción

```bash
pnpm build
pnpm start
```

## Estructura del proyecto

El proyecto sigue una arquitectura hexagonal (ports & adapters) organizada en capas:

```
src/
├── app/                           # Rutas Next.js (App Router)
│   ├── wizard/                    # Wizard de configuración (steps 1-6)
│   ├── pack/result/               # Visualización del pack generado
│   ├── my-adventures/             # Listado y detalle de aventuras guardadas
│   ├── templates/[id]/            # Visualización de plantillas predefinidas
│   ├── login/                     # Página de inicio de sesión
│   ├── auth/callback/             # Callback de autenticación OAuth
│   └── api/                       # API Routes
│       └── pack/mock/             # Endpoint mock para generación de packs
├── application/                   # Casos de uso (Application Layer)
│   ├── dto/                       # Data Transfer Objects
│   ├── generate-adventure-pack.ts # Caso de uso principal
│   ├── list-templates.ts          # Listar plantillas disponibles
│   └── get-template-by-id.ts      # Obtener plantilla específica
├── domain/                        # Tipos e interfaces de dominio (Domain Layer)
│   ├── adventure-pack.ts          # Entidades del pack de aventura
│   └── wizard-data.ts             # Tipos de datos del wizard
├── infrastructure/                # Adaptadores externos (Infrastructure Layer)
│   ├── supabase/                  # Cliente y servicios de Supabase
│   ├── n8n/                       # Adaptador para n8n webhook
│   └── pdf/                       # Generación de PDF
├── lib/                           # Utilidades y configuración
│   ├── schemas/                   # Schemas Zod para validación
│   └── utils.ts                   # Funciones de utilidad
└── ui/                            # Componentes de interfaz (Presentation Layer)
    ├── components/                # Componentes reutilizables (Button, Card, etc.)
    └── wizard/                    # Componentes específicos del wizard

tests/                             # Tests organizados por capa
├── domain/                        # Tests de contratos y tipos de dominio
├── application/                   # Tests de casos de uso
├── infrastructure/                # Tests de adaptadores
├── ui/                            # Tests de componentes React
└── integration/                   # Tests de integración end-to-end
```

### Principios arquitectónicos

- **Separación de responsabilidades**: Cada capa tiene una responsabilidad clara
- **Dependencias unidireccionales**: Las dependencias fluyen hacia el dominio
- **Inversión de Dependencias (DIP)**: La capa de aplicación depende de abstracciones, no de implementaciones
- **Patrón Adapter**: Los servicios externos implementan interfaces del dominio
- **Testing**: Cada capa es testeable de forma independiente
- **Validación**: Schemas Zod en runtime + TypeScript en compile time

## Arquitectura de IA Multimodal

Este proyecto implementa una **arquitectura limpia (Clean Architecture)** para la integración de servicios de IA, permitiendo intercambiar proveedores sin modificar la lógica de negocio.

### Estructura de Capas

```
┌─────────────────────────────────────────────────────┐
│          DOMAIN (Contratos/Interfaces)              │
│  src/domain/services/                               │
│  - IAdventureProvider: Generación de texto          │
│  - IImageGenerator: Generación de imágenes          │
└─────────────────────────────────────────────────────┘
                        ▲
                        │ implementa
                        │
┌─────────────────────────────────────────────────────┐
│       INFRASTRUCTURE (Adaptadores concretos)        │
│  src/infrastructure/ai/adapters/                    │
│  - OpenAIAdapter (ChatGPT)                          │
│  - GeminiAdapter (Google Gemini)                    │
│  - NanobananaAdapter (Generación de imágenes)       │
│  src/infrastructure/n8n/                            │
│  - N8NAdapter (Workflow externo)                    │
└─────────────────────────────────────────────────────┘
                        ▲
                        │ usa
                        │
┌─────────────────────────────────────────────────────┐
│         APPLICATION (Casos de uso)                  │
│  src/application/                                   │
│  - generateAdventureMultimodal: Orquestador         │
│    que coordina texto + imagen                      │
└─────────────────────────────────────────────────────┘
```

### Proveedores de IA Disponibles

#### Proveedores de Aventura (IAdventureProvider)
- **N8NAdapter**: Integración con flujo externo (producción actual)
- **OpenAIAdapter**: ChatGPT (mock, preparado para implementación real)
- **GeminiAdapter**: Google Gemini (mock, preparado para implementación real)

#### Proveedores de Imagen (IImageGenerator)
- **NanobananaAdapter**: Generación de imágenes (mock, preparado para implementación real)

### Orquestador Multimodal

El caso de uso `generateAdventureMultimodal` coordina la generación de texto e imagen:

```typescript
import { generateAdventureMultimodal } from '@/application/generate-adventure-multimodal'
import { OpenAIAdapter, NanobananaAdapter } from '@/infrastructure/ai/adapters'

// Proveedores intercambiables
const textProvider = new OpenAIAdapter()
const imageProvider = new NanobananaAdapter()

// Generación orquestada
const result = await generateAdventureMultimodal(
  wizardData,
  textProvider,
  imageProvider
)
```

**Características del orquestador:**
- ✅ **Flujo secuencial**: Genera texto → Extrae prompt → Genera imagen
- ✅ **Resiliencia**: Si falla la imagen, usa placeholder automático
- ✅ **Compatibilidad**: El resultado es directamente compatible con Supabase
- ✅ **Warnings**: Registra problemas no críticos sin fallar la operación

Ver documentación completa en: [src/infrastructure/ai/README.md](src/infrastructure/ai/README.md)

### Ventajas de la Arquitectura

1. **Intercambiabilidad**: Cambiar de OpenAI a Gemini sin tocar lógica de negocio
2. **Testabilidad**: Mocks fáciles de crear para cada proveedor
3. **Mantenibilidad**: Cada adaptador es independiente
4. **Escalabilidad**: Añadir nuevos proveedores sin modificar código existente
5. **Desacoplamiento**: La aplicación no depende de SDKs externos específicos

## Funcionalidades principales

### 1. Generación de aventuras personalizadas

El corazón de la aplicación es el **wizard de 6 pasos** que guía al usuario a través de la configuración de su aventura:

- **Paso 1 - Ocasión**: Selección del tipo de evento (cumpleaños, fiesta familiar, excursión, etc.)
- **Paso 2 - Participantes**: Definición del número de niños y rango de edades
- **Paso 3 - Intereses**: Personalización según los gustos del protagonista
- **Paso 4 - Lugar**: Ubicación donde se desarrollará la aventura (casa, jardín, parque, interior/exterior)
- **Paso 5 - Creatividad**: Configuración del tipo de aventura, tono emocional y nivel de dificultad
- **Paso 6 - Resumen**: Revisión final antes de generar el pack

### 2. Pack de aventura completo

Al finalizar el wizard, la aplicación genera un pack que incluye:

- **Historia narrativa**: Synopsis y ambientación personalizada
- **Personajes**: Protagonistas, antagonistas y personajes secundarios con descripciones
- **3 Fases de juego**: Cada fase con objetivo claro y narrativa progresiva
- **6 Puzzles sin pantallas**: 2 puzzles por fase, variados y adaptados a las edades
- **Guía de preparación**: Instrucciones paso a paso para el organizador
- **Lista de materiales**: Todo lo necesario para preparar la aventura
- **Materiales imprimibles**: PDFs listos para imprimir (mapas, pistas, cartas, etc.)

### 3. Biblioteca de aventuras

- **Mis Aventuras**: Los usuarios autenticados pueden guardar y acceder a sus aventuras generadas
- **Vista de detalle**: Acceso completo a todos los componentes del pack guardado
- **Historial**: Todas las aventuras generadas quedan disponibles para reutilizar

### 4. Sistema de plantillas

- **Plantillas predefinidas**: Acceso a aventuras ejemplo ya creadas
- **Vista previa**: Posibilidad de explorar plantillas antes de generar la propia
- **Inspiración**: Las plantillas sirven de referencia para nuevas aventuras

### 5. Autenticación y persistencia

- **Login social**: Autenticación mediante Google u otros proveedores OAuth
- **Sesión persistente**: Las aventuras se guardan automáticamente al usuario
- **Acceso multiplataforma**: Acceso desde cualquier dispositivo con la misma cuenta

### 6. Generación sin pantallas

Todas las aventuras están diseñadas con la filosofía **screen-free**:
- Sin uso de tablets, móviles o pantallas durante el juego
- Puzzles físicos y manipulativos
- Fomento de la interacción real y el juego activo

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
