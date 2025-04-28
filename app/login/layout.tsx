import { Metadata, Viewport } from "next/types"

export const metadata: Metadata = {
  title: "Login | Kantinho Delícia",
  description: "Faça login para acessar o sistema do Kantinho Delícia",
}

export const viewport: Viewport = {
  themeColor: "#111827",
  width: "device-width",
  initialScale: 1,
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}