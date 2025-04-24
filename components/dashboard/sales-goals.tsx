"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSales } from "@/context/sales-context"
import { formatPrice } from "@/lib/utils"
import { Edit2, Save, Target } from "lucide-react"

export function SalesGoals() {
  const { getTotalSales, getTotalOrders } = useSales()
  const [isEditing, setIsEditing] = useState(false)
  const [goals, setGoals] = useState({
    dailySales: 5000,
    weeklySales: 25000,
    monthlySales: 100000,
    dailyOrders: 10,
    weeklyOrders: 50,
    monthlyOrders: 200,
  })

  // Carregar metas do localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem("kantinho-sales-goals")
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

  // Salvar metas no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("kantinho-sales-goals", JSON.stringify(goals))
  }, [goals])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setGoals((prev) => ({
      ...prev,
      [name]: Number(value),
    }))
  }

  const totalSales = getTotalSales()
  const totalOrders = getTotalOrders()

  // Calcular progresso das metas
  const calculateProgress = (current: number, goal: number) => {
    const progress = (current / goal) * 100
    return Math.min(progress, 100) // Limitar a 100%
  }

  const dailySalesProgress = calculateProgress(totalSales, goals.dailySales)
  const dailyOrdersProgress = calculateProgress(totalOrders, goals.dailyOrders)

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center">
          <Target className="h-5 w-5 mr-2 text-yellow-500" />
          Metas de Vendas
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="text-white hover:bg-gray-700"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">Meta Diária de Vendas</span>
              {isEditing ? (
                <Input
                  type="number"
                  name="dailySales"
                  value={goals.dailySales}
                  onChange={handleInputChange}
                  className="w-24 h-6 text-sm bg-gray-700 border-gray-600 text-white"
                />
              ) : (
                <span className="text-sm font-medium">{formatPrice(goals.dailySales)}</span>
              )}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${dailySalesProgress}%` }}></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">Atual: {formatPrice(totalSales)}</span>
              <span className="text-xs text-gray-400">{dailySalesProgress.toFixed(0)}%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">Meta Diária de Pedidos</span>
              {isEditing ? (
                <Input
                  type="number"
                  name="dailyOrders"
                  value={goals.dailyOrders}
                  onChange={handleInputChange}
                  className="w-24 h-6 text-sm bg-gray-700 border-gray-600 text-white"
                />
              ) : (
                <span className="text-sm font-medium">{goals.dailyOrders}</span>
              )}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${dailyOrdersProgress}%` }}></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">Atual: {totalOrders}</span>
              <span className="text-xs text-gray-400">{dailyOrdersProgress.toFixed(0)}%</span>
            </div>
          </div>

          {isEditing && (
            <div className="pt-2 border-t border-gray-700">
              <h4 className="text-sm font-medium mb-2">Outras Metas</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Meta Semanal (Vendas)</label>
                  <Input
                    type="number"
                    name="weeklySales"
                    value={goals.weeklySales}
                    onChange={handleInputChange}
                    className="h-7 text-sm bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Meta Semanal (Pedidos)</label>
                  <Input
                    type="number"
                    name="weeklyOrders"
                    value={goals.weeklyOrders}
                    onChange={handleInputChange}
                    className="h-7 text-sm bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Meta Mensal (Vendas)</label>
                  <Input
                    type="number"
                    name="monthlySales"
                    value={goals.monthlySales}
                    onChange={handleInputChange}
                    className="h-7 text-sm bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Meta Mensal (Pedidos)</label>
                  <Input
                    type="number"
                    name="monthlyOrders"
                    value={goals.monthlyOrders}
                    onChange={handleInputChange}
                    className="h-7 text-sm bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
