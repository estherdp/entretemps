## Mejoras futuras (fuera del alcance del MVP)

### 1. Repositorio de aventuras predefinidas (“Rebost”)
Descripción:
Un catálogo de aventuras base que sirvan como punto de partida.

Objetivo:
Reducir fricción inicial y ofrecer inspiración a familias con menos tiempo o ideas.

Funcionamiento:
- Selección de aventura base
- Pre-rellenado del wizard
- Posibilidad de personalización completa




##PLANTILLA PROMPT OPTIMIZADO 
TASK:
[descriu un canvi petit i concret: 1-2 fitxers màxim]

FILES:
- Modify only: [path1, path2]
- Create only (if needed): [path]

CONSTRAINTS:
- No new deps
- Keep existing layout/structure unless explicitly requested
- Minimal code changes

TESTS:
- Add/update minimal tests in: tests/[ui|application|domain]/
- 1-2 assertions max
- Tests must pass with: pnpm test:run

OUTPUT:
- List changed files
- Full content of changed files only (no extra)
