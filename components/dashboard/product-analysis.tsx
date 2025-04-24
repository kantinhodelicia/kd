"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSales } from "@/context/sales-context"
import { useMenu } from "@/context/menu-context"
import { formatPrice } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export function ProductAnalysis() {
  const { orders } = useSales()
  const { pizzas } = useMenu()
  const [analysisType, setAnalysisType] = useState<"revenue" | "quantity">("revenue")

  // Calcular dados de vendas por produto
  const calculateProductData = () => {
    const productData: Record<string, { quantity: number; revenue: number }> = {}

    // Inicializar com todos os produtos do menu
    pizzas.forEach((pizza) => {
      productData[pizza.name] = { quantity: 0, revenue: 0 }
    })

    // Adicionar dados de vendas
    orders
      .filter((order) => order.status === "completed")
      .forEach((order) => {
        order.items.forEach((item) => {
          if (item.type === "pizza" || item.type === "pizza-meio-meio") {
            const name = item.name
            const priceMatch = item.price.match(/(\d+)\$00/)
            const price = priceMatch ? Number.parseInt(priceMatch[1]) : 0

            if (!productData[name]) {
              productData[name] = { quantity: 0, revenue: 0 }
            }

            productData[name].quantity += item.quantity
            productData[name].revenue += price * item.quantity
          }
        })
      })

    // Converter para array e ordenar
    return Object.entries(productData)
      .map(([name, data]) => ({
        name,
        quantity: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => (analysisType === "revenue" ? b.revenue - a.revenue : b.quantity - a.quantity))
      .slice(0, 10) // Top 10
  }

  const data = calculateProductData()

  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#8AC926",
    "#1982C4",
    "#6A4C93",
    "#FF595E",
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 border border-gray-700 rounded-md text-xs">
          <p className="font-medium">{label}</p>
          {analysisType === "revenue" ? (
            <p className="text-green-400">{formatPrice(payload[0].value)}</p>
          ) : (
            <p className="text-blue-400">{payload[0].value} unidades</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">Análise de Produtos</CardTitle>
        <Tabs defaultValue="revenue" className="w-full" onValueChange={(value) => setAnalysisType(value as any)}>
          <TabsList className="bg-gray-700 border-gray-600">
            <TabsTrigger value="revenue" className="data-[state=active]:bg-green-600">
              Receita
            </TabsTrigger>
            <TabsTrigger value="quantity" className="data-[state=active]:bg-blue-600">
              Quantidade
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                  type="number"
                  tick={{ fill: "#ccc" }}
                  tickFormatter={(value) => (analysisType === "revenue" ? formatPrice(value) : `${value}`)}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: "#ccc" }}
                  width={100}
                  tickFormatter={(value) => (value.length > 12 ? `${value.substring(0, 12)}...` : value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey={analysisType}
                  fill={analysisType === "revenue" ? "#10B981" : "#3B82F6"}
                  radius={[0, 4, 4, 0]}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Nenhum dado de vendas disponível
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
