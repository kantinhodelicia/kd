"use client"
import { useState } from "react"
import { useSales } from "@/context/sales-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { DateRange } from "react-day-picker"
import { isWithinInterval, parseISO } from "date-fns"

interface RecentOrdersProps {
  dateRange: DateRange | undefined
}

export function RecentOrders({ dateRange }: RecentOrdersProps) {
  const { orders, updateOrderStatus } = useSales()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const ordersPerPage = 5

  // Filtrar pedidos por intervalo de datas
  const filteredOrders = dateRange?.from
    ? orders.filter((order) => {
        const orderDate = parseISO(order.date)
        return dateRange.to
          ? isWithinInterval(orderDate, { start: dateRange.from!, end: dateRange.to })
          : orderDate >= dateRange.from
      })
    : orders

  // Ordenar pedidos por data (mais recentes primeiro)
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`).getTime()
    const dateB = new Date(`${b.date}T${b.time}`).getTime()
    return dateB - dateA
  })

  // Paginar os pedidos
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage)

  // Obter detalhes do pedido selecionado
  const selectedOrderDetails = selectedOrder ? orders.find((order) => order.id === selectedOrder) : null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600">Concluído</Badge>
      case "pending":
        return <Badge className="bg-yellow-600">Pendente</Badge>
      case "cancelled":
        return <Badge className="bg-red-600">Cancelado</Badge>
      default:
        return <Badge className="bg-gray-600">Desconhecido</Badge>
    }
  }

  const handleStatusChange = (id: string, status: "pending" | "completed" | "cancelled") => {
    updateOrderStatus(id, status)
  }

  return (
    <>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-2 text-gray-400">ID</th>
                  <th className="text-left py-2 px-2 text-gray-400">Data</th>
                  <th className="text-left py-2 px-2 text-gray-400">Cliente</th>
                  <th className="text-right py-2 px-2 text-gray-400">Total</th>
                  <th className="text-center py-2 px-2 text-gray-400">Status</th>
                  <th className="text-right py-2 px-2 text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-700">
                    <td className="py-2 px-2 text-white">{order.id.substring(0, 8)}</td>
                    <td className="py-2 px-2 text-white">
                      {order.date} {order.time.substring(0, 5)}
                    </td>
                    <td className="py-2 px-2 text-white">{order.customerName || "Cliente não identificado"}</td>
                    <td className="py-2 px-2 text-right text-white">{formatPrice(order.total)}</td>
                    <td className="py-2 px-2 text-center">{getStatusBadge(order.status)}</td>
                    <td className="py-2 px-2 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white"
                        onClick={() => setSelectedOrder(order.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}

                {currentOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-400">
                      Nenhum pedido encontrado para o período selecionado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-white"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <span className="text-sm text-gray-400">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="text-white"
              >
                Próximo <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalhes do pedido */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
          </DialogHeader>

          {selectedOrderDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">ID do Pedido</p>
                  <p>{selectedOrderDetails.id.substring(0, 8)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Data</p>
                  <p>
                    {selectedOrderDetails.date} {selectedOrderDetails.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Cliente</p>
                  <p>{selectedOrderDetails.customerName || "Cliente não identificado"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Telefone</p>
                  <p>{selectedOrderDetails.customerPhone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Endereço</p>
                  <p>{selectedOrderDetails.customerAddress || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Pagamento</p>
                  <p>{selectedOrderDetails.paymentMethod}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Status</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={selectedOrderDetails.status === "pending" ? "default" : "outline"}
                    className={selectedOrderDetails.status === "pending" ? "bg-yellow-600" : "text-white"}
                    onClick={() => handleStatusChange(selectedOrderDetails.id, "pending")}
                  >
                    Pendente
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedOrderDetails.status === "completed" ? "default" : "outline"}
                    className={selectedOrderDetails.status === "completed" ? "bg-green-600" : "text-white"}
                    onClick={() => handleStatusChange(selectedOrderDetails.id, "completed")}
                  >
                    Concluído
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedOrderDetails.status === "cancelled" ? "default" : "outline"}
                    className={selectedOrderDetails.status === "cancelled" ? "bg-red-600" : "text-white"}
                    onClick={() => handleStatusChange(selectedOrderDetails.id, "cancelled")}
                  >
                    Cancelado
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Itens</p>
                <div className="bg-gray-700 rounded-md p-2 space-y-2">
                  {selectedOrderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p>
                          {item.quantity}x {item.name}
                        </p>
                        {item.type === "pizza-meio-meio" && item.firstHalf && item.secondHalf && (
                          <p className="text-xs text-gray-400">
                            Metade 1: {item.firstHalf.name} | Metade 2: {item.secondHalf.name}
                          </p>
                        )}
                      </div>
                      <p>{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 pt-2">
                <p className="font-bold">Total</p>
                <p className="font-bold">{formatPrice(selectedOrderDetails.total)}</p>
              </div>

              {selectedOrderDetails.observations && (
                <div>
                  <p className="text-sm text-gray-400">Observações</p>
                  <p className="bg-gray-700 p-2 rounded-md">{selectedOrderDetails.observations}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedOrder(null)} className="text-white">
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
