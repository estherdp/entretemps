# AGENTS.md — ENTRETEMPS

Stack: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + pnpm.
BD/Auth: Supabase. Tests: Vitest (+ Testing Library).

Estructura:
- src/app = rutes Next
- src/ui = UI/components
- src/domain = tipus + interfaces
- src/application = use cases
- src/infrastructure = supabase/ia/pdf
- src/lib = utils/config

Reglas:
- NO añadir dependencias nuevas sin consultarlo.
- NO lógica de negocio en la UI. La lógica va a application.
- IA/BD solo via infraestructure.
- TypeScript tipado (evitar `any`).

Conveciones:
- camelCase (funciones/variables), PascalCase (tipus/components), kebab-case (ficheros).

Testing:
- Tests separados en /tests (domain/application/ui/integration).
- Cada cambio => tests mínimos + ejecutar `pnpm test:run`.

Documentación:
- Si cambia algo en la estructura/flujo, actualiza README.

Output:
- Lista de ficheros modificados/creados.
- Contenido completo SOLO de los ficheros modificados.
- No reescribir ficheros no afectados.

Arquitectura (muy importante):
- En `src/app` y `src/ui` SOLO UI, estado local y handlers simples.
- Las llamadas a red (fetch), construcción de requests y validación de contratos van en `src/application` (casos de uso) o `src/infrastructure` (adaptadores).
- Las pages/steps NO deben llamar a endpoints directamente salvo que se pida explícitamente.
- `domain` no depende de Next, React ni SDKs externos.

