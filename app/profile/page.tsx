"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, User, Award, Pizza, History, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useSales } from "@/context/sales-context"
import { formatPrice } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, updateUserProfile, logout } = useAuth()
  const { orders } = useSales()
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState("")
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  })

  // Filtrar pedidos do usuário
  const userOrders = orders.filter((order) => user?.orderHistory.includes(order.id))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateMessage("")

    try {
      const success = await updateUserProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      })

      if (success) {
        setUpdateMessage("Perfil atualizado com sucesso!")
      } else {
        setUpdateMessage("Erro ao atualizar perfil. Tente novamente.")
      }
    } catch (error) {
      setUpdateMessage("Erro ao atualizar perfil. Tente novamente.")
    } finally {
      setIsUpdating(false)

      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setUpdateMessage("")
      }, 3000)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/menu">
              <Button variant="outline" className="text-white">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Menu
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Meu Perfil</h1>
            <Button onClick={handleLogout} variant="destructive" className="bg-red-600 hover:bg-red-700">
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-gray-800 border-gray-700 mb-6">
              <TabsTrigger value="profile" className="data-[state=active]:bg-red-600">
                <User className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="data-[state=active]:bg-red-600">
                <Award className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-red-600">
                <History className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          value={formData.email}
                          className="bg-gray-700 border-gray-600 text-white"
                          disabled
                        />
                        <p className="text-xs text-gray-400 mt-1">O email não pode ser alterado</p>
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Seu número de telefone"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Endereço</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Seu endereço"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                          </>
                        )}
                      </Button>
                    </div>

                    {updateMessage && (
                      <div
                        className={`p-3 rounded-md text-center ${
                          updateMessage.includes("sucesso")
                            ? "bg-green-600 bg-opacity-20 text-green-500"
                            : "bg-red-600 bg-opacity-20 text-red-500"
                        }`}
                      >
                        {updateMessage}
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="loyalty">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Programa de Fidelidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="bg-red-600 rounded-full p-6 mb-4">
                      <Award className="h-12 w-12" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Seus Pontos de Fidelidade</h2>
                    <div className="text-4xl font-bold text-red-500 mb-4">{user?.loyaltyPoints || 0}</div>
                    <p className="text-gray-400 text-center max-w-md mb-6">
                      Acumule pontos a cada pedido finalizado. A cada 10 pontos, você pode trocar por uma pizza pequena.
                      A cada 15 pontos, uma pizza média. E com 20 pontos, você ganha uma pizza familiar!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                      <RedeemCard title="Pizza Pequena" points={10} disabled={(user?.loyaltyPoints || 0) < 10} />
                      <RedeemCard title="Pizza Média" points={15} disabled={(user?.loyaltyPoints || 0) < 15} />
                      <RedeemCard title="Pizza Familiar" points={20} disabled={(user?.loyaltyPoints || 0) < 20} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Histórico de Pedidos</CardTitle>
                </CardHeader>
                <CardContent>
                  {userOrders.length > 0 ? (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div key={order.id} className="bg-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <span className="text-sm text-gray-400">Pedido #{order.id.substring(0, 8)}</span>
                              <h3 className="font-bold">{formatPrice(order.total)}</h3>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-gray-400">{order.date}</span>
                              <div
                                className={`text-sm ${
                                  order.status === "completed"
                                    ? "text-green-500"
                                    : order.status === "pending"
                                      ? "text-yellow-500"
                                      : "text-red-500"
                                }`}
                              >
                                {order.status === "completed"
                                  ? "Concluído"
                                  : order.status === "pending"
                                    ? "Pendente"
                                    : "Cancelado"}
                              </div>
                            </div>
                          </div>
                          <div className="border-t border-gray-600 pt-2 mt-2">
                            <h4 className="text-sm font-medium mb-1">Itens:</h4>
                            <ul className="text-sm text-gray-400">
                              {order.items.map((item, index) => (
                                <li key={index}>
                                  {item.quantity}x {item.name} - {item.price}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Você ainda não fez nenhum pedido.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}

interface RedeemCardProps {
  title: string
  points: number
  disabled: boolean
}

function RedeemCard({ title, points, disabled }: RedeemCardProps) {
  const { redeemLoyaltyPoints } = useAuth()
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [message, setMessage] = useState("")

  const handleRedeem = async () => {
    setIsRedeeming(true)
    setMessage("")

    try {
      const success = redeemLoyaltyPoints(points)

      if (success) {
        setMessage("Resgate realizado com sucesso!")
      } else {
        setMessage("Erro ao resgatar pontos.")
      }
    } catch (error) {
      setMessage("Erro ao resgatar pontos.")
    } finally {
      setIsRedeeming(false)

      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setMessage("")
      }, 3000)
    }
  }

  return (
    <div className={`bg-gray-700 rounded-lg p-4 text-center ${disabled ? "opacity-50" : ""}`}>
      <Pizza className="h-8 w-8 mx-auto mb-2" />
      <h3 className="font-bold mb-1">{title}</h3>
      <div className="text-sm text-gray-400 mb-3">{points} pontos</div>
      <Button onClick={handleRedeem} className="w-full bg-red-600 hover:bg-red-700" disabled={disabled || isRedeeming}>
        {isRedeeming ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resgatando...
          </>
        ) : (
          "Resgatar"
        )}
      </Button>
      {message && (
        <div className={`mt-2 text-xs ${message.includes("sucesso") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </div>
      )}
    </div>
  )
}
