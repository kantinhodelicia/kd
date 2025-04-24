"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Filter } from "lucide-react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { TopItemsChart } from "@/components/dashboard/top-items-chart"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { ExportReport } from "@/components/dashboard/export-report"
import { SalesGoals } from "@/components/dashboard/sales-goals"
import { ProductAnalysis } from "@/components/dashboard/product-analysis"
import { PeakHours } from "@/components/dashboard/peak-hours"
import { AuthGuard } from "@/components/auth-guard"
import type { DateRange } from "react-day-picker"

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/admin">
              <Button variant="outline" className="text-white">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Admin
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Dashboard de Vendas</h1>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-gray-400">Filtrar por período:</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
              <ExportReport dateRange={dateRange} />
            </div>
          </div>

          <div className="mb-8">
            <StatsCards />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SalesChart dateRange={dateRange} />
            <SalesGoals />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ProductAnalysis />
            <PeakHours />
          </div>

          <div className="mb-8">
            <TopItemsChart />
          </div>

          <div className="mb-8">
            <RecentOrders dateRange={dateRange} />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
