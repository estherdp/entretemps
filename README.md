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

# n8n Webhook (server-only, opcional - usa adaptador mock si no está configurado)
N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/entretemps

# IA Providers (opcional - los adaptadores usan mocks por defecto)
OPENAI_API_KEY=sk-tu-key-aqui                    # Para OpenAIAdapter
GOOGLE_AI_API_KEY=tu-gemini-key-aqui             # Para GeminiAdapter
NANOBANANA_API_KEY=tu-nanobanana-key-aqui        # Para NanobananaAdapter

# Búsqueda de Imágenes (opcional - usa placeholder si no está configurado)
PEXELS_API_KEY=tu-pexels-key-aqui                # Para búsqueda de imágenes reales
```

### 4. Configurar Supabase

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Obtener la URL y la clave anónima desde Project Settings > API
3. Ejecutar las migraciones de base de datos (si existen en `/supabase/migrations`)
4. Configurar autenticación con Google/GitHub en Authentication > Providers
5. Crear la tabla de caché de imágenes ejecutando en SQL Editor:

```sql
-- Crear tabla image_cache para Pexels
CREATE TABLE IF NOT EXISTS image_cache (
  query TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  photographer TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_image_cache_created_at ON image_cache(created_at);

ALTER TABLE image_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "image_cache_select_policy" ON image_cache FOR SELECT USING (true);
CREATE POLICY "image_cache_insert_policy" ON image_cache FOR INSERT WITH CHECK (true);
CREATE POLICY "image_cache_update_policy" ON image_cache FOR UPDATE USING (true);
CREATE POLICY "image_cache_delete_policy" ON image_cache FOR DELETE USING (true);
```

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

El proyecto sigue una clean architecture organizada en capas:

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
│  - IImageGenerator: Generación de imágenes por IA   │
│  - IImageSearcher: Búsqueda de imágenes reales      │
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
│  src/infrastructure/images/                         │
│  - PexelsImageAdapter (Búsqueda de fotos reales)    │
│  src/infrastructure/supabase/                       │
│  - ImageCacheRepository (Caché de 24h)              │
└─────────────────────────────────────────────────────┘
                        ▲
                        │ usa
                        │
┌─────────────────────────────────────────────────────┐
│         APPLICATION (Casos de uso)                  │
│  src/application/                                   │
│  - generateAdventureMultimodal: Orquestador         │
│    que coordina texto + imagen con fallback         │
└─────────────────────────────────────────────────────┘
```

### Proveedores de IA Disponibles

#### Proveedores de Aventura (IAdventureProvider)
- **N8NAdapter**: Integración con flujo externo (producción actual)
- **OpenAIAdapter**: ChatGPT (mock, preparado para implementación real)
- **GeminiAdapter**: Google Gemini (mock, preparado para implementación real)

#### Proveedores de Imagen (IImageGenerator)
- **NanobananaAdapter**: Generación de imágenes por IA (mock, preparado para implementación real)

#### Búsqueda de Imágenes (IImageSearcher)
- **PexelsImageAdapter**: Búsqueda de fotografías reales en Pexels API
- **ImageCacheRepository**: Sistema de caché con expiración de 24 horas

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
- ✅ **Flujo secuencial**: Genera texto → Extrae prompt → Busca imagen real → Genera por IA (fallback) → Placeholder (último recurso)
- ✅ **Resiliencia**: Estrategia de fallback multinivel para garantizar siempre una imagen
- ✅ **Compatibilidad**: El resultado es directamente compatible con Supabase
- ✅ **Warnings**: Registra problemas no críticos sin fallar la operación
- ✅ **Caché inteligente**: Almacena búsquedas de imágenes durante 24 horas
- ✅ **Atribución**: Registra fotógrafo y fuente para cumplir términos de uso

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

### 7. Búsqueda de imágenes con Pexels

Sistema de búsqueda de fotografías reales para las portadas de aventuras:

- **Búsqueda automática**: Construye queries optimizadas basadas en los metadatos de la aventura
- **Caché inteligente**: Almacena resultados en Supabase por 24 horas para reducir llamadas a la API
- **Estrategia de fallback**: Pexels → IA → Placeholder
- **Atribución automática**: Registra el fotógrafo y URL de origen
- **Server-only**: Todas las llamadas se hacen en servidor para proteger la API key
- **Límites del plan gratuito**: 200 requests/hora, 20,000 requests/mes

**Configuración:**
1. Obtener API key gratuita en [https://www.pexels.com/api/](https://www.pexels.com/api/)
2. Agregar `PEXELS_API_KEY=tu-key` en `.env.local`
3. Crear tabla `image_cache` en Supabase (ver sección 4.5 de instalación)

**Query builder automático:**
El sistema construye queries optimizadas combinando el tipo de aventura, lugar, tono y keywords del prompt de imagen, limitado a 6 términos para mejores resultados.

### 8. Eliminar aventuras

Los usuarios autenticados pueden eliminar sus propias aventuras (no las plantillas del sistema):

- **Seguridad**: Solo el dueño puede eliminar su aventura
- **Autenticación requerida**: Se verifica que el usuario esté logueado
- **Doble validación**: Validación en repositorio Y en base de datos
- **Protección contra plantillas**: No se pueden eliminar aventuras que no pertenezcan al usuario

**API Endpoint:**
- `DELETE /api/pack/[id]` - Elimina una aventura del usuario autenticado
- Retorna 200 si éxito, 401 si no autenticado, 403 si sin permisos, 404 si no encontrado

**Políticas RLS en Supabase:**
```sql
CREATE POLICY "Users can delete their own packs"
ON adventure_packs
FOR DELETE
USING (auth.uid() = user_id);
```

### 9. Edición Human-in-the-Loop con Drag & Drop

Sistema avanzado de edición colaborativa entre humano e IA para refinar aventuras guardadas:

#### Características principales

- **Regeneración de misiones individuales**: Mejora misiones específicas manteniendo coherencia con el resto de la aventura
- **Reordenamiento visual**: Drag & Drop para reorganizar misiones sin perder información
- **Feedback contextual**: Proporciona feedback opcional a la IA para regenerar con instrucciones específicas
- **Estado de carga granular**: Skeleton loader individual por misión durante regeneración
- **Persistencia automática**: Todos los cambios se guardan instantáneamente en Supabase
- **UX optimista**: Actualización inmediata de la UI antes de confirmar con el servidor

#### Arquitectura de la funcionalidad

**Domain Layer (Interfaces):**
- `IMissionEditor`: Puerto para proveedores de regeneración de misiones
- `AdventureContext`: Contexto compartido entre misiones para coherencia narrativa

**Infrastructure Layer (Implementación):**
- `GeminiAdapter.regenerateSingleMission()`: Prompt especializado de "Editor" que recibe el contexto completo
- Validación con Zod para misiones individuales
- Forzado de salida JSON para estructura consistente

**Application Layer (Casos de uso):**
- `regenerateMission`: Orquesta regeneración manteniendo contexto y permisos
- `reorderMissions`: Actualiza índices de orden y persiste cambios

**API Endpoints:**
- `POST /api/pack/[id]/regenerate-mission` - Regenera una misión específica
- `POST /api/pack/[id]/reorder-missions` - Reordena el array de misiones

**UI Layer (Componentes):**
- `MissionCard`: Componente sortable con botón de regeneración y drag handle
- `@dnd-kit/core` y `@dnd-kit/sortable` para drag & drop fluido
- Hooks personalizados: `useRegenerateMission`, `useReorderMissions`

#### Flujo de regeneración

```typescript
1. Usuario hace clic en "Regenerar" en una misión
2. Se extrae el contexto de la aventura (título, tipo, tono, otras misiones)
3. Se llama al adaptador de IA con el contexto completo
4. La IA genera una nueva misión coherente con el resto
5. Se actualiza optimistamente la UI
6. Se persiste en Supabase vía updatePackJson
7. Se muestra la nueva misión con transición suave
```

#### Flujo de reordenamiento

```typescript
1. Usuario arrastra una misión a nueva posición
2. Se actualiza el orden localmente (optimistic UI)
3. Se persiste el nuevo orden en Supabase
4. Se actualizan los índices `order` de todas las misiones
5. En caso de error, se revierte al orden original
```

#### Ventajas del patrón Human-in-the-Loop

- **Iteración rápida**: Refina misiones específicas sin regenerar todo el pack
- **Control creativo**: El humano decide qué mejorar y cuándo
- **Coherencia garantizada**: La IA recibe contexto completo de la aventura
- **Resiliencia**: Cada misión es independiente, errores no afectan el resto
- **Experiencia fluida**: Drag & drop nativo sin recargas de página

#### Ejemplo de uso

```typescript
// En la página de detalle de una aventura guardada

// Regenerar misión 2 con feedback
await regenerateMission(packId, userId, 2, "Hazla más divertida")

// Reordenar: misión 3 primero, luego 1, luego 2
await reorderMissions(packId, userId, [3, 1, 2])
```

Ver implementación completa en: [src/app/my-adventures/[id]/page.tsx](src/app/my-adventures/[id]/page.tsx)

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
