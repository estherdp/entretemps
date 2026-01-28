import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { RepositoryProvider } from "@/ui/providers/repository-provider"
import { ConditionalNavbarWrapper } from "@/ui/components/conditional-navbar-wrapper"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Entretemps",
  description: "Crea experiencias tipo escape room para tu familia",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
