# Diagnóstico: Error PKCE en Autenticación

## Problema
Error `AuthPKCECodeVerifierMissingError` al intentar iniciar sesión con magic link.

## Causa
El flujo PKCE (Proof Key for Code Exchange) requiere que el código verificador se almacene en cookies y se recupere cuando el usuario hace clic en el magic link. Si el usuario:
- Abre el link en un navegador diferente
- Las cookies fueron limpiadas
- Hay problemas de configuración SSR

El código verificador no se encuentra y la autenticación falla.

## ✅ Solución Implementada

### 1. Route Handler del Servidor (PRINCIPAL)
**Archivo creado:** `src/app/auth/callback/route.ts`

El problema principal era que usábamos una página de cliente (`page.tsx`) para manejar el callback de autenticación. Esto no funciona correctamente con PKCE porque:
- Las cookies del servidor no se comparten con el cliente de forma automática
- El intercambio de código debe hacerse en el servidor para acceder a las cookies

**Solución:**
- Creado Route Handler que se ejecuta en el servidor
- Usa `createServerClient` con acceso completo a cookies del servidor
- Maneja el intercambio de código correctamente
- Proporciona mensajes de error específicos para cada caso

### 2. Mejor manejo de errores
- Detección específica de errores PKCE
- Mensajes informativos para el usuario
- Parámetros de error en la URL para persistir el mensaje
- Redirección a login con contexto del error

### 3. Actualización de la página de login
- Lee parámetros de error de la URL
- Muestra mensajes personalizados según el tipo de error
- Maneja errores PKCE, auth, sesión e invalid callback

## Solución Recomendada (Configuración Supabase)

Para evitar completamente el error PKCE con magic links, se recomienda deshabilitar PKCE para el flujo OTP en Supabase:

### Pasos en Supabase Dashboard:
1. Ir a **Authentication** > **URL Configuration**
2. En **Auth Flow Type**, seleccionar **"Implicit flow"** en lugar de **"PKCE flow"**
3. Guardar cambios

### O Alternativamente:
1. Ir a **Authentication** > **Providers** > **Email**
2. Desmarcar **"Enable PKCE flow"** si está disponible

## Notas Técnicas

### ¿Por qué los Magic Links no necesitan PKCE?
- Los magic links son tokens de un solo uso enviados por email
- Ya son seguros por diseño (solo el propietario del email puede acceder)
- PKCE está diseñado para proteger flujos OAuth donde el código puede ser interceptado
- Para magic links, PKCE agrega complejidad sin beneficios significativos de seguridad

### Flujo Actual:
1. Usuario solicita magic link → Se genera PKCE verifier y se guarda en cookies
2. Usuario recibe email con link
3. Usuario hace clic en link → Se debe recuperar PKCE verifier de cookies
4. Si cookies no están disponibles → Error

### Flujo sin PKCE (Recomendado para Magic Links):
1. Usuario solicita magic link
2. Usuario recibe email con link
3. Usuario hace clic en link → Autenticación directa
4. ✅ Sin dependencia de cookies/storage entre pasos

## Alternativas si no se puede cambiar configuración Supabase

### Opción 1: Instruir al usuario
Agregar mensaje en la página de login:
"Por favor, asegúrate de abrir el enlace de inicio de sesión en el mismo navegador donde lo solicitaste."

### Opción 2: Middleware Next.js
Crear middleware para gestión más robusta de cookies (ya implementado en auth-server.ts para rutas API).

## Referencias
- [Supabase Auth with PKCE](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)
- [Next.js with Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)
