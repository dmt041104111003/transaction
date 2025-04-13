import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LMS | Cardano",
  description: "LMS - Verify",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <main className="min-h-screen bg-background">
            <header className="border-b gradient-border">
              <div className="container mx-auto py-6">
                <h1 className="text-3xl md:text-4xl font-bold text-center gradient-text">Welcome to Lms - Cardano</h1>
              </div>
            </header>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'