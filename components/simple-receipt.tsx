"use client"
import { useState } from "react"
import React from "react"

import { Button } from "@/components/ui/button"
import { PrinterIcon, Share2Icon } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface SimpleReceiptItem {
  name: string
  quantity: number
  price: string
  extras?: Array<{
    name: string
    quantity: number
    price: string
  }>
}

// Atualizar a interface SimpleReceiptProps para incluir o campo deliveryPerson
interface SimpleReceiptProps {
  items: SimpleReceiptItem[]
  subtotal: number
  deliveryFee: number
  boxFee: number
  total: number
  customerName?: string
  customerPhone?: string
  customerAddress?: string
  deliveryPerson?: string
}

// Adicionar o campo deliveryPerson na desestruturação de props
export function SimpleReceipt({
  items,
  subtotal,
  deliveryFee,
  boxFee,
  total,
  customerName,
  customerPhone,
  customerAddress,
  deliveryPerson,
}: SimpleReceiptProps) {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)
    window.print()
    setTimeout(() => setIsPrinting(false), 500)
  }

  const handleShare = () => {
    // Criar mensagem para compartilhar
    let message = "🍕 *KANTINHO DELÍCIA* 🍕\n\n"

    if (customerName) {
      message += `Cliente: ${customerName}\n`
    }

    message += "\n*ITENS:*\n"
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.quantity}x ${item.name} - ${item.price}\n`

      // Adicionar extras
      if (item.extras && item.extras.length > 0) {
        item.extras.forEach((extra) => {
          message += `   + ${extra.quantity}x ${extra.name} - ${extra.price}\n`
        })
      }
    })

    message += `\nSubtotal: ${formatPrice(subtotal)}\n`
    if (deliveryFee > 0) {
      message += `Taxa de entrega: ${formatPrice(deliveryFee)}\n`
    }
    message += `Taxa de caixa: ${formatPrice(boxFee)}\n`
    message += `*TOTAL: ${formatPrice(total)}*\n\n`
    message += "Obrigado pela preferência! 😊"

    // Compartilhar via WhatsApp
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank")
  }

  const currentDate = new Date().toLocaleDateString("pt-BR")
  const currentTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Botões de ação */}
      <div className="mb-4 flex gap-2 print:hidden">
        <Button onClick={handlePrint} className="flex-1 bg-blue-600 hover:bg-blue-700">
          <PrinterIcon size={16} className="mr-2" /> Imprimir
        </Button>
        <Button onClick={handleShare} className="flex-1 bg-green-600 hover:bg-green-700">
          <Share2Icon size={16} className="mr-2" /> Compartilhar
        </Button>
      </div>

      {/* Fatura */}
      <div className={`bg-white text-black p-4 rounded-lg shadow-md ${isPrinting ? "printing" : ""}`}>
        {/* Cabeçalho */}
        <div className="text-center border-b border-gray-300 pb-3 mb-3">
          <h1 className="text-xl font-bold">KANTINHO DELÍCIA</h1>
          <p className="text-sm">TERRA BRANCA, PRAIA</p>
          <p className="text-sm">Tel: 2616090 | 5999204</p>
          <p className="text-sm mt-2">
            {currentDate} - {currentTime}
          </p>
        </div>

        {/* Informações do cliente */}
        {(customerName || customerPhone || customerAddress || deliveryPerson) && (
          <div className="mb-3 border-b border-gray-300 pb-3">
            <h2 className="font-bold mb-1">Cliente:</h2>
            {customerName && <p>{customerName}</p>}
            {customerPhone && <p>Tel: {customerPhone}</p>}
            {customerAddress && <p>Endereço: {customerAddress}</p>}
            {deliveryPerson && <p>Entregador: {deliveryPerson}</p>}
          </div>
        )}

        {/* Itens */}
        <div className="mb-3">
          <h2 className="font-bold mb-2">Itens:</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left pb-1">Item</th>
                <th className="text-center pb-1">Qtd</th>
                <th className="text-right pb-1">Preço</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  <tr className="border-b border-gray-200">
                    <td className="py-1">{item.name}</td>
                    <td className="py-1 text-center">{item.quantity}</td>
                    <td className="py-1 text-right">{item.price}</td>
                  </tr>
                  {item.extras &&
                    item.extras.length > 0 &&
                    item.extras.map((extra, extraIndex) => (
                      <tr key={`${index}-extra-${extraIndex}`} className="text-xs text-gray-600">
                        <td className="py-1 pl-4">+ {extra.name}</td>
                        <td className="py-1 text-center">{extra.quantity}</td>
                        <td className="py-1 text-right">{extra.price}</td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totais */}
        <div className="mb-3">
          <div className="flex justify-between py-1">
            <span>Subtotal:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {deliveryFee > 0 && (
            <div className="flex justify-between py-1">
              <span>Taxa de entrega:</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span>Taxa de caixa:</span>
            <span>{formatPrice(boxFee)}</span>
          </div>
          <div className="flex justify-between py-1 font-bold border-t border-gray-300 mt-1 pt-2">
            <span>TOTAL:</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center text-sm border-t border-gray-300 pt-3">
          <p className="font-bold">Obrigado pela preferência!</p>
          <p className="text-xs mt-1">KANTINHO DELÍCIA - A melhor pizza da cidade</p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printing,
          .printing * {
            visibility: visible;
          }
          .printing {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 15px;
          }
          .print:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
