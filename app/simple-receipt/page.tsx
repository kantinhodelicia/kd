"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { SimpleReceipt } from "@/components/simple-receipt"
import { useCart } from "@/context/cart-context"
import { useSales } from "@/context/sales-context"
import { useAuth } from "@/context/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SimpleReceiptPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { addOrder } = useSales()
  const { user, addLoyaltyPoints, updateUserProfile } = useAuth()
  const [isOrderFinalized, setIsOrderFinalized] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [earnedPoints, setEarnedPoints] = useState(0)

  // Estado para informações do cliente
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    deliveryPerson: "",
  })

  // Gerar data e hora atual formatadas
  const now = new Date()
  const isoDate = now.toISOString().split("T")[0]
  const formattedTime = now.toLocaleTimeString("pt-PT")

  // Calcular taxa de entrega (se houver item de zona)
  const deliveryItem = items.find((item) => item.type === "zona")
  const deliveryFee = deliveryItem ? Number(deliveryItem.price.replace("$00", "")) : 0

  // Taxa de caixa fixa
  const boxFee = 100

  // Agrupar extras com seus itens principais
  const mainItems = items.filter((item) => !item.parentItemId && item.type !== "zona")

  // Converter itens do carrinho para o formato simplificado
  const receiptItems = mainItems.map((item) => {
    // Encontrar extras associados a este item
    const itemExtras = items.filter((i) => i.parentItemId === item.id)

    const extrasForReceipt =
      itemExtras.length > 0
        ? itemExtras.map((extra) => ({
            name: extra.name,
            quantity: extra.quantity,
            price: extra.price,
          }))
        : undefined

    return {
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      extras: extrasForReceipt,
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleFinalizeOrder = () => {
    // Calcular pontos de fidelidade (1 ponto para cada pizza)
    const pizzaItems = items.filter(
      (item) => (item.type === "pizza" || item.type === "pizza-meio-meio") && !item.parentItemId,
    )
    const points = pizzaItems.reduce((total, item) => total + item.quantity, 0)

    // Gerar número de pedido
    const documentNumber = `KD-${Math.floor(Math.random() * 10000)}`

    // Registrar o pedido no contexto de vendas
    const orderId = addOrder({
      items: items,
      total: totalPrice + boxFee + deliveryFee,
      date: isoDate,
      time: formattedTime,
      status: "completed",
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      deliveryPerson: customerInfo.deliveryPerson,
      paymentMethod: "Dinheiro", // Valor padrão simplificado
      observations: "",
    })

    // Adicionar pontos de fidelidade ao usuário
    if (points > 0) {
      addLoyaltyPoints(points)
      setEarnedPoints(points)
    }

    // Adicionar o pedido ao histórico do usuário
    if (user) {
      const updatedOrderHistory = [...user.orderHistory, orderId]
      updateUserProfile({ orderHistory: updatedOrderHistory })
    }

    setOrderNumber(documentNumber)
    setIsOrderFinalized(true)
    clearCart()
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-950 text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Link href="/menu">
              <Button variant="outline" className="text-white">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Fatura Simplificada</h1>
          </div>

          {isOrderFinalized ? (
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <CheckCircle className="mx-auto text-green-500 h-16 w-16 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Pedido Finalizado!</h2>
              <p className="text-gray-300 mb-4">Seu pedido #{orderNumber} foi processado com sucesso.</p>

              {earnedPoints > 0 && (
                <div className="bg-gray-700 p-3 rounded-lg mb-4">
                  <p className="text-yellow-400 font-bold">Você ganhou {earnedPoints} pontos de fidelidade!</p>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-6">
                <Link href="/menu">
                  <Button className="w-full bg-red-600 hover:bg-red-700">Voltar ao Menu</Button>
                </Link>
                <Link href="/profile">
                  <Button className="w-full bg-gray-700 hover:bg-gray-600">Ver Meu Perfil</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {items.length === 0 ? (
                <div className="bg-gray-800 p-6 rounded-lg text-center">
                  <p className="text-gray-300 mb-4">Não há itens no carrinho para gerar uma fatura.</p>
                  <Link href="/menu">
                    <Button className="w-full bg-red-600 hover:bg-red-700">Voltar ao Menu</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="bg-gray-800 p-4 rounded-lg mb-6">
                    <h2 className="text-lg font-bold mb-4">Informações do Cliente</h2>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          name="name"
                          value={customerInfo.name}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Nome do cliente"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Telefone do cliente"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Endereço</Label>
                        <Input
                          id="address"
                          name="address"
                          value={customerInfo.address}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Endereço de entrega"
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliveryPerson">Entregador</Label>
                        <Input
                          id="deliveryPerson"
                          name="deliveryPerson"
                          value={customerInfo.deliveryPerson}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Nome do entregador"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg mb-6">
                    <SimpleReceipt
                      items={receiptItems}
                      subtotal={totalPrice}
                      deliveryFee={deliveryFee}
                      boxFee={boxFee}
                      total={totalPrice + boxFee + deliveryFee}
                      customerName={customerInfo.name}
                      customerPhone={customerInfo.phone}
                      customerAddress={customerInfo.address}
                      deliveryPerson={customerInfo.deliveryPerson}
                    />
                  </div>

                  <Button onClick={handleFinalizeOrder} className="w-full bg-green-600 hover:bg-green-700 py-4 text-lg">
                    Finalizar Pedido
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
