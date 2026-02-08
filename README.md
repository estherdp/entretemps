# Entretemps

## Descripción general

**Entretemps** es una aplicación web interactiva desarrollada como **Trabajo de Fin de Máster (TFM)** en Desarrollo Asistido por IA, que permite a padres, educadores y organizadores de eventos crear aventuras personalizadas para fiestas y actividades infantiles.

### ¿Qué ofrece Entretemps?

A través de un **wizard intuitivo de 6 pasos**, los usuarios configuran todos los aspectos de su aventura (ocasión, participantes, intereses, ubicación, tono y dificultad) y la aplicación genera automáticamente mediante **IA generativa** un pack completo que incluye:

- 📖 **Historia narrativa** con personajes y ambientación única
- 🎮 **3 fases de juego** con 6 puzzles diseñados sin pantallas
- 📋 **Guía de preparación** paso a paso para el organizador
- 🖨️ **Materiales imprimibles** listos para usar (mapas, pistas, cartas)
- 🖼️ **Portada ilustrada** generada con IA o búsqueda inteligente de imágenes
- ✏️ **Edición colaborativa** Human-in-the-Loop con drag & drop

### Objetivos del proyecto

- 🎯 **Facilitar la organización** de actividades lúdicas y educativas
- 🏃 **Promover el juego activo** sin depender de dispositivos electrónicos
- 🧠 **Desarrollar habilidades** de resolución de problemas y creatividad
- 🔧 **Demostrar Clean Architecture** con desacoplamiento de proveedores de IA
- 🔄 **Intercambiabilidad de LLMs** sin afectar la lógica de negocio

### Arquitectura y enfoque técnico

Este proyecto implementa **Clean Architecture** siguiendo el patrón **Ports & Adapters**, lo que permite:

- ✅ Cambiar de proveedor de IA (OpenAI ↔ Gemini ↔ N8N) sin modificar casos de uso
- ✅ Testing independiente de cada capa
- ✅ Mantenibilidad y escalabilidad a largo plazo
- ✅ Separación clara entre UI, lógica de negocio e infraestructura

**Palabras clave:** Clean Architecture, TypeScript, Next.js, IA Generativa, Multimodal AI, Supabase, Testing, TFM

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

- **Node.js** 20 o superior
- **pnpm** 8 o superior
- **Cuenta de Supabase** (plan gratuito disponible)
- **Proveedor de IA** (al menos uno):
  - Google Gemini API (recomendado, plan gratuito disponible)
  - N8N con workflow configurado (opcional)
  - OpenAI API (preparado pero usa mock por defecto)

### Guía de instalación paso a paso

#### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd entretemps
```

#### 2. Instalar dependencias

```bash
pnpm install
```

#### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configúralo con tus credenciales:

```bash
# En Windows (PowerShell)
copy .env.example .env.local

# En macOS/Linux
cp .env.example .env.local
```

Abre `.env.local` y configura las siguientes variables:

##### Variables OBLIGATORIAS

```bash
# Supabase (obligatorio)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Proveedor de IA (obligatorio - elige uno)
AI_PROVIDER=gemini                    # Opciones: 'gemini', 'n8n', 'openai'

# Si AI_PROVIDER=gemini (RECOMENDADO)
GEMINI_API_KEY=tu-gemini-api-key-aqui
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_TEMPERATURE=0.6
GEMINI_MAX_TOKENS=3500

# Si AI_PROVIDER=n8n
# N8N_WEBHOOK_URL=https://tu-instancia.n8n.cloud/webhook/entretemps
```

##### Variables OPCIONALES (mejoran la experiencia)

```bash
# Búsqueda de imágenes reales (recomendado)
PEXELS_API_KEY=tu-pexels-key-aqui

# Generación de imágenes con IA (opcional)
IMAGE_GENERATOR_PROVIDER=pollinations  # Opciones: 'pollinations', 'nanobanana', undefined
POLLINATIONS_API_KEY=tu-pollinations-key-aqui
```

**Notas importantes:**
- Las variables con `NEXT_PUBLIC_` son accesibles desde el navegador
- Las demás son **server-only** y nunca se exponen al cliente
- Si no configuras `PEXELS_API_KEY`, se usarán imágenes placeholder
- Si no configuras un generador de imágenes, solo se usará Pexels + placeholders

#### 4. Configurar Supabase

##### 4.1. Crear proyecto

1. Ve a [Supabase](https://supabase.com) y crea una cuenta (plan gratuito)
2. Crea un nuevo proyecto
3. Espera a que se complete la configuración (2-3 minutos)

##### 4.2. Obtener credenciales

1. Ve a **Project Settings** > **API**
2. Copia la **URL** del proyecto → `NEXT_PUBLIC_SUPABASE_URL`
3. Copia la **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

##### 4.3. Configurar autenticación OAuth

1. Ve a **Authentication** > **Providers**
2. Activa **Google** y/o **GitHub**
3. Configura las credenciales OAuth de cada proveedor
4. Añade `http://localhost:3000/auth/callback` a las URLs de redirección autorizadas

##### 4.4. Crear tablas de base de datos

Ejecuta las siguientes consultas SQL en **SQL Editor**:

```sql
-- Tabla principal de adventure packs
CREATE TABLE IF NOT EXISTS adventure_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pack_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_adventure_packs_user_id ON adventure_packs(user_id);
CREATE INDEX idx_adventure_packs_created_at ON adventure_packs(created_at);

-- Tabla de caché de imágenes para Pexels
CREATE TABLE IF NOT EXISTS image_cache (
  query TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  photographer TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_image_cache_created_at ON image_cache(created_at);

-- Habilitar Row Level Security
ALTER TABLE adventure_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_cache ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para adventure_packs
CREATE POLICY "Users can view their own packs"
  ON adventure_packs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own packs"
  ON adventure_packs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own packs"
  ON adventure_packs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own packs"
  ON adventure_packs FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para image_cache (acceso público)
CREATE POLICY "image_cache_select_policy" ON image_cache FOR SELECT USING (true);
CREATE POLICY "image_cache_insert_policy" ON image_cache FOR INSERT WITH CHECK (true);
CREATE POLICY "image_cache_update_policy" ON image_cache FOR UPDATE USING (true);
CREATE POLICY "image_cache_delete_policy" ON image_cache FOR DELETE USING (true);
```

#### 5. Obtener credenciales de proveedores de IA

##### Google Gemini (RECOMENDADO - Gratuito)

1. Ve a [Google AI Studio](https://aistudio.google.com/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Create API Key"**
4. Copia la key → `GEMINI_API_KEY` en `.env.local`

**Plan gratuito:** 15 requests/minuto, 1500 requests/día, 1 millón requests/mes

##### Pexels (OPCIONAL - Búsqueda de imágenes reales)

1. Ve a [Pexels API](https://www.pexels.com/api/)
2. Crea una cuenta gratuita
3. Solicita una API key
4. Copia la key → `PEXELS_API_KEY` en `.env.local`

**Plan gratuito:** 200 requests/hora, 20,000 requests/mes

##### Pollinations AI (OPCIONAL - Generación de imágenes)

1. Ve a [Pollinations.ai](https://pollinations.ai/)
2. Crea una cuenta y solicita una API key
3. Copia la key → `POLLINATIONS_API_KEY` en `.env.local`

#### 6. Ejecutar en desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en **[http://localhost:3000](http://localhost:3000)**

#### 7. Verificar la instalación

1. Abre http://localhost:3000
2. Haz clic en "Iniciar sesión"
3. Autentícate con Google/GitHub
4. Completa el wizard de 6 pasos
5. Genera tu primera aventura

Si todo funciona correctamente, deberías ver tu aventura generada con título, historia, personajes y misiones.

#### 8. Ejecutar tests

```bash
# Ejecutar todos los tests una vez
pnpm test:run

# Ejecutar tests en modo watch
pnpm test:watch

# Ejecutar tests E2E con Playwright
pnpm test:e2e

# Ver reporte de tests E2E
pnpm test:e2e:report
```

#### 9. Build para producción

```bash
pnpm build
pnpm start
```

La aplicación estará disponible en **[http://localhost:3000](http://localhost:3000)** en modo producción.

### Troubleshooting

#### Error: "Supabase client not initialized"
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén configurados
- Asegúrate de que las variables empiecen con `NEXT_PUBLIC_`

#### Error: "AI Provider not configured"
- Verifica que `AI_PROVIDER` esté configurado con un valor válido: `gemini`, `n8n`, o `openai`
- Si usas `gemini`, verifica que `GEMINI_API_KEY` esté configurado

#### Error: "Authentication failed"
- Verifica que hayas configurado OAuth en Supabase
- Asegúrate de que `http://localhost:3000/auth/callback` esté en las URLs de redirección
- Comprueba que `NEXT_PUBLIC_SITE_URL` sea `http://localhost:3000`

#### No se generan imágenes reales
- Si no has configurado `PEXELS_API_KEY`, se usarán placeholders (esto es normal)
- Verifica que la tabla `image_cache` exista en Supabase
- Revisa los logs del servidor en la consola para ver mensajes de error

#### Tests fallan
- Ejecuta `pnpm install` para asegurarte de que todas las dependencias estén instaladas
- Verifica que no haya conflictos de puertos (3000 ocupado)
- Algunos tests E2E requieren variables de entorno configuradas

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

## Despliegue en Producción

### Opción 1: Vercel (Recomendado)

Vercel es la plataforma oficial de Next.js y ofrece la mejor integración con el framework.

#### 1. Preparar el proyecto

```bash
# Asegúrate de que el proyecto compile sin errores
pnpm build

# Ejecuta los tests
pnpm test:run
```

#### 2. Desplegar en Vercel

**Opción A: Desde la interfaz web**

1. Ve a [Vercel](https://vercel.com) y crea una cuenta
2. Haz clic en **"Add New Project"**
3. Importa tu repositorio desde GitHub/GitLab/Bitbucket
4. Configura las variables de entorno (ver paso 3)
5. Haz clic en **"Deploy"**

**Opción B: Desde la CLI**

```bash
# Instalar Vercel CLI
pnpm install -g vercel

# Login
vercel login

# Desplegar
vercel
```

#### 3. Configurar variables de entorno en Vercel

Ve a **Project Settings** > **Environment Variables** y añade:

**Variables OBLIGATORIAS:**
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_SITE_URL=https://tu-app.vercel.app

AI_PROVIDER=gemini
GEMINI_API_KEY=tu-gemini-key
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_TEMPERATURE=0.6
GEMINI_MAX_TOKENS=3500
```

**Variables OPCIONALES:**
```
PEXELS_API_KEY=tu-pexels-key
IMAGE_GENERATOR_PROVIDER=pollinations
POLLINATIONS_API_KEY=tu-pollinations-key
```

**IMPORTANTE:**
- Marca las variables **server-only** (sin `NEXT_PUBLIC_`) como **Environment Variables** (no Server Functions)
- Las variables `NEXT_PUBLIC_*` pueden estar en cualquier entorno
- Actualiza `NEXT_PUBLIC_SITE_URL` con tu dominio de producción

#### 4. Configurar OAuth en Supabase

1. Ve a tu proyecto en Supabase > **Authentication** > **URL Configuration**
2. Añade la URL de producción a **Site URL**: `https://tu-app.vercel.app`
3. Añade a **Redirect URLs**: `https://tu-app.vercel.app/auth/callback`
4. Si usas dominio personalizado, añade también: `https://tu-dominio.com/auth/callback`

#### 5. Configurar dominio personalizado (Opcional)

1. En Vercel, ve a **Project Settings** > **Domains**
2. Añade tu dominio personalizado
3. Sigue las instrucciones para configurar DNS
4. Actualiza `NEXT_PUBLIC_SITE_URL` con tu dominio personalizado
5. Actualiza las **Redirect URLs** en Supabase

#### 6. Configurar analytics y monitoreo (Opcional)

Vercel ofrece analytics integrados:

1. Ve a **Analytics** en tu proyecto
2. Activa **Web Analytics** para métricas de rendimiento
3. Activa **Speed Insights** para Core Web Vitals

### Opción 2: Railway

Railway es una plataforma moderna con soporte nativo para Next.js.

#### 1. Preparar el proyecto

Crea un archivo `railway.json` en la raíz:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "pnpm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### 2. Desplegar

1. Ve a [Railway](https://railway.app) y crea una cuenta
2. Crea un nuevo proyecto desde GitHub
3. Railway detectará automáticamente Next.js
4. Configura las variables de entorno (mismo formato que Vercel)
5. Despliega con **"Deploy Now"**

### Opción 3: Render

Render ofrece hosting gratuito con algunas limitaciones.

#### 1. Configurar

Crea un archivo `render.yaml` en la raíz:

```yaml
services:
  - type: web
    name: entretemps
    env: node
    buildCommand: pnpm install && pnpm build
    startCommand: pnpm start
    envVars:
      - key: NODE_VERSION
        value: 20
```

#### 2. Desplegar

1. Ve a [Render](https://render.com) y crea una cuenta
2. Crea un nuevo **Web Service** desde GitHub
3. Configura las variables de entorno
4. Despliega con **"Create Web Service"**

### Opción 4: Docker (Auto-hosting)

Si prefieres desplegar en tu propio servidor, usa Docker.

#### 1. Crear Dockerfile

Crea un `Dockerfile` en la raíz (ya debería existir):

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
RUN corepack enable pnpm
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Consideraciones de Seguridad en Producción

#### 1. Variables de entorno

- ❌ **NUNCA** commitees archivos `.env.local` o `.env.production` al repositorio
- ✅ Usa **secrets management** de tu plataforma (Vercel Secrets, Railway Variables, etc.)
- ✅ Rota las API keys periódicamente
- ✅ Usa variables separadas para development/staging/production

#### 2. Supabase

- ✅ Habilita **Row Level Security (RLS)** en todas las tablas
- ✅ Configura políticas RLS restrictivas (users can only access their own data)
- ✅ Usa la **anon key** (no la service role key) en el frontend
- ✅ Limita los **CORS origins** en Supabase > API Settings

#### 3. APIs externas

- ✅ Todas las llamadas a APIs (Gemini, Pexels, etc.) deben ser **server-only**
- ✅ Implementa **rate limiting** para evitar abuse
- ✅ Monitorea el uso de APIs para detectar anomalías
- ✅ Configura **billing alerts** en Google Cloud (Gemini)

#### 4. Autenticación

- ✅ Configura **OAuth redirect URLs** solo para dominios autorizados
- ✅ Habilita **email verification** en Supabase
- ✅ Configura **session timeout** apropiado
- ✅ Implementa **CSRF protection** (Next.js lo hace por defecto)

#### 5. Headers de seguridad

Next.js configura automáticamente headers de seguridad, pero puedes reforzarlos en `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

### Monitoreo y Logs

#### Vercel

- **Build logs**: Automáticos en cada deploy
- **Runtime logs**: Disponibles en **Deployments** > **Function Logs**
- **Analytics**: Web Analytics y Speed Insights integrados

#### Sentry (Opcional)

Para error tracking avanzado:

```bash
pnpm add @sentry/nextjs
```

Configura en `sentry.client.config.js` y `sentry.server.config.js`.

#### Uptime monitoring

Usa servicios como:
- **Uptime Robot** (gratuito)
- **Better Uptime**
- **Pingdom**

### Checklist de pre-deploy

Antes de desplegar a producción, verifica:

- [ ] Tests pasan correctamente (`pnpm test:run`)
- [ ] Build local exitoso (`pnpm build`)
- [ ] Variables de entorno configuradas en plataforma
- [ ] Supabase RLS habilitado y políticas configuradas
- [ ] OAuth redirect URLs actualizadas
- [ ] Tabla `image_cache` creada en Supabase
- [ ] Tabla `adventure_packs` creada con índices
- [ ] API keys válidas y con límites apropiados
- [ ] Dominio personalizado configurado (si aplica)
- [ ] SSL/TLS habilitado (automático en Vercel/Railway)
- [ ] Headers de seguridad configurados
- [ ] Monitoreo de errores activo

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
