# Abstracción de IA - Proveedores Intercambiables

Este directorio contiene los adaptadores de IA que implementan el patrón **Adapter** y demuestran el principio de **Inversión de Dependencias** (Dependency Inversion Principle).

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│             CAPA DE DOMINIO (Contratos)             │
│  - IAdventureProvider (Puerto/Interface)            │
│  - IImageGenerator (Puerto/Interface)               │
└─────────────────────────────────────────────────────┘
                        ▲
                        │ implementa
                        │
┌─────────────────────────────────────────────────────┐
│         CAPA DE INFRAESTRUCTURA (Adaptadores)       │
│  - N8NAdapter (implements IAdventureProvider)       │
│  - OpenAIAdapter (implements IAdventureProvider)    │
│  - GeminiAdapter (implements IAdventureProvider)    │
│  - NanobananaAdapter (implements IImageGenerator)   │
└─────────────────────────────────────────────────────┘
```

## Proveedores Disponibles

### Proveedores de Aventura (IAdventureProvider)

#### 1. N8NAdapter
Adaptador para el flujo externo de N8N (actualmente en producción).

**Ubicación:** `src/infrastructure/n8n/n8n-adapter.ts`

**Uso:**
```typescript
import { N8NAdapter } from '@/infrastructure/n8n/n8n-adapter'
import { generatePack } from '@/application/generate-pack'

const provider = new N8NAdapter() // Usa NEXT_PUBLIC_N8N_WEBHOOK_URL
const result = await generatePack(wizardData, provider)
```

#### 2. OpenAIAdapter (MOCK)
Adaptador para ChatGPT. Actualmente devuelve datos mock.

**Ubicación:** `src/infrastructure/ai/adapters/openai.adapter.ts`

**Uso:**
```typescript
import { OpenAIAdapter } from '@/infrastructure/ai/adapters'
import { generatePack } from '@/application/generate-pack'

const provider = new OpenAIAdapter()
const result = await generatePack(wizardData, provider)
```

#### 3. GeminiAdapter (MOCK)
Adaptador para Google Gemini. Actualmente devuelve datos mock.

**Ubicación:** `src/infrastructure/ai/adapters/gemini.adapter.ts`

**Uso:**
```typescript
import { GeminiAdapter } from '@/infrastructure/ai/adapters'
import { generatePack } from '@/application/generate-pack'

const provider = new GeminiAdapter()
const result = await generatePack(wizardData, provider)
```

### Proveedores de Imagen (IImageGenerator)

#### NanobananaAdapter (MOCK)
Adaptador para generación de imágenes. Actualmente devuelve URLs de Unsplash.

**Ubicación:** `src/infrastructure/ai/adapters/nanobanana.adapter.ts`

**Uso:**
```typescript
import { NanobananaAdapter } from '@/infrastructure/ai/adapters'

const imageGen = new NanobananaAdapter()
const image = await imageGen.generateImage('Una selva tropical mágica')
// Retorna: { url: string, prompt: string }
```

## Inversión de Dependencias (DIP)

La clave de esta arquitectura es que:

1. **La capa de Aplicación NO depende de Infrastructure**
   ```typescript
   // ❌ ANTES (acoplamiento directo)
   import { sendToN8N } from '@/infrastructure/n8n/n8n-adapter'

   // ✅ AHORA (depende de la abstracción)
   import type { IAdventureProvider } from '@/domain/services'
   ```

2. **Los adaptadores implementan las interfaces del Dominio**
   - Las interfaces viven en `src/domain/services/`
   - Los adaptadores viven en `src/infrastructure/`
   - El flujo de dependencias es: Infrastructure → Domain ← Application

3. **Intercambio de proveedores sin cambiar lógica de negocio**
   ```typescript
   // Cambiamos de proveedor simplemente cambiando el adaptador
   const provider = USE_N8N ? new N8NAdapter() : new OpenAIAdapter()
   const result = await generatePack(wizardData, provider)
   ```

## TODO: Implementaciones Reales

### OpenAI
- [ ] Configurar API Key en variables de entorno
- [ ] Implementar llamada a `openai.chat.completions.create()`
- [ ] Definir system prompt y estructura de respuesta
- [ ] Manejar rate limits y errores

### Gemini
- [ ] Configurar API Key en variables de entorno
- [ ] Implementar llamada a `generativeModel.generateContent()`
- [ ] Definir prompts y parámetros de generación
- [ ] Manejar rate limits y errores

### Nanobanana
- [ ] Configurar credenciales del servicio
- [ ] Implementar llamada a la API de generación de imágenes
- [ ] Gestionar almacenamiento de imágenes generadas
- [ ] Manejar timeouts y errores

## Pruebas

Para probar los diferentes proveedores:

```typescript
// tests/integration/adventure-providers.test.ts
import { describe, it, expect } from 'vitest'
import { OpenAIAdapter, GeminiAdapter } from '@/infrastructure/ai/adapters'
import { N8NAdapter } from '@/infrastructure/n8n/n8n-adapter'

const mockWizardData = {
  ages: { min: 6, max: 10 },
  kidsCount: 4,
  difficulty: 'medium',
  // ...
}

describe('Adventure Providers', () => {
  it('OpenAI provider should generate adventure', async () => {
    const provider = new OpenAIAdapter()
    const pack = await provider.generateAdventure(mockWizardData, 'es', {
      phases: 3,
      puzzlesPerPhase: 2,
      screenFree: true,
    })
    expect(pack.title).toBeTruthy()
    expect(pack.missions).toHaveLength(3)
  })

  // ... más tests
})
```
