"use client"
import { useState } from "react"
import { Receipt } from "@/components/receipt"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft, Award } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/cart-context"
import { useSales } from "@/context/sales-context"
import { useAuth } from "@/context/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { v4 as uuidv4 } from "uuid"

export default function ReceiptPage() {
  const [isOrderFinalized, setIsOrderFinalized] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [earnedPoints, setEarnedPoints] = useState(0)
  const { items, totalPrice, clearCart } = useCart()
  const { addOrder } = useSales()
  const { user, addLoyaltyPoints, updateUserProfile } = useAuth()

  // Gerar data e hora atual formatadas
  const now = new Date()
  const formattedDate = now.toLocaleDateString("pt-PT")
  const formattedTime = now.toLocaleTimeString("pt-PT")
  const isoDate = now.toISOString().split("T")[0]

  // Gerar número de documento único
  const documentNumber = orderNumber || `KD-${Math.floor(Math.random() * 10000)}`

  // Agrupar extras com seus itens principais
  const groupedItems = items.filter((item) => !item.parentItemId)

  // Converter itens do carrinho para o formato da fatura
  const receiptItems = groupedItems.map((item, index) => {
    // Extrair o valor numérico do preço (remover "$00")
    const priceMatch = item.price.match(/(\d+)\$00/)
    const unitPrice = priceMatch ? Number.parseInt(priceMatch[1]) : 0

    // Encontrar extras associados a este item
    const itemExtras = items.filter((i) => i.parentItemId === item.id)

    const extrasForReceipt =
      itemExtras.length > 0
        ? itemExtras.map((extra) => {
            const extraPriceMatch = extra.price.match(/(\d+)\$00/)
            const extraUnitPrice = extraPriceMatch ? Number.parseInt(extraPriceMatch[1]) : 0

            return {
              description: extra.name,
              quantity: extra.quantity,
              unitPrice: extraUnitPrice,
              totalPrice: extraUnitPrice * extra.quantity,
            }
          })
        : undefined

    return {
      code: `KD-${index + 1}`,
      description: item.name,
      quantity: item.quantity,
      unitPrice: unitPrice,
      totalPrice: unitPrice * item.quantity,
      unit: item.type === "zona" ? "SV" : "PC",
      isHalfPizza: item.type === "pizza-meio-meio",
      firstHalf: item.firstHalf?.name,
      secondHalf: item.secondHalf?.name,
      extras: extrasForReceipt,
    }
  })

  // Estado para informações do cliente
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    paymentMethod: "Dinheiro",
    observations: "",
    usePoints: false,
    deliveryPerson: "",
  })

  // Verificar se é janeiro (mês 0) para determinar se a taxa anual deve ser aplicada
  const currentMonth = new Date().getMonth();
  const isJanuary = currentMonth === 0;
  
  // Dados da fatura baseados no carrinho atual
  const receiptData = {
    businessName: "KANTINHO DELÍCIA",
    cnpj: "123.456.789-00",
    address: "TERRA BRANCA, PRAIA",
    city: "ILHA DE SANTIAGO - CABO VERDE",
    documentType: "FATURA",
    documentNumber: documentNumber,
    date: formattedDate,
    time: formattedTime,
    items: receiptItems,
    subtotal: totalPrice,
    discount: 0,
    otherCharges: 0, // Sem taxa de caixa
    total: totalPrice, // Sem adicionar taxa de caixa
    paymentMethod: customerInfo.paymentMethod,
    paymentValue: totalPrice, // Sem taxa de caixa
    customerName: customerInfo.name,
    customerPhone: customerInfo.phone,
    customerAddress: customerInfo.address,
    deliveryPerson: customerInfo.deliveryPerson,
    authCode: `${documentNumber} ${formattedDate} ${formattedTime}`,
    accessKey: uuidv4().replace(/-/g, " "),
    observations: customerInfo.observations,
  }

  const handleFinalizeOrder = () => {
    // Calcular pontos de fidelidade (1 ponto para cada pizza)
    const pizzaItems = items.filter(
      (item) => (item.type === "pizza" || item.type === "pizza-meio-meio") && !item.parentItemId,
    )
    const points = pizzaItems.reduce((total, item) => total + item.quantity, 0)

    // Função para converter CartItemType em OrderItem com os tipos compatíveis
    const convertToOrderItem = (item: typeof items[0]) => {
      // Verificar se o tipo do item é compatível com OrderItem
      if (item.type === "pizza" || item.type === "zona" || item.type === "bebida" || item.type === "pizza-meio-meio") {
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          type: item.type,
          size: item.size,
          firstHalf: item.firstHalf,
          secondHalf: item.secondHalf
        }
      }
      return null
    }

    // Registrar o pedido no contexto de vendas
    const orderId = addOrder({
      items: items
        .filter(item => !item.parentItemId) // Remover os extras que têm parentItemId
        .map(convertToOrderItem)
        .filter((item): item is NonNullable<ReturnType<typeof convertToOrderItem>> => item !== null), // Remover itens nulos
      total: totalPrice,
      date: isoDate,
      time: formattedTime,
      status: "completed",
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      deliveryPerson: customerInfo.deliveryPerson,
      paymentMethod: customerInfo.paymentMethod,
      observations: customerInfo.observations,
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
    localStorage.removeItem('kantinho-extras');
  }

  const handleCustomerInfoChange = (info: Partial<typeof customerInfo>) => {
    setCustomerInfo((prev) => ({ ...prev, ...info }))
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-4">
        {isOrderFinalized ? (
          <div className="bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center mb-6">
            <CheckCircle className="mx-auto text-green-500 h-16 w-16 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Pedido Finalizado!</h2>
            <p className="text-gray-300 mb-4">Seu pedido #{orderNumber} foi processado com sucesso.</p>

            {earnedPoints > 0 && (
              <div className="bg-gray-700 p-4 rounded-lg mb-6 flex items-center">
                <Award className="text-yellow-500 h-8 w-8 mr-3" />
                <div className="text-left">
                  <p className="font-bold">Parabéns!</p>
                  <p className="text-gray-300">
                    Você ganhou <span className="text-yellow-500 font-bold">{earnedPoints} pontos</span> de fidelidade.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
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
            <div className="flex justify-between items-center w-full max-w-md mb-6">
              <Link href="/menu">
                <Button variant="outline" className="text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Fatura do Pedido</h1>
            </div>

            {items.length === 0 ? (
              <div className="bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <p className="text-gray-300 mb-6">Não há itens no carrinho para gerar uma fatura.</p>
                <Link href="/menu">
                  <Button className="w-full bg-red-600 hover:bg-red-700">Voltar ao Menu</Button>
                </Link>
              </div>
            ) : (
              <>
                <Receipt {...receiptData} onCustomerInfoChange={handleCustomerInfoChange} />
                <div className="mt-6 w-full max-w-md">
                  <Button onClick={handleFinalizeOrder} className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg">
                    Finalizar Pedido
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </AuthGuard>
  )
}
