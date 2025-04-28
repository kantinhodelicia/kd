"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Link from "next/link"
import { parseCookies, setCookie } from "nookies"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, SettingsIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AuthGuard } from "@/components/auth-guard"

interface SystemSettings {
  businessName: string
  address: string
  city: string
  phone1: string
  phone2: string
  phone3: string
  taxRate: number
  enableAutoPrint: boolean
  defaultWhatsappNumber: string
  receiptFooter: string
  enableSalesGoals: boolean
  enableRealTimeUpdates: boolean
  dataRetentionDays: number
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    businessName: "KANTINHO DELÍCIA",
    address: "TERRA BRANCA, PRAIA",
    city: "ILHA DE SANTIAGO - CABO VERDE",
    phone1: "2616090",
    phone2: "5999204",
    phone3: "9352262",
    taxRate: 0,
    enableAutoPrint: false,
    defaultWhatsappNumber: "2385999204",
    receiptFooter: "OBRIGADO PELA PREFERÊNCIA!",
    enableSalesGoals: true,
    enableRealTimeUpdates: true,
    dataRetentionDays: 90,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Carregar configurações dos cookies
  useEffect(() => {
    const cookies = parseCookies()
    const savedSettings = cookies["kantinho-settings"]
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: name === "taxRate" || name === "dataRetentionDays" ? Number(value) : value,
    }))
  }

  const handleSwitchChange = (name: keyof SystemSettings) => {
    setSettings((prev) => ({
      ...prev,
      [name]: !prev[name as keyof SystemSettings],
    }))
  }

  const handleSave = () => {
    setIsSaving(true)

    // Salvar nos cookies
    setCookie(null, "kantinho-settings", JSON.stringify(settings), {
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: "/",
    })

    // Simular um delay para feedback visual
    setTimeout(() => {
      setIsSaving(false)
      setSaveMessage("Configurações salvas com sucesso!")

      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setSaveMessage("")
      }, 3000)
    }, 1000)
  }

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/admin">
              <Button variant="outline" className="text-white">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Admin
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <SettingsIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Informações do Negócio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Nome do Negócio</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={settings.businessName}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      name="address"
                      value={settings.address}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      name="city"
                      value={settings.city}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxRate">Taxa de Imposto (%)</Label>
                    <Input
                      id="taxRate"
                      name="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.taxRate}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="phone1">Telefone 1</Label>
                    <Input
                      id="phone1"
                      name="phone1"
                      value={settings.phone1}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone2">Telefone 2</Label>
                    <Input
                      id="phone2"
                      name="phone2"
                      value={settings.phone2}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone3">Telefone 3</Label>
                    <Input
                      id="phone3"
                      name="phone3"
                      value={settings.phone3}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Configurações de Fatura</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultWhatsappNumber">Número de WhatsApp Padrão</Label>
                    <Input
                      id="defaultWhatsappNumber"
                      name="defaultWhatsappNumber"
                      value={settings.defaultWhatsappNumber}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableAutoPrint"
                      checked={settings.enableAutoPrint}
                      onCheckedChange={() => handleSwitchChange("enableAutoPrint")}
                    />
                    <Label htmlFor="enableAutoPrint">Imprimir automaticamente ao finalizar pedido</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="receiptFooter">Mensagem de Rodapé da Fatura</Label>
                  <Textarea
                    id="receiptFooter"
                    name="receiptFooter"
                    value={settings.receiptFooter}
                    onChange={handleInputChange}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Configurações do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableSalesGoals"
                      checked={settings.enableSalesGoals}
                      onCheckedChange={() => handleSwitchChange("enableSalesGoals")}
                    />
                    <Label htmlFor="enableSalesGoals">Habilitar metas de vendas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableRealTimeUpdates"
                      checked={settings.enableRealTimeUpdates}
                      onCheckedChange={() => handleSwitchChange("enableRealTimeUpdates")}
                    />
                    <Label htmlFor="enableRealTimeUpdates">Atualizações em tempo real</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="dataRetentionDays">Retenção de Dados (dias)</Label>
                  <Input
                    id="dataRetentionDays"
                    name="dataRetentionDays"
                    type="number"
                    min="1"
                    value={settings.dataRetentionDays}
                    onChange={handleInputChange}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Período de tempo para manter os dados de vendas no sistema.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </div>

            {saveMessage && <div className="bg-green-600 text-white p-3 rounded-md text-center">{saveMessage}</div>}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
