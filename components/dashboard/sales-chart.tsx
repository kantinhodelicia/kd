"use client"
import { useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { useSales } from "@/context/sales-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatPrice } from "@/lib/utils"
import type { DateRange } from "react-day-picker"
import { isWithinInterval, parseISO } from "date-fns"

// Registrar componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

interface SalesChartProps {
  dateRange: DateRange | undefined
}

export function SalesChart({ dateRange }: SalesChartProps) {
  const { orders } = useSales()
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily")

  // Filtrar pedidos por intervalo de datas
  const filteredOrders = dateRange?.from
    ? orders.filter((order) => {
        const orderDate = parseISO(order.date)
        return dateRange.to
          ? isWithinInterval(orderDate, { start: dateRange.from!, end: dateRange.to })
          : orderDate >= dateRange.from
      })
    : orders

  // Obter dados com base no timeframe selecionado
  const chartData = () => {
    // Agrupar pedidos por data
    const groupedData: Record<string, number> = {}

    filteredOrders
      .filter((order) => order.status === "completed")
      .forEach((order) => {
        let key = ""

        if (timeframe === "daily") {
          key = order.date
        } else if (timeframe === "weekly") {
          const date = parseISO(order.date)
          const day = date.toLocaleDateString("pt-BR", { weekday: "short" })
          key = day
        } else if (timeframe === "monthly") {
          const date = parseISO(order.date)
          const month = date.toLocaleDateString("pt-BR", { month: "short" })
          key = month
        }

        if (!groupedData[key]) {
          groupedData[key] = 0
        }
        groupedData[key] += order.total
      })

    // Converter para formato do gráfico
    const labels = Object.keys(groupedData)
    const data = Object.values(groupedData)

    return {
      labels,
      datasets: [
        {
          label: "Vendas",
          data,
          borderColor:
            timeframe === "daily"
              ? "rgb(255, 99, 132)"
              : timeframe === "weekly"
                ? "rgb(53, 162, 235)"
                : "rgb(75, 192, 192)",
          backgroundColor:
            timeframe === "daily"
              ? "rgba(255, 99, 132, 0.5)"
              : timeframe === "weekly"
                ? "rgba(53, 162, 235, 0.5)"
                : "rgba(75, 192, 192, 0.5)",
        },
      ],
    }
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${formatPrice(context.parsed.y)}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => formatPrice(value),
        },
      },
    },
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">Vendas</CardTitle>
        <Tabs defaultValue="daily" className="w-full" onValueChange={(value) => setTimeframe(value as any)}>
          <TabsList className="bg-gray-700 border-gray-600">
            <TabsTrigger value="daily" className="data-[state=active]:bg-red-600">
              Diário
            </TabsTrigger>
            <TabsTrigger value="weekly" className="data-[state=active]:bg-red-600">
              Semanal
            </TabsTrigger>
            <TabsTrigger value="monthly" className="data-[state=active]:bg-red-600">
              Mensal
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {filteredOrders.length > 0 ? (
            <>
              {timeframe === "daily" && <Line data={chartData()} options={options} />}
              {timeframe === "weekly" && <Bar data={chartData()} options={options} />}
              {timeframe === "monthly" && <Bar data={chartData()} options={options} />}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Nenhum dado de vendas disponível para o período selecionado
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
