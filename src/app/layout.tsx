import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { RepositoryProvider } from "@/ui/providers/repository-provider"
import { ConditionalNavbarWrapper } from "@/ui/components/conditional-navbar-wrapper"
import "./globals.css"

// Inter: Tipografía premium y profesional para SaaS
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Entretemps",
  description: "Crea aventuras épicas para tus hijos en minutos. Sin pantallas, solo risas y momentos inolvidables.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <RepositoryProvider>
          <ConditionalNavbarWrapper>
            {children}
          </ConditionalNavbarWrapper>
        </RepositoryProvider>
      </body>
    </html>
  )
}
