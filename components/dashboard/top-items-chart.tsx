"use client"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { useSales } from "@/context/sales-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend)

export function TopItemsChart() {
  const { getTopSellingItems } = useSales()
  const topItems = getTopSellingItems()

  const data = {
    labels: topItems.map((item) => item.name),
    datasets: [
      {
        label: "Quantidade Vendida",
        data: topItems.map((item) => item.quantity),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Itens Mais Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex items-center justify-center">
          {topItems.length > 0 ? (
            <Pie data={data} options={options} />
          ) : (
            <p className="text-gray-400">Nenhum dado de vendas disponível</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
