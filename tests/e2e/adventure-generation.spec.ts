import { test, expect } from '@playwright/test'
import { mockSuccessResponse, mockErrorResponse } from './fixtures/mock-adventure-data'

/**
 * E2E Tests - Generación de Aventuras con Mocking de APIs
 *
 * OBJETIVO: Testear el flujo completo de generación de aventuras
 * SIN consumir créditos de APIs de IA (Gemini, Pollinations).
 *
 * ESTRATEGIA: Usar page.route() de Playwright para interceptar
 * llamadas a /api/generate-adventure y devolver respuestas mockeadas.
 *
 * IMPORTANTE PARA EL TFM:
 * - Demuestra testing de integración sin costes
 * - Valida el manejo de errores de APIs externas
 * - Verifica la UX durante estados de carga y error
 * - Permite tests repetibles y rápidos en CI/CD
 */

test.describe('Adventure Generation - API Mocking', () => {
  /**
   * Setup: Completar el wizard rápidamente
   *
   * Navegamos por los pasos del wizard haciendo click en las opciones
   * necesarias para llegar a step-8 con datos válidos.
   *
   * FLUJO:
   * 1. Ocasión -> 2. Edades/Niños -> 3. Intereses -> 4. Lugar -> 5. Tipo -> 6. Tono -> 7. Dificultad -> 8. Generar
   */
  test.beforeEach(async ({ page }) => {
    // PASO 1: Seleccionar ocasión
    await page.goto('/wizard/step-1')
    await page.getByRole('button', { name: 'Cumpleaños' }).click()
    await page.getByRole('link', { name: 'Siguiente' }).click()

    // PASO 2: Edades y número de niños
    await expect(page).toHaveURL(/\/wizard\/step-2/)
    await page.locator('#age-min').fill('6')
    await page.locator('#age-max').fill('8')
    await page.locator('#num-children').fill('4')
    await page.getByRole('link', { name: 'Siguiente' }).click()

    // PASO 3: Intereses
    await expect(page).toHaveURL(/\/wizard\/step-3/)
    await page.locator('#interests').fill('dinosaurios y aventuras')
    await page.getByRole('link', { name: 'Siguiente' }).click()

    // PASO 4: Lugar
    await expect(page).toHaveURL(/\/wizard\/step-4/)
    await page.getByRole('button', { name: /Casa/i }).click()
    await page.getByRole('link', { name: 'Siguiente' }).click()

    // PASO 5: Tipo de aventura
    await expect(page).toHaveURL(/\/wizard\/step-5/)
    await page.getByRole('button', { name: 'Aventura' }).click()
    await page.getByRole('link', { name: 'Siguiente' }).click()

    // PASO 6: Tono
    await expect(page).toHaveURL(/\/wizard\/step-6/)
    await page.getByRole('button', { name: 'Emocionante' }).click()
    await page.getByRole('link', { name: 'Siguiente' }).click()

    // PASO 7: Dificultad
    await expect(page).toHaveURL(/\/wizard\/step-7/)
    await page.getByRole('button', { name: 'Fácil' }).click()
    await page.getByRole('link', { name: 'Siguiente' }).click()

    // Ahora estamos en step-8 con todos los datos completos
    await expect(page).toHaveURL(/\/wizard\/step-8/)
  })

  /**
   * Test 1: Flujo Exitoso con Datos Mockeados
   *
   * Verifica que la aplicación maneja correctamente una respuesta
   * exitosa de la API sin consumir créditos reales.
   */
  test('debe completar el flujo de generación usando datos mockeados', async ({ page }) => {
    // 1. INTERCEPTAR API: Mock de /api/generate-adventure con respuesta exitosa
    await page.route('**/api/generate-adventure', async (route) => {
      // Verificar que es un POST
      expect(route.request().method()).toBe('POST')

      console.log('[MOCK] Interceptado POST /api/generate-adventure')

      // Simular delay de API real (2 segundos)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Devolver respuesta mockeada exitosa
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSuccessResponse),
      })

      console.log('[MOCK] Respuesta enviada: 200 OK')
    })

    // 2. VERIFICAR UI INICIAL: Botón de generar visible y habilitado
    const generateButton = page.getByRole('button', { name: /Generar aventura/i })
    await expect(generateButton).toBeVisible()
    await expect(generateButton).toBeEnabled()

    // 3. VERIFICAR RESUMEN: Algunos datos del wizard se muestran
    await expect(page.getByText('6 - 8 años')).toBeVisible()
    await expect(page.getByText('4 participantes')).toBeVisible()
    await expect(page.getByText('dinosaurios y aventuras')).toBeVisible()

    // 4. ACCIÓN: Click en "Generar aventura"
    await generateButton.click()

    // 5. VERIFICAR ESTADO DE CARGA
    // Durante la generación, el botón debe mostrar "Generando..." y estar deshabilitado
    await expect(page.getByRole('button', { name: /Generando/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Generando/i })).toBeDisabled()

    // 6. ESPERAR NAVEGACIÓN: La app debe redirigir a /pack/result tras éxito
    await expect(page).toHaveURL(/\/pack\/result/, { timeout: 10000 })

    // 7. VERIFICAR RESULTADO: La página muestra la aventura generada
    // Título de la aventura mockeada
    await expect(page.getByRole('heading', { name: /La Expedición de los Dinosaurios Perdidos/i })).toBeVisible()

    // Verificar que la sección de misiones aparece
    await expect(page.getByRole('heading', { name: 'Misiones' })).toBeVisible()

    // Verificar que al menos una misión se muestra
    await expect(page.getByText('Descifrar el Mapa Antiguo')).toBeVisible()

    // Verificar información de la aventura
    await expect(page.getByText('6-8 años')).toBeVisible()
    await expect(page.getByText('60 min')).toBeVisible()
    await expect(page.getByText('4 niños')).toBeVisible()

    // 8. CAPTURA DE EVIDENCIA: Screenshot del resultado final
    await page.screenshot({
      path: 'tests/e2e/screenshots/adventure-generation-success.png',
      fullPage: true,
    })

    console.log('✅ Test completado: Generación exitosa con mock')
  })

  /**
   * Test 2: Manejo de Error de API (500 Internal Server Error)
   *
   * Verifica que la aplicación maneja correctamente errores de la API
   * y muestra mensajes apropiados al usuario.
   *
   * CRÍTICO PARA TFM: Demuestra resiliencia ante fallos de servicios externos.
   */
  test('debe manejar correctamente errores de API (500)', async ({ page }) => {
    // 1. INTERCEPTAR API: Mock de error 500
    await page.route('**/api/generate-adventure', async (route) => {
      console.log('[MOCK] Interceptado POST /api/generate-adventure')

      // Simular delay antes del error
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Devolver error 500
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify(mockErrorResponse),
      })

      console.log('[MOCK] Respuesta enviada: 500 Internal Server Error')
    })

    // 2. CLICK EN GENERAR
    const generateButton = page.getByRole('button', { name: /Generar aventura/i })
    await generateButton.click()

    // 3. VERIFICAR ESTADO DE CARGA (temporal)
    await expect(page.getByRole('button', { name: /Generando/i })).toBeVisible()

    // 4. VERIFICAR MENSAJE DE ERROR
    // La app debe mostrar el error y NO navegar a /pack/result
    await expect(page).toHaveURL(/\/wizard\/step-8/)

    // Buscar el mensaje de error en la UI
    const errorContainer = page.locator('.bg-red-50, [class*="bg-red"]').filter({ hasText: /error/i })
    await expect(errorContainer).toBeVisible({ timeout: 5000 })

    // Verificar que el error específico aparece
    await expect(page.locator('text=/Error al generar aventura/i')).toBeVisible()

    // 5. VERIFICAR QUE EL BOTÓN VUELVE A ESTAR HABILITADO
    // El usuario debe poder intentarlo de nuevo
    await expect(generateButton).toBeEnabled({ timeout: 2000 })

    // 6. CAPTURA DE EVIDENCIA: Screenshot del error
    await page.screenshot({
      path: 'tests/e2e/screenshots/adventure-generation-error-500.png',
      fullPage: true,
    })

    console.log('✅ Test completado: Manejo de error 500')
  })

  /**
   * Test 3: Verificación de Payload de Request
   *
   * Verifica que la aplicación envía todos los datos necesarios
   * del wizard en el formato correcto.
   */
  test('debe enviar payload completo con todos los datos del wizard', async ({ page }) => {
    let capturedRequest: any = null

    // Interceptar y capturar el request
    await page.route('**/api/generate-adventure', async (route) => {
      capturedRequest = route.request().postDataJSON()
      console.log('[MOCK] Request capturado:', JSON.stringify(capturedRequest, null, 2))

      await new Promise((resolve) => setTimeout(resolve, 1000))

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSuccessResponse),
      })
    })

    await page.getByRole('button', { name: /Generar aventura/i }).click()

    // Esperar navegación
    await expect(page).toHaveURL(/\/pack\/result/, { timeout: 10000 })

    // Verificar que el request capturado tiene los campos necesarios
    expect(capturedRequest).toBeDefined()
    expect(capturedRequest).toHaveProperty('occasion', 'birthday')
    expect(capturedRequest).toHaveProperty('ages')
    expect(capturedRequest.ages).toHaveProperty('min', 6)
    expect(capturedRequest.ages).toHaveProperty('max', 8)
    expect(capturedRequest).toHaveProperty('kidsCount', 4)
    expect(capturedRequest).toHaveProperty('interests', 'dinosaurios y aventuras')
    expect(capturedRequest).toHaveProperty('place', 'home')
    expect(capturedRequest).toHaveProperty('adventureType', 'adventure')
    expect(capturedRequest).toHaveProperty('tone', 'exciting')
    expect(capturedRequest).toHaveProperty('difficulty', 'easy')

    console.log('✅ Test completado: Payload validado correctamente')
  })
})
