import { test, expect } from '@playwright/test'

/**
 * E2E Smoke Test - Home Page
 *
 * Objetivo: Verificar la disponibilidad de la plataforma Entretemps
 * y capturar evidencias visuales para la documentación del TFM.
 *
 * Este test verifica:
 * 1. Que la aplicación está disponible y carga correctamente
 * 2. Que la identidad de la plataforma (título) está presente
 * 3. Que los elementos principales de UI son visibles y accesibles
 * 4. Que la experiencia es responsive en diferentes dispositivos
 */

test.describe('Home Page - Landing (No Auth)', () => {
  /**
   * Test de disponibilidad y elementos principales (Desktop)
   *
   * Verifica que un usuario no autenticado puede acceder a la landing page
   * y que todos los elementos críticos están presentes y funcionales.
   */
  test('debe mostrar la landing page con todos los elementos principales', async ({ page }) => {
    // 1. NAVEGACIÓN: Ir a la página principal
    await page.goto('/')

    // 2. VERIFICACIÓN DE IDENTIDAD: Comprobar que el título de la página es correcto
    await expect(page).toHaveTitle(/Entretemps/)

    // 3. VERIFICACIÓN DE HERO SECTION: El badge de marca y el titular principal
    const brandBadge = page.getByText(/Entretemps/)
    await expect(brandBadge.first()).toBeVisible()

    const heroTitle = page.getByRole('heading', { name: /La magia de jugar juntos/i, level: 1 })
    await expect(heroTitle).toBeVisible()

    // 4. VERIFICACIÓN DE SUBTÍTULO: Descripción centrada en familia
    const subtitle = page.getByText(/Crea aventuras épicas para tus hijos en minutos/i)
    await expect(subtitle).toBeVisible()

    // 5. VERIFICACIÓN DE LLAMADAS A LA ACCIÓN (CTAs) en el Hero Section
    const heroSection = page.locator('main section').first()
    const ctaButton = heroSection.getByRole('button', { name: /¡Crear mi primera aventura!/i })
    await expect(ctaButton).toBeVisible()
    await expect(ctaButton).toBeEnabled()

    const loginButton = heroSection.getByRole('button', { name: /Ya tengo cuenta/i })
    await expect(loginButton).toBeVisible()
    await expect(loginButton).toBeEnabled()

    // 6. VERIFICACIÓN DE SECCIÓN DE CARACTERÍSTICAS
    const featuresHeading = page.getByRole('heading', {
      name: /Todo lo que necesitas para una aventura épica/i
    })
    await expect(featuresHeading).toBeVisible()

    // Verificar que las 4 características principales están presentes
    await expect(page.getByText('Aventuras únicas en minutos')).toBeVisible()
    await expect(page.getByText('Hecha para tu familia')).toBeVisible()
    await expect(page.getByText('Explora cualquier espacio')).toBeVisible()
    await expect(page.getByText('Tú tienes el control')).toBeVisible()

    // 7. VERIFICACIÓN DE SECCIÓN "Para padres, por padres"
    const parentsSection = page.getByRole('heading', { name: /Para padres, por padres/i })
    await expect(parentsSection).toBeVisible()

    // 8. VERIFICACIÓN DE CTA FINAL
    const finalCtaButton = page.getByRole('button', { name: /¡Vamos allá!/i })
    await expect(finalCtaButton).toBeVisible()
    await expect(finalCtaButton).toBeEnabled()

    // 9. CAPTURA DE EVIDENCIA VISUAL (Desktop)
    await page.screenshot({
      path: 'tests/e2e/screenshots/home-desktop.png',
      fullPage: true
    })
  })

  /**
   * Test de funcionalidad: Navegación a login desde CTA principal
   */
  test('debe navegar a login al hacer click en "¡Crear mi primera aventura!"', async ({ page }) => {
    await page.goto('/')

    const heroSection = page.locator('main section').first()
    const ctaButton = heroSection.getByRole('button', { name: /¡Crear mi primera aventura!/i })
    await ctaButton.click()

    await expect(page).toHaveURL(/\/login/)
  })

  /**
   * Test de funcionalidad: Navegación desde CTA final
   */
  test('debe navegar a login al hacer click en "¡Vamos allá!"', async ({ page }) => {
    await page.goto('/')

    const ctaButton = page.getByRole('button', { name: /¡Vamos allá!/i })
    await ctaButton.scrollIntoViewIfNeeded()
    await ctaButton.click()

    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Home Page - Responsive Design', () => {
  /**
   * Test de responsividad en dispositivos móviles
   */
  test('debe mostrar correctamente la landing page en móvil', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Este test es solo para dispositivos móviles')

    await page.goto('/')

    // 1. VERIFICACIÓN DE IDENTIDAD
    await expect(page).toHaveTitle(/Entretemps/)

    // 2. VERIFICACIÓN DE HERO ADAPTADO
    const heroTitle = page.getByRole('heading', { name: /La magia de jugar juntos/i, level: 1 })
    await expect(heroTitle).toBeVisible()

    // 3. VERIFICACIÓN DE BOTONES EN LAYOUT MÓVIL
    const ctaButton = page.getByRole('button', { name: /¡Crear mi primera aventura!/i })
    await expect(ctaButton).toBeVisible()
    await expect(ctaButton).toBeEnabled()

    // 4. VERIFICACIÓN DE CONTENIDO SCROLLEABLE
    const featuresHeading = page.getByRole('heading', {
      name: /Todo lo que necesitas para una aventura épica/i
    })
    await featuresHeading.scrollIntoViewIfNeeded()
    await expect(featuresHeading).toBeVisible()

    // 5. VERIFICACIÓN DE CTA FINAL EN MÓVIL
    const finalCtaButton = page.getByRole('button', { name: /¡Vamos allá!/i })
    await finalCtaButton.scrollIntoViewIfNeeded()
    await expect(finalCtaButton).toBeVisible()

    // 6. CAPTURA DE EVIDENCIA VISUAL (Mobile)
    const deviceName = page.context().browser()?.browserType().name() || 'mobile'
    await page.screenshot({
      path: `tests/e2e/screenshots/home-mobile-${deviceName}.png`,
      fullPage: true
    })
  })

  /**
   * Test de layout responsive: Grid de características
   */
  test('debe adaptar el grid de características correctamente', async ({ page }) => {
    await page.goto('/')

    const featuresSection = page.locator('section').filter({
      hasText: /Todo lo que necesitas para una aventura épica/i
    })

    await featuresSection.scrollIntoViewIfNeeded()

    // Verificar que las 4 características están presentes independientemente del viewport
    const featureCards = featuresSection.locator('[class*="grid"] > div')
    await expect(featureCards).toHaveCount(4)

    // Verificar que todas son visibles
    for (let i = 0; i < 4; i++) {
      await expect(featureCards.nth(i)).toBeVisible()
    }
  })
})

test.describe('Home Page - Authenticated User', () => {
  /**
   * Test de vista para usuarios autenticados
   *
   * NOTA: Este test actualmente verifica el comportamiento sin auth.
   * En el futuro, cuando se implemente la autenticación en los tests,
   * este test debe modificarse para verificar el contenido autenticado.
   *
   * Comportamiento esperado CON autenticación:
   * - H1: "¡Hola, explorador! 🗺️"
   * - Botón: "✨ ¡Nueva aventura!"
   * - Sección: "Mis Aventuras"
   * - Sección: "Plantillas"
   */
  test.skip('debe mostrar la vista de usuario autenticado', async ({ page }) => {
    // TODO: Implementar autenticación en tests
    await page.goto('/')

    const welcomeTitle = page.getByRole('heading', {
      name: /¡Hola, explorador!/i,
      level: 1
    })
    await expect(welcomeTitle).toBeVisible()

    const createButton = page.getByRole('button', {
      name: /¡Nueva aventura!/i
    })
    await expect(createButton).toBeVisible()
    await expect(createButton).toBeEnabled()

    await page.screenshot({
      path: 'tests/e2e/screenshots/home-authenticated-desktop.png',
      fullPage: true
    })
  })
})
