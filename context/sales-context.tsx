"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { parseCookies, setCookie, destroyCookie } from "nookies"
import { v4 as uuidv4 } from "uuid"

export type OrderStatus = "pending" | "completed" | "cancelled"

export interface OrderItem {
  id: string
  name: string
  price: string
  quantity: number
  type: "pizza" | "zona" | "bebida" | "pizza-meio-meio"
  size?: "familiar" | "medio" | "peq"
  firstHalf?: {
    name: string
    price: string
  }
  secondHalf?: {
    name: string
    price: string
  }
}

// Atualizar a interface Order para incluir o campo deliveryPerson
export interface Order {
  id: string
  items: OrderItem[]
  total: number
  date: string
  time: string
  status: OrderStatus
  customerName?: string
  customerPhone?: string
  customerAddress?: string
  deliveryPerson?: string
  paymentMethod: string
  observations?: string
}

interface SalesContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, "id">) => string
  updateOrderStatus: (id: string, status: OrderStatus) => void
  getOrderById: (id: string) => Order | undefined
  getDailySales: () => { date: string; total: number }[]
  getWeeklySales: () => { day: string; total: number }[]
  getMonthlySales: () => { month: string; total: number }[]
  getTopSellingItems: () => { name: string; quantity: number }[]
  getTotalSales: () => number
  getTotalOrders: () => number
  getAverageOrderValue: () => number
}

const SalesContext = createContext<SalesContextType | undefined>(undefined)

export function SalesProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  // Carregar dados dos cookies ao iniciar
  useEffect(() => {
    const cookies = parseCookies()
    const storedOrders = cookies["kantinho-orders"]
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders))
    }
  }, [])

  // Salvar dados nos cookies quando mudar
  useEffect(() => {
    // Usamos um try/catch para evitar erros durante a renderização no servidor
    try {
      setCookie(null, "kantinho-orders", JSON.stringify(orders), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/",
      })
    } catch (error) {
      console.error("Erro ao salvar cookies:", error)
    }
  }, [orders])

  const addOrder = (order: Omit<Order, "id">) => {
    const id = uuidv4()
    const newOrder = { ...order, id }
    setOrders((prev) => [...prev, newOrder])
    return id
  }

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)))
  }

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id)
  }

  // Funções para análise de dados
  const getDailySales = () => {
    const today = new Date()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    return last7Days.map((date) => {
      const total = orders
        .filter((order) => order.date === date && order.status === "completed")
        .reduce((sum, order) => sum + order.total, 0)
      return { date, total }
    })
  }

  const getWeeklySales = () => {
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    const today = new Date()
    const dayOfWeek = today.getDay()

    const result = Array.from({ length: 7 }, (_, i) => {
      const day = (dayOfWeek - i + 7) % 7
      return { day: dayNames[day], total: 0 }
    }).reverse()

    orders.forEach((order) => {
      if (order.status === "completed") {
        const orderDate = new Date(order.date)
        const dayDiff = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
        if (dayDiff < 7) {
          const dayIndex = 6 - dayDiff
          if (dayIndex >= 0 && dayIndex < 7) {
            result[dayIndex].total += order.total
          }
        }
      }
    })

    return result
  }

  const getMonthlySales = () => {
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    const today = new Date()
    const currentMonth = today.getMonth()

    const result = Array.from({ length: 6 }, (_, i) => {
      const month = (currentMonth - i + 12) % 12
      return { month: monthNames[month], total: 0 }
    }).reverse()

    orders.forEach((order) => {
      if (order.status === "completed") {
        const orderDate = new Date(order.date)
        const monthDiff =
          (today.getFullYear() - orderDate.getFullYear()) * 12 + (today.getMonth() - orderDate.getMonth())
        if (monthDiff < 6) {
          const monthIndex = 5 - monthDiff
          if (monthIndex >= 0 && monthIndex < 6) {
            result[monthIndex].total += order.total
          }
        }
      }
    })

    return result
  }

  const getTopSellingItems = () => {
    const itemCounts: Record<string, number> = {}

    orders.forEach((order) => {
      if (order.status === "completed") {
        order.items.forEach((item) => {
          const itemName = item.name
          itemCounts[itemName] = (itemCounts[itemName] || 0) + item.quantity
        })
      }
    })

    return Object.entries(itemCounts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
  }

  const getTotalSales = () => {
    return orders.filter((order) => order.status === "completed").reduce((sum, order) => sum + order.total, 0)
  }

  const getTotalOrders = () => {
    return orders.filter((order) => order.status === "completed").length
  }

  const getAverageOrderValue = () => {
    const completedOrders = orders.filter((order) => order.status === "completed")
    if (completedOrders.length === 0) return 0
    return getTotalSales() / completedOrders.length
  }

  return (
    <SalesContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrderById,
        getDailySales,
        getWeeklySales,
        getMonthlySales,
        getTopSellingItems,
        getTotalSales,
        getTotalOrders,
        getAverageOrderValue,
      }}
    >
      {children}
    </SalesContext.Provider>
  )
}

export function useSales() {
  const context = useContext(SalesContext)
  if (context === undefined) {
    throw new Error("useSales must be used within a SalesProvider")
  }
  return context
}
