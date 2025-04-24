"use client"
import { useState } from "react"
import type React from "react"

// Importação removida devido a erros: import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { PrinterIcon, Share2Icon, Phone, Award } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatPrice } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Atualizar a interface ReceiptProps para incluir o campo deliveryPerson
interface ReceiptProps {
  businessName: string
  cnpj: string
  address: string
  city: string
  documentType: string
  documentNumber: string
  date: string
  time: string
  items: ReceiptItem[]
  subtotal: number
  discount: number
  otherCharges: number
  total: number
  paymentMethod: string
  paymentValue: number
  customerName?: string
  customerPhone?: string
  customerAddress?: string
  deliveryPerson?: string
  authCode: string
  accessKey: string
  observations?: string
  onCustomerInfoChange?: (info: {
    name: string
    phone: string
    address: string
    paymentMethod: string
    observations: string
    usePoints: boolean
    deliveryPerson: string
  }) => void
}

interface ReceiptItem {
  code: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  unit: string
  isHalfPizza?: boolean
  firstHalf?: string
  secondHalf?: string
  extras?: Array<{
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
}

export function Receipt({
  businessName,
  cnpj,
  address,
  city,
  documentType,
  documentNumber,
  date,
  time,
  items,
  subtotal,
  discount,
  otherCharges,
  total,
  paymentMethod,
  paymentValue,
  customerName,
  customerPhone,
  customerAddress,
  deliveryPerson,
  authCode,
  accessKey,
  observations,
  onCustomerInfoChange,
}: ReceiptProps) {
  const { user } = useAuth()
  const [isPrinting, setIsPrinting] = useState(false)
  // Atualizar o estado customerInfo para incluir o campo deliveryPerson
  const [customerInfo, setCustomerInfo] = useState({
    name: customerName || user?.name || "",
    phone: customerPhone || user?.phone || "",
    address: customerAddress || user?.address || "",
    paymentMethod: paymentMethod,
    observations: observations || "",
    usePoints: false,
    deliveryPerson: deliveryPerson || "",
  })
  const [whatsappNumber, setWhatsappNumber] = useState("2385999204")

  const handlePrint = () => {
    setIsPrinting(true)
    window.print()
    setTimeout(() => setIsPrinting(false), 500)
  }

  const formatReceiptForWhatsApp = () => {
    let message = `*${businessName}*\n`
    message += `${address}, ${city}\n\n`

    message += `*FATURA #${documentNumber}*\n`
    message += `Data: ${date} ${time}\n\n`

    message += `*ITENS:*\n`
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.description} - ${item.quantity}x ${formatPrice(item.unitPrice)} = ${formatPrice(item.totalPrice)}\n`
      if (item.isHalfPizza && item.firstHalf && item.secondHalf) {
        message += `   Metade 1: ${item.firstHalf}\n`
        message += `   Metade 2: ${item.secondHalf}\n`
      }
      if (item.extras && item.extras.length > 0) {
        item.extras.forEach((extra) => {
          message += `   + ${extra.description} - ${extra.quantity}x ${formatPrice(extra.unitPrice)}\n`
        })
      }
    })

    message += `\n*SUBTOTAL: ${formatPrice(subtotal)}*\n`

    if (discount > 0) {
      message += `Desconto: ${formatPrice(discount)}\n`
    }

    if (otherCharges > 0) {
      message += `Taxas: ${formatPrice(otherCharges)}\n`
    }

    message += `*TOTAL: ${formatPrice(total)}*\n\n`
    message += `Pagamento: ${customerInfo.paymentMethod}\n\n`

    if (customerInfo.name) {
      message += `Cliente: ${customerInfo.name}\n`
    }

    if (customerInfo.phone) {
      message += `Telefone: ${customerInfo.phone}\n`
    }

    if (customerInfo.address) {
      message += `Endereço: ${customerInfo.address}\n`
    }

    if (customerInfo.observations) {
      message += `\nObservações: ${customerInfo.observations}\n`
    }

    message += `\nObrigado pela preferência!`

    return encodeURIComponent(message)
  }

  const sendToWhatsApp = () => {
    const message = formatReceiptForWhatsApp()
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const newInfo = { ...customerInfo, [name]: value }
    setCustomerInfo(newInfo)

    if (onCustomerInfoChange) {
      onCustomerInfoChange(newInfo)
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    const newInfo = { ...customerInfo, usePoints: checked }
    setCustomerInfo(newInfo)

    if (onCustomerInfoChange) {
      onCustomerInfoChange(newInfo)
    }
  }

  // Verificar se o usuário tem pontos suficientes para resgatar uma pizza
  const hasEnoughPoints = user && user.loyaltyPoints >= 10

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      <div className="no-print mb-6 w-full bg-gray-800 p-4 rounded-lg">
        <h3 className="font-bold mb-3 text-lg">Informações do Cliente</h3>
        <div className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm mb-1">
              Nome do Cliente
            </label>
            <Input
              id="name"
              name="name"
              value={customerInfo.name}
              onChange={handleInputChange}
              placeholder="Nome do cliente"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm mb-1">
              Telefone
            </label>
            <Input
              id="phone"
              name="phone"
              value={customerInfo.phone}
              onChange={handleInputChange}
              placeholder="Telefone do cliente"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm mb-1">
              Endereço de Entrega
            </label>
            <Input
              id="address"
              name="address"
              value={customerInfo.address}
              onChange={handleInputChange}
              placeholder="Endereço de entrega"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          {/* Adicionar o campo de entregador após o campo de endereço */}
          <div>
            <label htmlFor="deliveryPerson" className="block text-sm mb-1">
              Entregador
            </label>
            <Input
              id="deliveryPerson"
              name="deliveryPerson"
              value={customerInfo.deliveryPerson}
              onChange={handleInputChange}
              placeholder="Nome do entregador"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm mb-1">
              Método de Pagamento
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={customerInfo.paymentMethod}
              onChange={(e) => {
                const newInfo = { ...customerInfo, paymentMethod: e.target.value }
                setCustomerInfo(newInfo)
                if (onCustomerInfoChange) {
                  onCustomerInfoChange(newInfo)
                }
              }}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
            >
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Cartão de Débito">Cartão de Débito</option>
              <option value="Transferência Bancária">Transferência Bancária</option>
              <option value="Pix">Pix</option>
            </select>
          </div>

          {user && user.loyaltyPoints > 0 && (
            <div className="flex items-center space-x-2 p-3 bg-gray-700 rounded-lg">
              <Award className="h-5 w-5 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm">
                  Você tem <span className="font-bold text-yellow-500">{user.loyaltyPoints}</span> pontos de fidelidade
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Checkbox
                    id="usePoints"
                    checked={customerInfo.usePoints}
                    onCheckedChange={handleCheckboxChange}
                    disabled={!hasEnoughPoints}
                  />
                  <Label htmlFor="usePoints" className="text-sm">
                    {hasEnoughPoints
                      ? "Usar pontos para resgatar uma pizza"
                      : "Você precisa de pelo menos 10 pontos para resgatar uma pizza"}
                  </Label>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="observations" className="block text-sm mb-1">
              Observações
            </label>
            <Textarea
              id="observations"
              name="observations"
              value={customerInfo.observations}
              onChange={handleInputChange}
              placeholder="Observações sobre o pedido"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <label htmlFor="whatsappNumber" className="block text-sm mb-1">
              Número do WhatsApp para Envio
            </label>
            <div className="flex">
              <Input
                id="whatsappNumber"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Número com código do país"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="no-print mb-4 flex gap-2 w-full">
        <Button onClick={handlePrint} className="flex-1 items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <PrinterIcon size={16} />
          Imprimir Fatura
        </Button>
        <Button onClick={sendToWhatsApp} className="flex-1 items-center gap-2 bg-green-600 hover:bg-green-700">
          <Share2Icon size={16} />
          Enviar via WhatsApp
        </Button>
      </div>

      {/* Visualização da fatura para papel 58mm */}
      <div
        className={`receipt-container bg-white text-black ${
          isPrinting ? "printing" : ""
        } w-[58mm] border border-gray-300 p-1 text-[9px] leading-tight`}
      >
        {/* Cabeçalho */}
        <div className="text-center font-bold mb-1 text-[11px]">{businessName}</div>
        <div className="text-center mb-1">{address}</div>
        <div className="text-center mb-1">{city}</div>
        <div className="text-center mb-1">Tel: FIXO: 2616090 | SWAG: 5999204</div>
        <div className="border-t border-b border-dashed border-gray-400 text-center py-1 mb-1">
          {documentType} #{documentNumber}
          <br />
          {date} {time}
        </div>

        {/* Informações do Cliente */}
        {customerInfo.name && (
          <div className="mb-1">
            <div className="font-bold">CLIENTE:</div>
            <div>{customerInfo.name}</div>
            {customerInfo.phone && (
              <div className="flex items-center">
                <Phone size={8} className="mr-1" />
                {customerInfo.phone}
              </div>
            )}
            {customerInfo.address && <div>{customerInfo.address}</div>}
            {/* Adicionar o campo de entregador na seção de informações do cliente na fatura impressa */}
            {customerInfo.deliveryPerson && (
              <div className="flex items-center">
                <span className="font-bold mr-1">Entregador:</span> {customerInfo.deliveryPerson}
              </div>
            )}
          </div>
        )}

        {/* Cabeçalho dos Itens */}
        <div className="text-center font-bold mb-1 mt-1">ITENS DO PEDIDO</div>
        <div className="flex font-bold border-b border-dashed border-gray-400 pb-[2px]">
          <div className="w-[16px]">#</div>
          <div className="flex-1">ITEM</div>
          <div className="w-[30px] text-right mr-4">QTD</div>
          <div className="w-[40px] text-right">TOTAL</div>
        </div>

        {/* Itens */}
        {items.map((item, index) => (
          <div key={index} className="border-b border-dashed border-gray-200 py-[2px]">
            <div className="flex">
              <div className="w-[16px]">{index + 1}</div>
              <div className="flex-1">{item.description}</div>
              <div className="w-[30px] text-right mr-4">{item.quantity}</div>
              <div className="w-[40px] text-right">{formatPrice(item.totalPrice)}</div>
            </div>
            <div className="flex pl-[16px]">
              <div className="flex-1 text-[8px] text-gray-600">{formatPrice(item.unitPrice)} cada</div>
            </div>
            {item.isHalfPizza && item.firstHalf && item.secondHalf && (
              <div className="text-[8px] pl-[16px] text-gray-600">
                <div>1/2: {item.firstHalf}</div>
                <div>1/2: {item.secondHalf}</div>
              </div>
            )}
            {item.extras && item.extras.length > 0 && (
              <div className="text-[8px] pl-[16px] text-gray-600">
                {item.extras.map((extra, idx) => (
                  <div key={idx}>
                    + {extra.description} ({extra.quantity}x)
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Totais */}
        <div className="pt-1">
          <div className="flex justify-between">
            <div>SUBTOTAL</div>
            <div>{formatPrice(subtotal)}</div>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <div>DESCONTO</div>
              <div>{formatPrice(discount)}</div>
            </div>
          )}
          <div className="flex justify-between font-bold border-t border-b border-dashed border-gray-400 py-[2px] my-1">
            <div>TOTAL</div>
            <div>{formatPrice(total)}</div>
          </div>
        </div>

        {/* Pagamento */}
        <div className="mb-1">
          <div className="flex justify-between">
            <div>FORMA DE PAGAMENTO</div>
            <div>{customerInfo.paymentMethod}</div>
          </div>
        </div>

        {/* Observações */}
        {customerInfo.observations && (
          <div className="border-t border-dashed border-gray-400 pt-1 mb-1">
            <div className="font-bold">OBSERVAÇÕES:</div>
            <div className="text-[8px]">{customerInfo.observations}</div>
          </div>
        )}

        {/* QR Code */}
        <div className="flex justify-center my-1">
          {/* QR Code SVG */}
        </div>

        {/* Rodapé */}
        <div className="text-center border-t border-dashed border-gray-400 pt-1 text-[8px]">
          <div className="font-bold">OBRIGADO PELA PREFERÊNCIA!</div>
          <div className="mt-1">
            {date} {time}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-container,
          .receipt-container * {
            visibility: visible;
          }
          .receipt-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 58mm !important;
            border: none !important;
            padding: 0 !important;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
