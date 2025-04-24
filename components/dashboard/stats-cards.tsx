"use client"
import { useSales } from "@/context/sales-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { TrendingUp, ShoppingBag, CreditCard, BarChart } from "lucide-react"

export function StatsCards() {
  const { getTotalSales, getTotalOrders, getAverageOrderValue } = useSales()

  const totalSales = getTotalSales()
  const totalOrders = getTotalOrders()
  const averageOrderValue = getAverageOrderValue()

  const stats = [
    {
      title: "Vendas Totais",
      value: formatPrice(totalSales),
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      description: "Total de vendas realizadas",
    },
    {
      title: "Pedidos",
      value: totalOrders.toString(),
      icon: <ShoppingBag className="h-5 w-5 text-blue-500" />,
      description: "Total de pedidos",
    },
    {
      title: "Ticket Médio",
      value: formatPrice(averageOrderValue),
      icon: <CreditCard className="h-5 w-5 text-yellow-500" />,
      description: "Valor médio por pedido",
    },
    {
      title: "Taxa de Conversão",
      value: totalOrders > 0 ? "100%" : "0%",
      icon: <BarChart className="h-5 w-5 text-purple-500" />,
      description: "Pedidos finalizados",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
