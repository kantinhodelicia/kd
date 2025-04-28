"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { parseCookies, setCookie, destroyCookie } from "nookies"

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
    const cookies = parseCookies()
    const storedUser = cookies["kantinho-user"]
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

      // Verificar se o usuário existe nos cookies
      const cookies = parseCookies()
      const users = JSON.parse(cookies["kantinho-users"] || "[]")
      const foundUser = users.find((u: any) => u.email === email && u.password === password)

      if (foundUser) {
        // Remover a senha antes de armazenar no estado
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        setCookie(null, "kantinho-user", JSON.stringify(userWithoutPassword), {
          maxAge: 30 * 24 * 60 * 60, // 30 dias
          path: "/",
        })
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
      const cookies = parseCookies()
      const users = JSON.parse(cookies["kantinho-users"] || "[]")
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

      // Salvar nos cookies
      users.push(newUser)
      setCookie(null, "kantinho-users", JSON.stringify(users), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/",
      })

      // Fazer login automaticamente
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword as User)
      setCookie(null, "kantinho-user", JSON.stringify(userWithoutPassword), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/",
      })

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
    destroyCookie(null, "kantinho-user", { path: "/" })
    router.push("/login")
  }

  const updateUserProfile = async (updates: Partial<User>) => {
    try {
      // Atualizar usuário no estado e cookies
      const updatedUser = { ...user!, ...updates, updatedAt: new Date().toISOString() }
      setUser(updatedUser)
      setCookie(null, "kantinho-user", JSON.stringify(updatedUser), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/",
      })

      // Atualizar na lista de usuários
      const cookies = parseCookies()
      const users = JSON.parse(cookies["kantinho-users"] || "[]")
      const updatedUsers = users.map((u: any) =>
        u.id === user?.id
          ? { ...u, ...updates, updatedAt: new Date().toISOString() }
          : u
      )
      setCookie(null, "kantinho-users", JSON.stringify(updatedUsers), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/",
      })
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      throw error
    }
  }

  const updateUserEmail = async (password: string, newEmail: string): Promise<boolean> => {
    try {
      // Verificar a senha atual
      const cookies = parseCookies()
      const users = JSON.parse(cookies["kantinho-users"] || "[]")
      const currentUser = users.find((u: any) => u.id === user?.id)

      if (!currentUser || currentUser.password !== password) {
        return false
      }

      // Verificar se o novo email já está em uso
      if (users.some((u: any) => u.id !== user?.id && u.email === newEmail)) {
        return false
      }

      // Atualizar email
      const updatedUser = { ...user!, email: newEmail, updatedAt: new Date().toISOString() }
      setUser(updatedUser)
      setCookie(null, "kantinho-user", JSON.stringify(updatedUser), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/",
      })

      const updatedUsers = users.map((u: any) =>
        u.id === user?.id
          ? { ...u, email: newEmail, updatedAt: new Date().toISOString() }
          : u
      )
      setCookie(null, "kantinho-users", JSON.stringify(updatedUsers), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/",
      })

      return true
    } catch (error) {
      console.error("Erro ao atualizar email:", error)
      return false
    }
  }

  const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // Verificar a senha atual
      const cookies = parseCookies()
      const users = JSON.parse(cookies["kantinho-users"] || "[]")
      const currentUser = users.find((u: any) => u.id === user?.id)

      if (!currentUser || currentUser.password !== currentPassword) {
        return false
      }

      // Atualizar senha
      const updatedUser = { ...user!, updatedAt: new Date().toISOString() }
      setUser(updatedUser)
      setCookie(null, "kantinho-user", JSON.stringify(updatedUser), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/",
      })

      const updatedUsers = users.map((u: any) =>
        u.id === user?.id
          ? { ...u, password: newPassword, updatedAt: new Date().toISOString() }
          : u
      )
      setCookie(null, "kantinho-users", JSON.stringify(updatedUsers), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/",
      })

      return true
    } catch (error) {
      console.error("Erro ao atualizar senha:", error)
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
    setCookie(null, "kantinho-user", JSON.stringify(updatedUser), {
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: "/",
    })

    // Atualizar usuário na lista de usuários
    const cookies = parseCookies()
    const users = JSON.parse(cookies["kantinho-users"] || "[]")
    const updatedUsers = users.map((u: any) => {
      if (u.id === user.id) {
        return { ...u, loyaltyPoints: u.loyaltyPoints + points }
      }
      return u
    })
    setCookie(null, "kantinho-users", JSON.stringify(updatedUsers), {
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: "/",
    })
  }

  // Função para resgatar pontos de fidelidade
  const redeemLoyaltyPoints = (points: number): boolean => {
    if (!user || user.loyaltyPoints < points) return false

    const updatedUser = {
      ...user,
      loyaltyPoints: user.loyaltyPoints - points,
    }

    setUser(updatedUser)
    setCookie(null, "kantinho-user", JSON.stringify(updatedUser), {
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: "/",
    })

    // Atualizar usuário na lista de usuários
    const cookies = parseCookies()
    const users = JSON.parse(cookies["kantinho-users"] || "[]")
    const updatedUsers = users.map((u: any) => {
      if (u.id === user.id) {
        return { ...u, loyaltyPoints: u.loyaltyPoints - points }
      }
      return u
    })
    setCookie(null, "kantinho-users", JSON.stringify(updatedUsers), {
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: "/",
    })

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
        updateUserProfile: async (updates: Partial<User>): Promise<boolean> => {
          try {
            await updateUserProfile(updates);
            return true;
          } catch (error) {
            console.error("Error updating user profile:", error);
            return false;
          }
        },
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
