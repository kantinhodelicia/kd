"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export type User = {
  id: string
  name: string
  email: string
  role: "admin" | "customer"
  phone?: string
  address?: string
  loyaltyPoints: number
  orderHistory: string[] // IDs dos pedidos
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  updateUserProfile: (data: Partial<User>) => Promise<boolean>
  addLoyaltyPoints: (points: number) => void
  redeemLoyaltyPoints: (points: number) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Verificar se o usuário está logado ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem("kantinho-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verificar se o usuário existe no localStorage
      const users = JSON.parse(localStorage.getItem("kantinho-users") || "[]")
      const foundUser = users.find((u: any) => u.email === email && u.password === password)

      if (foundUser) {
        // Remover a senha antes de armazenar no estado
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        localStorage.setItem("kantinho-user", JSON.stringify(userWithoutPassword))
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      setIsLoading(false)
      return false
    }
  }

  // Função de registro
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verificar se o email já está em uso
      const users = JSON.parse(localStorage.getItem("kantinho-users") || "[]")
      const userExists = users.some((u: any) => u.email === email)

      if (userExists) {
        setIsLoading(false)
        return false
      }

      // Criar novo usuário
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        role: users.length === 0 ? "admin" : "customer", // Primeiro usuário é admin
        loyaltyPoints: 0,
        orderHistory: [],
      }

      // Salvar no localStorage
      users.push(newUser)
      localStorage.setItem("kantinho-users", JSON.stringify(users))

      // Fazer login automaticamente
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem("kantinho-user", JSON.stringify(userWithoutPassword))

      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Erro ao registrar:", error)
      setIsLoading(false)
      return false
    }
  }

  // Função de logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem("kantinho-user")
    router.push("/login")
  }

  // Função para atualizar o perfil do usuário
  const updateUserProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false

    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Atualizar usuário no estado e localStorage
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("kantinho-user", JSON.stringify(updatedUser))

      // Atualizar usuário na lista de usuários
      const users = JSON.parse(localStorage.getItem("kantinho-users") || "[]")
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          return { ...u, ...data, password: u.password } // Manter a senha original
        }
        return u
      })
      localStorage.setItem("kantinho-users", JSON.stringify(updatedUsers))

      return true
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      return false
    }
  }

  // Função para adicionar pontos de fidelidade
  const addLoyaltyPoints = (points: number) => {
    if (!user) return

    const updatedUser = {
      ...user,
      loyaltyPoints: user.loyaltyPoints + points,
    }

    setUser(updatedUser)
    localStorage.setItem("kantinho-user", JSON.stringify(updatedUser))

    // Atualizar usuário na lista de usuários
    const users = JSON.parse(localStorage.getItem("kantinho-users") || "[]")
    const updatedUsers = users.map((u: any) => {
      if (u.id === user.id) {
        return { ...u, loyaltyPoints: u.loyaltyPoints + points }
      }
      return u
    })
    localStorage.setItem("kantinho-users", JSON.stringify(updatedUsers))
  }

  // Função para resgatar pontos de fidelidade
  const redeemLoyaltyPoints = (points: number): boolean => {
    if (!user || user.loyaltyPoints < points) return false

    const updatedUser = {
      ...user,
      loyaltyPoints: user.loyaltyPoints - points,
    }

    setUser(updatedUser)
    localStorage.setItem("kantinho-user", JSON.stringify(updatedUser))

    // Atualizar usuário na lista de usuários
    const users = JSON.parse(localStorage.getItem("kantinho-users") || "[]")
    const updatedUsers = users.map((u: any) => {
      if (u.id === user.id) {
        return { ...u, loyaltyPoints: u.loyaltyPoints - points }
      }
      return u
    })
    localStorage.setItem("kantinho-users", JSON.stringify(updatedUsers))

    return true
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        updateUserProfile,
        addLoyaltyPoints,
        redeemLoyaltyPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
