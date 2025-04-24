import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/context/cart-context"
import { MenuProvider } from "@/context/menu-context"
import { SalesProvider } from "@/context/sales-context"
import { AuthProvider } from "@/context/auth-context"
import { PWARegister } from "@/components/pwa-register"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Kantinho Delícia",
  description: "Menu de pizzas do Kantinho Delícia",
  manifest: "/manifest.json",
  themeColor: "#FF0000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kantinho Delícia",
  },
  formatDetection: {
    telephone: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Kantinho Delícia" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <MenuProvider>
              <SalesProvider>
                <CartProvider>
                  <PWARegister />
                  {children}
                  <PWAInstallPrompt />
                </CartProvider>
              </SalesProvider>
            </MenuProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
