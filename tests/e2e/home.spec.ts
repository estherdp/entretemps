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
    // Esto asegura que estamos en la aplicación correcta
    await expect(page).toHaveTitle(/Entretemps/)

    // 3. VERIFICACIÓN DE HERO SECTION: El título principal debe ser visible
    // Este es el primer elemento que ve un usuario al entrar
    const heroTitle = page.getByRole('heading', { name: 'Entretemps', level: 1 })
    await expect(heroTitle).toBeVisible()

    // 4. VERIFICACIÓN DE SUBTÍTULO: Descripción principal del servicio
    const subtitle = page.getByText('Aventuras infantiles personalizadas con IA')
    await expect(subtitle).toBeVisible()

    // 5. VERIFICACIÓN DE LLAMADAS A LA ACCIÓN (CTAs) en el Hero Section
    // Nota: Usamos locator de la main section para evitar conflictos con el navbar
    // Botón de "Iniciar Sesión" en el hero - debe estar presente y habilitado
    const heroSection = page.locator('main section').first()
    const loginButton = heroSection.getByRole('button', { name: /Iniciar Sesión/i })
    await expect(loginButton).toBeVisible()
    await expect(loginButton).toBeEnabled()

    // Botón de "Registrarse" - debe estar presente y habilitado
    const registerButton = heroSection.getByRole('button', { name: 'Registrarse' })
    await expect(registerButton).toBeVisible()
    await expect(registerButton).toBeEnabled()

    // 6. VERIFICACIÓN DE SECCIÓN DE CARACTERÍSTICAS
    // Esta sección explica el valor de la plataforma
    const featuresHeading = page.getByRole('heading', {
      name: '¿Qué puedes hacer con Entretemps?'
    })
    await expect(featuresHeading).toBeVisible()

    // Verificar que las 4 características principales están presentes
    await expect(page.getByText('Generación con IA')).toBeVisible()
    await expect(page.getByText('Personalización')).toBeVisible()
    await expect(page.getByText('Edición Human-in-the-Loop')).toBeVisible()
    await expect(page.getByText('Guías para Padres')).toBeVisible()

    // 7. VERIFICACIÓN DE CTA FINAL
    // Botón principal de conversión al final de la página
    const ctaButton = page.getByRole('button', { name: 'Comenzar Ahora' })
    await expect(ctaButton).toBeVisible()
    await expect(ctaButton).toBeEnabled()

    // 8. CAPTURA DE EVIDENCIA VISUAL (Desktop)
    // Esta captura se usará en la documentación del TFM
    await page.screenshot({
      path: 'tests/e2e/screenshots/home-desktop.png',
      fullPage: true // Captura toda la página, no solo el viewport
    })
  })

  /**
   * Test de funcionalidad: Navegación a login
   *
   * Verifica que los botones de CTA en el hero llevan correctamente a la página de login
   */
  test('debe navegar a login al hacer click en "Iniciar Sesión"', async ({ page }) => {
    await page.goto('/')

    // Click en el botón de "Iniciar Sesión" del hero section
    const heroSection = page.locator('main section').first()
    const loginButton = heroSection.getByRole('button', { name: /Iniciar Sesión/i })
    await loginButton.click()

    // Verificar que navegamos a la página de login
    await expect(page).toHaveURL(/\/login/)
  })

  /**
   * Test de funcionalidad: Navegación desde CTA secundario
   *
   * Verifica que el botón "Comenzar Ahora" también funciona correctamente
   */
  test('debe navegar a login al hacer click en "Comenzar Ahora"', async ({ page }) => {
    await page.goto('/')

    // Scroll hasta el botón (está al final de la página)
    const ctaButton = page.getByRole('button', { name: 'Comenzar Ahora' })
    await ctaButton.scrollIntoViewIfNeeded()

    await ctaButton.click()

    // Verificar navegación
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Home Page - Responsive Design', () => {
  /**
   * Test de responsividad en dispositivos móviles
   *
   * Verifica que la página se adapta correctamente a pantallas móviles
   * y que todos los elementos principales siguen siendo accesibles.
   *
   * IMPORTANTE para el TFM: La accesibilidad móvil es crítica porque
   * muchos padres accederán desde sus smartphones.
   */
  test('debe mostrar correctamente la landing page en móvil', async ({ page, isMobile }) => {
    // Solo ejecutar este test en dispositivos móviles
    test.skip(!isMobile, 'Este test es solo para dispositivos móviles')

    await page.goto('/')

    // 1. VERIFICACIÓN DE IDENTIDAD
    await expect(page).toHaveTitle(/Entretemps/)

    // 2. VERIFICACIÓN DE HERO ADAPTADO
    // En móvil, el texto debe adaptarse pero seguir visible
    const heroTitle = page.getByRole('heading', { name: 'Entretemps', level: 1 })
    await expect(heroTitle).toBeVisible()

    // 3. VERIFICACIÓN DE BOTONES EN LAYOUT MÓVIL
    // Los botones deben apilarse verticalmente en móvil (flex-col)
    const loginButton = page.getByRole('button', { name: 'Iniciar Sesión' })
    await expect(loginButton).toBeVisible()
    await expect(loginButton).toBeEnabled()

    // 4. VERIFICACIÓN DE CONTENIDO SCROLLEABLE
    // Todo el contenido debe ser accesible mediante scroll
    const featuresHeading = page.getByRole('heading', {
      name: '¿Qué puedes hacer con Entretemps?'
    })
    await featuresHeading.scrollIntoViewIfNeeded()
    await expect(featuresHeading).toBeVisible()

    // 5. VERIFICACIÓN DE CTA FINAL EN MÓVIL
    const ctaButton = page.getByRole('button', { name: 'Comenzar Ahora' })
    await ctaButton.scrollIntoViewIfNeeded()
    await expect(ctaButton).toBeVisible()

    // 6. CAPTURA DE EVIDENCIA VISUAL (Mobile)
    // Esta captura demuestra la adaptación responsive
    const deviceName = page.context().browser()?.browserType().name() || 'mobile'
    await page.screenshot({
      path: `tests/e2e/screenshots/home-mobile-${deviceName}.png`,
      fullPage: true
    })
  })

  /**
   * Test de layout responsive: Grid de características
   *
   * Verifica que el grid de 4 características se adapta correctamente
   * en diferentes tamaños de pantalla.
   */
  test('debe adaptar el grid de características correctamente', async ({ page, viewport }) => {
    await page.goto('/')

    const featuresSection = page.locator('section').filter({
      hasText: '¿Qué puedes hacer con Entretemps?'
    })

    await featuresSection.scrollIntoViewIfNeeded()

    // Verificar que las 4 características están presentes independientemente del viewport
    const featureCards = featuresSection.locator('[class*="grid"] > div')
    await expect(featureCards).toHaveCount(4)

    // Verificar que todas son visibles (aunque estén apiladas en móvil)
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
   * - H1: "Bienvenido a Entretemps"
   * - Botón: "✨ Crear nueva aventura"
   * - Sección: "Mis Aventuras"
   * - Sección: "Plantillas"
   */
  test.skip('debe mostrar la vista de usuario autenticado', async ({ page }) => {
    // TODO: Implementar autenticación en tests
    // - Configurar Supabase test client
    // - Crear usuario de prueba
    // - Realizar login programático

    await page.goto('/')

    // Verificaciones para usuario autenticado
    const welcomeTitle = page.getByRole('heading', {
      name: 'Bienvenido a Entretemps',
      level: 1
    })
    await expect(welcomeTitle).toBeVisible()

    const createButton = page.getByRole('button', {
      name: /Crear nueva aventura/
    })
    await expect(createButton).toBeVisible()
    await expect(createButton).toBeEnabled()

    // Captura para usuario autenticado
    await page.screenshot({
      path: 'tests/e2e/screenshots/home-authenticated-desktop.png',
      fullPage: true
    })
  })
})
