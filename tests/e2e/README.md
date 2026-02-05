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
├── README.md                       # Este archivo
├── home.spec.ts                    # Tests de la página principal
├── adventure-generation.spec.ts    # Tests de generación de aventuras (con API mocking)
├── fixtures/
│   └── mock-adventure-data.ts      # Datos mock para tests sin coste
└── screenshots/                    # Capturas de evidencia (NO commitear - ver .gitignore)
    ├── home-desktop.png
    ├── home-mobile-*.png
    ├── adventure-generation-success.png
    └── adventure-generation-error-500.png
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

### `adventure-generation.spec.ts` ⭐ NUEVO
Tests del flujo completo de generación de aventuras **CON API MOCKING**:
- ✅ **Flujo exitoso mockeado**: Completa wizard + genera aventura sin consumir créditos de IA
- ✅ **Manejo de error 500**: Verifica resiliencia ante fallos de API externa
- ✅ **Validación de payload**: Verifica que se envían todos los datos del wizard correctamente

**Técnicas avanzadas**:
- 🎭 **API Interception**: Usa `page.route()` para interceptar llamadas a `/api/generate-adventure`
- 💰 **Sin coste**: Tests repetibles sin consumir créditos de Gemini/Pollinations
- ⚡ **Simulación realista**: Incluye delays para simular latencia de APIs reales
- 🔍 **Inspección de requests**: Captura y valida el payload enviado al backend

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

- [x] `/wizard/step-*` - Flujo completo de creación de aventura ✅ COMPLETADO
- [ ] `/login` - Autenticación y registro
- [ ] `/my-adventures` - Gestión de aventuras guardadas
- [ ] `/pack/result` - Edición y guardado de aventuras generadas
- [ ] Performance tests - Lighthouse CI
