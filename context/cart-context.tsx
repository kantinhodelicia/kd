"use client"
import { createContext, useContext, useState, type ReactNode } from "react"

export type CartItemType = {
  id: string
  name: string
  price: string
  type: "pizza" | "zona" | "bebida" | "pizza-meio-meio" | "extra" | "box"
  size?: "familiar" | "medio" | "peq"
  quantity: number
  // Campos adicionais para pizza meio a meio
  firstHalf?: {
    name: string
    price: string
  }
  secondHalf?: {
    name: string
    price: string
  }
  // Campo para associar extras a um item específico
  parentItemId?: string
}

type CartContextType = {
  items: CartItemType[]
  addItem: (item: Omit<CartItemType, "quantity" | "id">) => void
  removeItem: (id: string) => void
  clearCart: () => void
  updateQuantity: (id: string, quantity: number) => void
  addExtraToItem: (parentItemId: string, extraItem: Omit<CartItemType, "quantity" | "id" | "parentItemId">) => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([])

  const addItem = (newItem: Omit<CartItemType, "quantity" | "id">) => {
    let id: string

    if (newItem.type === "pizza-meio-meio" && newItem.firstHalf && newItem.secondHalf) {
      id = `pizza-meio-meio-${newItem.firstHalf.name}-${newItem.secondHalf.name}-${newItem.size || ""}`
    } else {
      id = `${newItem.type}-${newItem.name}-${newItem.size || ""}`
    }

    setItems((prevItems) => {
      // Check if item already exists
      const existingItemIndex = prevItems.findIndex((item) => item.id === id)

      if (existingItemIndex >= 0) {
        // Increment quantity if item exists
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += 1
        return updatedItems
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...newItem, id, quantity: 1 }]
      }
    })
  }

  const addExtraToItem = (parentItemId: string, extraItem: Omit<CartItemType, "quantity" | "id" | "parentItemId">) => {
    const extraId = `extra-${extraItem.name}-for-${parentItemId}`

    setItems((prevItems) => {
      // Check if this extra already exists for this parent item
      const existingExtraIndex = prevItems.findIndex((item) => item.id === extraId)

      if (existingExtraIndex >= 0) {
        // Increment quantity if extra exists
        const updatedItems = [...prevItems]
        updatedItems[existingExtraIndex].quantity += 1
        return updatedItems
      } else {
        // Add new extra with quantity 1 and reference to parent
        return [
          ...prevItems,
          {
            ...extraItem,
            id: extraId,
            quantity: 1,
            parentItemId,
          },
        ]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => {
      // Remove the item
      const newItems = prevItems.filter((item) => item.id !== id)

      // If the removed item was a parent item, also remove all its extras
      if (id.startsWith("pizza-") || id.startsWith("pizza-meio-meio-")) {
        return newItems.filter((item) => item.parentItemId !== id)
      }

      return newItems
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  // Calculate total items
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  // Calculate total price (extracting the numeric value before "$00")
  const totalPrice = items.reduce((total, item) => {
    // Extract the number before "$00"
    const priceMatch = item.price.match(/(\d+)\$00/)
    const price = priceMatch ? Number.parseInt(priceMatch[1]) : 0
    return total + price * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        updateQuantity,
        addExtraToItem,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
