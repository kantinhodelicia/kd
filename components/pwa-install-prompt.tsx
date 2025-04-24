"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    const handler = (e: Event) => {
      // Prevent the default behavior
      e.preventDefault()
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show the install prompt
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    // We no longer need the prompt
    setDeferredPrompt(null)

    // Hide the install button
    if (outcome === "accepted") {
      setShowPrompt(false)
      setIsInstalled(true)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  if (!showPrompt || isInstalled) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700 md:left-auto md:right-8 md:w-80">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-white">Instalar Aplicativo</h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleDismiss}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-gray-300 mb-3">
        Instale o Kantinho Delícia no seu dispositivo para acesso rápido e offline.
      </p>
      <Button onClick={handleInstallClick} className="w-full bg-red-600 hover:bg-red-700">
        <Download className="mr-2 h-4 w-4" /> Instalar Aplicativo
      </Button>
    </div>
  )
}
