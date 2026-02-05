# Tests End-to-End (E2E) - Entretemps

Este directorio contiene los tests E2E de la plataforma Entretemps, implementados con Playwright.

## Propósito

Los tests E2E verifican el funcionamiento completo de la aplicación desde la perspectiva del usuario, asegurando que:
- La plataforma está disponible y accesible
- Los flujos críticos funcionan correctamente
- La interfaz es responsive y accesible
- Se generan evidencias visuales para la documentación del TFM

## Estructura

```
tests/e2e/
├── README.md              # Este archivo
├── home.spec.ts           # Tests de la página principal (landing + authenticated)
└── screenshots/           # Capturas de evidencia para el TFM (commitear en git)
    ├── home-desktop.png
    ├── home-mobile-*.png
    └── ...
```

## Comandos

### Ejecutar todos los tests E2E
```bash
pnpm test:e2e
```

### Ejecutar un test específico
```bash
pnpm exec playwright test tests/e2e/home.spec.ts
```

### Ejecutar en modo UI (interactivo)
```bash
pnpm exec playwright test --ui
```

### Ejecutar solo en desktop (Chrome)
```bash
pnpm exec playwright test --project=chromium
```

### Ejecutar solo en móvil
```bash
pnpm exec playwright test --project="Mobile Chrome"
```

### Ver el reporte HTML
```bash
pnpm exec playwright show-report
```

### Modo debug (paso a paso)
```bash
pnpm exec playwright test --debug
```

## Tests Implementados

### `home.spec.ts`
Tests de la página principal:
- ✅ **Smoke test**: Verifica disponibilidad y elementos principales
- ✅ **Navegación**: CTAs funcionan correctamente
- ✅ **Responsive**: Adaptación móvil correcta
- ⏳ **Authenticated**: Vista de usuario autenticado (pendiente auth en tests)

## Evidencias Visuales

Las capturas en `screenshots/` son parte de la documentación del TFM y deben:
- ✅ Ser commitadas en Git
- ✅ Mostrar el estado funcional de la aplicación
- ✅ Demostrar la responsividad en diferentes dispositivos
- ✅ Incluirse en la memoria del TFM

## Convenciones

- **Nombres descriptivos**: Los tests deben explicar qué verifican
- **Comentarios exhaustivos**: Cada bloque explica el propósito (para defensa del TFM)
- **Capturas full-page**: Usar `fullPage: true` para documentación
- **Locators semánticos**: Usar `getByRole`, `getByText` (mejores prácticas de accesibilidad)

## Próximos Tests

- [ ] `/wizard/step-*` - Flujo completo de creación de aventura
- [ ] `/login` - Autenticación y registro
- [ ] `/my-adventures` - Gestión de aventuras guardadas
- [ ] Performance tests - Lighthouse CI
