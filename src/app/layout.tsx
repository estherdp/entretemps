import type { Metadata } from "next"
import { Atkinson_Hyperlegible, Caveat, Young_Serif } from "next/font/google"
import { RepositoryProvider } from "@/ui/providers/repository-provider"
import { ConditionalNavbarWrapper } from "@/ui/components/conditional-navbar-wrapper"
import "./globals.css"

// Títulos con aire de libro de cuentos
const youngSerif = Young_Serif({
  variable: "--font-young-serif",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
})

// Texto de lectura: diseñada para máxima legibilidad (se lee en voz alta a los niños)
const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  display: "swap",
})

// Notas a mano en los márgenes del cuaderno
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Entretemps · Aventuras para jugar sin pantallas",
  description: "Crea en minutos una aventura de juego físico para tus hijos: historia, retos, pistas para esconder y todo listo para imprimir.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${youngSerif.variable} ${atkinson.variable} ${caveat.variable} font-sans antialiased`}>
        <RepositoryProvider>
          <ConditionalNavbarWrapper>
            {children}
          </ConditionalNavbarWrapper>
        </RepositoryProvider>
      </body>
    </html>
  )
}
