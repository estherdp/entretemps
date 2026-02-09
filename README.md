<div align="center">

# 🎭 Entretemps

**Trabajo de Fin de Máster — Desarrollo Asistido por Inteligencia Artificial**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini-AI-8E75B2?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?style=for-the-badge&logo=playwright)](https://playwright.dev/)

> 🌟 Una plataforma web que devuelve a los niños el placer del juego real,
> usando IA generativa para crear aventuras personalizadas **sin pantallas**.

[Demo en Vivo](#) • [Documentación](#instalación) • [Slides del TFM](#)

</div>

---

## 📖 Descripción General

En una era donde los niños pasan cada vez más tiempo frente a dispositivos digitales, **Entretemps** nace con una misión clara: utilizar la inteligencia artificial como **puerta de entrada hacia el mundo físico**, no como destino final.

La aplicación permite a padres, educadores y organizadores crear en minutos un **pack de aventura completo** y personalizado para fiestas, excursiones o tardes en familia. La IA hace el trabajo pesado —historia, personajes, puzzles, guía de preparación— para que el adulto pueda centrarse en vivir la experiencia con los niños. El resultado es siempre un juego sin pantallas: mapas imprimibles, pistas físicas, puzzles manipulativos y narrativa que invita a moverse, colaborar e imaginar.

### 💡 La paradoja intencionada

> **Usamos tecnología de vanguardia para desconectar a los niños de la tecnología.**

### 🏗️ Arquitectura técnica

Desde el punto de vista técnico, el proyecto demuestra cómo una **Clean Architecture + Ports & Adapters** permite integrar múltiples proveedores de IA de forma intercambiable, sin acoplar la lógica de negocio a ningún SDK concreto. Este desacoplamiento es uno de los pilares evaluados en el máster.

---

## 🛠️ Stack Tecnológico

<table>
<tr>
<td width="33%" valign="top">

### Frontend
- **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS 4** (mobile-first)
- **shadcn/ui + Radix UI**
- **Lucide Icons**

</td>
<td width="33%" valign="top">

### Backend & Servicios
- **Supabase** (PostgreSQL)
- **Supabase Auth** (OAuth)
- **Google Gemini API**
- **@react-pdf/renderer**
- **@dnd-kit** (drag & drop)

</td>
<td width="33%" valign="top">

### Testing & DevOps
- **Vitest** (unit tests)
- **Playwright** (E2E tests)
- **Testing Library** (React)
- **Zod** (validation)
- **pnpm** (package manager)

</td>
</tr>
</table>

---

## 📂 Estructura del Proyecto

El código fuente sigue una estructura en capas que refleja directamente los principios de **Clean Architecture**:

```
entretemps/
├── 🧪 scripts/              # Scripts de prueba y herramientas de desarrollo
│   ├── test-multimodal.ts   # Pruebas del orquestador multimodal con diferentes proveedores
│   └── test-pollinations.ts # Verificación del adaptador de Pollinations AI
│
└── src/
    ├── 🎨 app/              # Next.js App Router (presentación y routing)
    │   ├── wizard/          # Flujo guiado de 6 pasos
    │   ├── pack/result/     # Visualización del pack generado
    │   ├── my-adventures/   # Biblioteca personal de aventuras
    │   ├── login/           # Autenticación OAuth
    │   └── api/             # API Routes (generate, regenerate, reorder, delete)
    │
    ├── 💼 application/      # Casos de uso — lógica de negocio pura
    │   ├── generate-pack.ts
    │   ├── generate-adventure-multimodal.ts
    │   ├── regenerate-mission.ts
    │   └── save-adventure-pack.ts
    │
    ├── 🧩 domain/           # Entidades e interfaces (ports)
    │   ├── services/        # Contratos de IA (IAdventureProvider, IImageGenerator…)
    │   ├── adventure-pack.ts
    │   └── wizard-data.ts
    │
    ├── 🔌 infrastructure/   # Adaptadores externos (implementan los ports)
    │   ├── ai/adapters/     # GeminiAdapter, OpenAIAdapter, NanobananaAdapter…
    │   ├── images/          # PexelsImageAdapter
    │   ├── n8n/             # N8NAdapter (workflow externo)
    │   └── supabase/        # Repositorios y cliente de base de datos
    │
    ├── 🎨 ui/               # Componentes React, hooks y providers
    │   ├── components/      # Button, Card, MissionCard, WizardShell…
    │   ├── hooks/           # useRegenerateMission, useSaveAdventurePack…
    │   └── wizard/          # Contexto y labels del wizard
    │
    ├── 📊 data/             # Datos estáticos y plantillas
    │   └── templates/       # Aventuras de ejemplo precargadas (examples.json)
    │
    └── 📚 lib/              # Schemas Zod, utilidades transversales
```

<details>
<summary><strong>🔍 Ver flujo de dependencias</strong></summary>

```mermaid
graph LR
    A[Domain] <-- implements --- B[Infrastructure]
    A <-- uses --- C[Application]
    B --> C
    C --> D[UI / API Routes]
    B --> D
```

**Principio clave:** `Domain` ← `Application` ← `Infrastructure / UI`

El dominio no conoce a nadie; la infraestructura implementa los contratos del dominio. **Cambiar de Gemini a OpenAI es sustituir un adaptador.**

</details>

---

## ✨ Funcionalidades

### 🧙‍♂️ Wizard de configuración personalizado

Un flujo de **6 pasos** guía al usuario desde cero hasta tener su aventura lista:

1. **Ocasión** → cumpleaños, fiesta familiar, excursión…
2. **Participantes** → número de niños y rango de edades
3. **Intereses** → gustos del protagonista (piratas, dinosaurios, magia…)
4. **Lugar** → casa, jardín, parque, interior o exterior
5. **Creatividad** → tipo de aventura, tono emocional y nivel de dificultad
6. **Resumen** → revisión antes de generar

> Cada paso valida el estado con **Zod** antes de avanzar. La configuración se envía al endpoint de generación como un único DTO tipado.

### 💾 Sistema de guardado y biblioteca de aventuras

Las aventuras generadas se guardan automáticamente en **Supabase** vinculadas al usuario autenticado:

- ✅ Listado de todos los packs generados
- ✅ Vista de detalle con historia, personajes, fases y puzzles completos
- ✅ **Regeneración individual de misiones** con feedback human-in-the-loop
- ✅ **Reordenamiento por drag & drop** con persistencia optimista
- ✅ Eliminación segura (RLS garantiza que solo el propietario puede borrar)

### 📱 Interfaz mobile-first

Diseñada desde el principio para dispositivos móviles con **Tailwind CSS 4**:

- 📐 Layouts adaptados a pantallas pequeñas primero, escritorio después
- 👆 Componentes táctiles con áreas de toque generosas
- ⚡ Skeleton loaders para transiciones suaves durante la generación de IA
- 🖼️ Portadas ilustradas con imagen de alta calidad adaptada al viewport

---

## 🚀 Instalación

### Requisitos previos

> [!IMPORTANT]
> Necesitas tener instalados:
> - **Node.js** 20 o superior
> - **pnpm** 8 o superior
> - Cuenta gratuita en [**Supabase**](https://supabase.com)
> - API key de [**Google Gemini**](https://aistudio.google.com/apikey) (plan gratuito disponible)

### Pasos de instalación

```bash
# 1️⃣ Clonar el repositorio
git clone <repository-url>
cd entretemps

# 2️⃣ Instalar dependencias
pnpm install

# 3️⃣ Crear archivo de variables de entorno
cp .env.example .env.local
```

### ⚙️ Variables de entorno requeridas

Edita `.env.local` con tus credenciales:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Proveedor de IA
AI_PROVIDER=gemini
GEMINI_API_KEY=<tu-gemini-api-key>
GEMINI_MODEL=gemini-2.5-flash-lite
```

<details>
<summary><strong>📍 ¿Dónde conseguir las credenciales?</strong></summary>

- **Supabase**: [supabase.com](https://supabase.com) → Project Settings → API
- **Gemini**: [aistudio.google.com/apikey](https://aistudio.google.com/apikey) → Create API Key

</details>

### 🏃 Ejecutar en desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en **[http://localhost:3000](http://localhost:3000)**

### 📦 Otros comandos útiles

```bash
pnpm build          # Build de producción
pnpm test:run       # Ejecutar tests unitarios
pnpm test:e2e       # Ejecutar tests E2E con Playwright
pnpm lint           # Análisis estático

# Scripts de prueba manual de adaptadores (desarrollo)
pnpm test:ai        # Probar orquestador multimodal con diferentes proveedores
pnpm test:images    # Verificar generación de imágenes con Pollinations AI
```

---

## 🗄️ Configuración de Base de Datos

> [!NOTE]
> Ejecuta las siguientes sentencias SQL en el **SQL Editor** de tu proyecto Supabase.

<details>
<summary><strong>📋 Tabla `adventure_packs`</strong></summary>

Almacena los packs de aventura generados por cada usuario.

```sql
CREATE TABLE IF NOT EXISTS adventure_packs (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  pack_json  JSONB       NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_adventure_packs_user_id   ON adventure_packs(user_id);
CREATE INDEX idx_adventure_packs_created_at ON adventure_packs(created_at);
```

</details>

<details>
<summary><strong>📋 Tabla `image_cache`</strong></summary>

Caché de búsquedas de imágenes (Pexels) con expiración de 24 horas para reducir llamadas a la API.

```sql
CREATE TABLE IF NOT EXISTS image_cache (
  query        TEXT        PRIMARY KEY,
  url          TEXT        NOT NULL,
  photographer TEXT,
  source_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_image_cache_created_at ON image_cache(created_at);
```

</details>

<details>
<summary><strong>🔒 Row Level Security (RLS)</strong></summary>

```sql
-- Habilitar RLS en ambas tablas
ALTER TABLE adventure_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_cache     ENABLE ROW LEVEL SECURITY;

-- Políticas para adventure_packs: cada usuario solo accede a sus propios datos
CREATE POLICY "users_select_own_packs" ON adventure_packs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_packs" ON adventure_packs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_packs" ON adventure_packs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users_delete_own_packs" ON adventure_packs
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para image_cache: acceso público (caché compartida, sin datos sensibles)
CREATE POLICY "image_cache_select" ON image_cache FOR SELECT USING (true);
CREATE POLICY "image_cache_insert" ON image_cache FOR INSERT WITH CHECK (true);
CREATE POLICY "image_cache_update" ON image_cache FOR UPDATE USING (true);
CREATE POLICY "image_cache_delete" ON image_cache FOR DELETE USING (true);
```

</details>

---

## ✅ Calidad y CI/CD

La estabilidad del proyecto se garantiza a través de una estrategia de testing en dos niveles y un pipeline de integración continua.

### 🎭 Testing con Playwright

Los tests end-to-end cubren los flujos críticos de la aplicación:

- ✅ Renderizado correcto de la home page y el wizard
- ✅ Navegación completa entre pasos del wizard
- ✅ Generación de aventuras (con mocks del proveedor de IA)
- ✅ Visualización del pack resultado y persistencia de aventuras

```bash
pnpm test:e2e          # Ejecución headless
pnpm test:e2e:ui       # Modo visual interactivo
pnpm test:e2e:report   # Ver reporte HTML
```

### 🧪 Testing unitario con Vitest

Cada capa arquitectónica tiene sus propios tests:

```
tests/
├── domain/         # Contratos y tipos de dominio
├── application/    # Casos de uso con mocks de adaptadores
├── infrastructure/ # Tests de adaptadores individuales
└── ui/             # Tests de componentes React
```

### 🔄 GitHub Actions (CI)

El pipeline de CI se ejecuta en cada push y pull request:

1. ⚙️ Instalación de dependencias (`pnpm install`)
2. 🔍 Análisis estático (`pnpm lint`)
3. 📦 Build de producción (`pnpm build`)
4. 🧪 Tests unitarios (`pnpm test:run`)
5. 🎭 Tests E2E con Playwright (`pnpm test:e2e`)

> [!WARNING]
> Ningún cambio llega a `main` sin pasar la batería completa de tests.

---

## 🚀 Próximos Pasos & Roadmap

El proyecto **Entretemps** está diseñado como base escalable para evolucionar hacia un producto completo. Las siguientes funcionalidades están contempladas en el roadmap técnico:

### 🔐 Evolución de la Autenticación

Implementación de **perfiles familiares** con gestión de múltiples niños por cuenta, permitiendo personalizar aventuras según el historial de cada menor. Integración completa con **OAuth2 (Google/Apple)** para facilitar el acceso desde dispositivos móviles nativos sin fricciones.

**💎 Valor:** Mejora la experiencia de usuario recurrente y habilita la personalización basada en preferencias históricas.

### 🎨 Generación Multimodal de Material Imprimible

Integración con modelos de generación de imágenes avanzados (**DALL-E 3, Stable Diffusion**) para crear material visual tematizado:

- 🗺️ Mapas del tesoro ilustrados con estilo coherente a la aventura
- 🏆 Diplomas personalizados para los participantes
- 🔍 Pistas visuales con iconografía adaptada al nivel de dificultad

Exportación automática a **PDF maquetado** con elementos visuales listos para imprimir en formato A4.

**💎 Valor:** Reduce el esfuerzo manual del organizador y aumenta el valor percibido del pack generado.

### 💰 Sostenibilidad y Control (FinOps)

Sistema de **créditos/tokens** para gestionar el consumo de APIs de IA generativa, permitiendo un modelo **freemium**:

- 🆓 Usuarios gratuitos: 3 aventuras básicas al mes
- 💎 Plan Premium: aventuras ilimitadas + regeneración de misiones + material visual avanzado

Implementación de **billing basado en Stripe** con seguimiento de costes por proveedor de IA y predicción de consumo.

**💎 Valor:** Monetización sostenible sin comprometer la accesibilidad del producto.

### 🎮 Gamificación y Feedback Loop

Sistema de **feedback post-aventura** donde los organizadores y participantes puntúan:

- 📊 Dificultad percibida vs. esperada
- 🎯 Engagement de los puzzles por edad
- 📖 Coherencia narrativa

Los datos alimentan un ciclo de **aprendizaje continuo** para que la IA ajuste las generaciones futuras según patrones de éxito por segmento de edad.

**💎 Valor:** Mejora iterativa de la calidad de las aventuras mediante data-driven insights.

---

## 📚 Recursos

| Recurso | Enlace |
|:--------|:-------|
| 🌐 Aplicación en producción | [entretemps.vercel.app](#) *(placeholder — sustituir por URL de Vercel)* |
| 📊 Presentación del TFM | [Ver slides](#) *(placeholder — sustituir por enlace a slides)* |
| 📖 Documentación de arquitectura de IA | [src/infrastructure/ai/README.md](src/infrastructure/ai/README.md) |
| 🤖 Google AI Studio (Gemini) | [aistudio.google.com](https://aistudio.google.com) |
| 🗄️ Supabase | [supabase.com](https://supabase.com) |

---

<div align="center">

### 🏷️ Palabras clave

`Clean Architecture` · `TypeScript` · `Next.js` · `IA Generativa` · `Supabase` · `Playwright` · `TFM` · `Ports & Adapters` · `Mobile-First` · `Screen-Free`

---

### 💭 Filosofía del proyecto

> **Entretemps** es un puente tecnológico para devolver el protagonismo al juego físico,
> demostrando que la IA puede ser una herramienta de **desconexión digital**
> en lugar de amplificar la dependencia de las pantallas.

---

**Hecho con 💜 como TFM del Máster en Desarrollo Asistido por IA**

</div>
