# CLAUDE.md — Entretemps

Este documento define **cómo debe actuar cualquier IA** que me ayude a escribir código en este proyecto.

Objetivo: **mantener el proyecto simple, coherente y viable como MVP**.

---

## 1. Contexto

**Nombre:** Entretemps  
**Tipo:** TFM (Máster en IA)  
**Producto:** Aplicación web mobile-first para crear experiencias tipo escape room familiares.  
**Usuarios:** Familias.

La app guía al usuario con un wizard y genera un “Pack de aventura”.
El resultado es una **experiencia real**, no un juego digital.

---

## 2. Stack (OBLIGATORIO)

- Framework: **Next.js (App Router)**
- Lenguaje: **TypeScript**
- UI: **Tailwind CSS + shadcn/ui**
- Base de datos: **Supabase (PostgreSQL)**
- Auth: **Supabase Auth (email magic link / OTP)**
- IA: Provider externo vía `.env`
- PDF: **@react-pdf/renderer**
- Paquetes: **pnpm**

❌ No añadir frameworks, ORMs ni librerías extra.

---

## 3. Estructura del proyecto
src/
app/ → Rutas Next.js
ui/ → Componentes UI
domain/ → Tipos e interfaces
application/ → Casos de uso
infrastructure/ → BD, IA, PDF
lib/ → Utilidades


Reglas:
- La UI no tiene lógica de negocio
- La IA no se llama desde componentes
- La lógica vive en `application/`

---

## 4. Convenciones de código

### Nombres
- Funciones y variables: `camelCase`
- Clases y tipos: `PascalCase`
- Archivos: `kebab-case.ts`
- Componentes React: `PascalCase`

### Código
- Usar TypeScript tipado (evitar `any`)
- Funciones pequeñas y claras
- Usar `async/await`
- No sobrearquitecturar

### Comentarios
- Solo cuando expliquen el **por qué**
- No comentar lo obvio

---

## 5. Uso de IA

- 1 llamada principal por aventura
- Regeneraciones limitadas
- Respuesta **siempre en JSON**
- Validar el JSON antes de usarlo
- La IA solo genera contenido

---

## 6. Base de datos

- Tablas pequeñas
- Guardar la aventura como **JSON**
- Acceso a datos mediante repositorios

---

## 7. UI / UX

- Diseño mobile-first
- Una acción principal por pantalla
- Textos claros
- Usar shadcn/ui como base

---

## 8. Objetivo del MVP

Tiempo: **1 mes**

Flujo esencial:
> wizard → generar aventura → exportar PDF

Todo lo demás es mejora futura.

---

## 9. Cómo debe responder la IA

- Respetar este documento
- Generar solo lo pedido
- Explicar brevemente el código
- Preguntar si algo no está claro

---

## 10. Idea clave

> “Entretemps crea experiencias reales, no juegos digitales.”


## 11. Documentación del proyecto

La IA debe ayudar a **documentar el proyecto de forma progresiva**.

Reglas:
- Mantener un `README.md` en la raíz del proyecto
- Actualizar el README cuando se añadan:
  - nuevas capas (domain, application, etc.)
  - casos de uso importantes
  - decisiones técnicas relevantes
- La documentación debe ser:
  - clara
  - breve
  - orientada a explicar el **por qué**, no solo el qué

El README debe incluir como mínimo:
- Descripción del proyecto
- Stack tecnológico
- Estructura de carpetas
- Cómo ejecutar el proyecto en local
- Estado actual del MVP

❌ No generar documentación excesiva ni académica.


## Testing (OBLIGATORIO)

El proyecto utiliza **Vitest** para tests unitarios e integración y **Testing Library** para componentes UI.

### Objetivo
Asegurar que cada implementación nueva se verifica con tests y que el flujo del MVP no se rompe.

### Reglas
- Cada nueva funcionalidad relevante debe incluir tests.
- Priorizar tests de:
  - lógica de negocio (`application/`)
  - validaciones (`domain/` y schemas)
  - componentes UI críticos (`ui/`)
- Antes de dar una tarea por terminada:
  - los tests deben pasar
  - no se deben romper tests existentes
- Los tests se ejecutan con:
  - `pnpm test:run` (ejecución completa)
  - `pnpm test:watch` (durante desarrollo)

### Ubicación de los tests
Los tests se almacenan en un directorio independiente:
tests/
domain/
application/
ui/
integration/


Convención:
- El nombre del test debe reflejar el archivo que prueba.
- Sufijo obligatorio: `.test.ts` o `.test.tsx`.

Ejemplos:
- `src/application/generate-adventure-pack.ts` → `tests/application/generate-adventure-pack.test.ts`
- `src/ui/components/WizardStep.tsx` → `tests/ui/WizardStep.test.tsx`

### Qué debe entregar la IA cuando genere código
- Crear/actualizar los tests necesarios.
- Indicar qué tests se han añadido.
- Explicar brevemente qué comprueban.
- Mantener los tests **simples, deterministas y rápidos** (sin llamadas reales a red).




