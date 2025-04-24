"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSales } from "@/context/sales-context"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Clock } from "lucide-react"

export function PeakHours() {
  const { orders } = useSales()

  // Calcular dados de horários de pico
  const calculateHourlyData = () => {
    const hourlyData: Record<number, { orders: number; sales: number }> = {}

    // Inicializar horas
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = { orders: 0, sales: 0 }
    }

    // Adicionar dados de pedidos
    orders
      .filter((order) => order.status === "completed")
      .forEach((order) => {
        const hour = Number.parseInt(order.time.split(":")[0], 10)

        if (!isNaN(hour) && hour >= 0 && hour < 24) {
          hourlyData[hour].orders += 1
          hourlyData[hour].sales += order.total
        }
      })

    // Converter para array
    return Object.entries(hourlyData).map(([hour, data]) => ({
      hour: `${hour}:00`,
      orders: data.orders,
      sales: data.sales,
    }))
  }

  const data = calculateHourlyData()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 border border-gray-700 rounded-md text-xs">
          <p className="font-medium">{label}</p>
          <p className="text-purple-400">{payload[0].value} pedidos</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Clock className="h-5 w-5 mr-2 text-purple-500" />
          Horários de Pico
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {orders.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="hour" tick={{ fill: "#ccc" }} interval={2} />
                <YAxis tick={{ fill: "#ccc" }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
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
