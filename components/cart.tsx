"use client"
import { useState, useEffect } from "react"
import { ShoppingCart, X, Plus, Minus, Trash2, Receipt, PlusCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart, type CartItemType } from "@/context/cart-context"
import { useMenu } from "@/context/menu-context"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function Cart() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [isExtrasDialogOpen, setIsExtrasDialogOpen] = useState(false)
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart, addExtraToItem, addItem } = useCart()
  const { extras } = useMenu()

  const toggleCart = () => {
    setIsOpen(!isOpen)
  }

  const handleAddExtra = (extraId: string) => {
    if (!selectedItemId) return

    const extra = extras.find((e) => e.id === extraId)
    if (!extra) return

    addExtraToItem(selectedItemId, {
      name: `Extra: ${extra.name}`,
      price: extra.price,
      type: "extra",
    })

    // Close the dialog after adding
    setIsExtrasDialogOpen(false)
  }

  const openExtrasDialog = (itemId: string) => {
    setSelectedItemId(itemId)
    setIsExtrasDialogOpen(true)
  }

  // Filter active extras
  const activeExtras = extras.filter((extra) => extra.active)

  // Remover todos os itens de caixa do carrinho na inicialização
  useEffect(() => {
    const boxItem = items.find((item) => item.type === "box")
    if (boxItem) {
      removeItem(boxItem.id)
    }
  }, []);

  return (
    <div className="relative z-50">
      <Button
        onClick={toggleCart}
        className="bg-red-600 hover:bg-red-700 text-white fixed bottom-4 right-4 md:bottom-8 md:right-8 rounded-full h-16 w-16 shadow-lg"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">
            {totalItems}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
          <div className="bg-gray-900 w-full max-w-md h-full overflow-y-auto p-4 animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Seu Carrinho</h2>
              <Button variant="ghost" size="icon" onClick={toggleCart} className="text-white">
                <X className="h-6 w-6" />
              </Button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <ShoppingCart className="h-12 w-12 mb-4" />
                <p className="text-lg">Seu carrinho está vazio</p>
                <p className="text-sm mt-2">Clique nos produtos para adicionar ao carrinho</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {items
                    .filter((item) => !item.parentItemId && item.type !== "box")
                    .map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onAddExtra={() => openExtrasDialog(item.id)}
                        extras={items.filter((i) => i.parentItemId === item.id)}
                      />
                    ))}
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between text-lg mb-2">
                    <span>Subtotal:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>

                  <Link href="/receipt" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white mt-4 flex items-center justify-center gap-2">
                      <Receipt className="h-4 w-4" />
                      Finalizar Pedido
                    </Button>
                  </Link>

                  <Button variant="outline" className="w-full mt-2 text-white" onClick={clearCart}>
                    Limpar Carrinho
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Extras Dialog */}
      <Dialog open={isExtrasDialogOpen} onOpenChange={setIsExtrasDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Adicionar Extras</DialogTitle>
          </DialogHeader>
          <style jsx global>{`
            #extras-dialog-content::-webkit-scrollbar {
              width: 8px;
            }
            #extras-dialog-content::-webkit-scrollbar-track {
              background: #1F2937;
              border-radius: 4px;
            }
            #extras-dialog-content::-webkit-scrollbar-thumb {
              background-color: #4B5563;
              border-radius: 4px;
            }
          `}</style>
          <div 
            id="extras-dialog-content"
            className="max-h-[300px] overflow-y-auto pr-2 space-y-3 mt-2"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#4B5563 #1F2937',
              msOverflowStyle: 'none'
            }}
          >
            {activeExtras.length > 0 ? (
              activeExtras.map((extra) => (
                <div
                  key={extra.id}
                  className="bg-gray-700 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-600"
                  onClick={() => handleAddExtra(extra.id)}
                >
                  <div>
                    <h3 className="font-medium">{extra.name}</h3>
                    <p className="text-sm text-gray-400">{extra.price}</p>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">Nenhum extra disponível</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface CartItemProps {
  item: CartItemType
  onAddExtra: () => void
  extras: CartItemType[]
}

function CartItem({ item, onAddExtra, extras }: CartItemProps) {
  const { updateQuantity, removeItem, addExtraToItem } = useCart()

  // Only show add extras button for pizza items
  const canAddExtras = item.type === "pizza" || item.type === "pizza-meio-meio"
  
  // Verificar se já existe uma caixa para esta pizza
  const hasPizzaBox = extras.some(extra => extra.name === "Caixa de Pizza")
  
  // Função para adicionar caixa de pizza como extra
  const handleAddPizzaBox = () => {
    if (!hasPizzaBox) {
      addExtraToItem(item.id, {
        name: "Caixa de Pizza",
        price: "100$00",
        type: "extra",
      })
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-3">
      <div className="flex justify-between">
        <div className="flex-1">
          <h3 className="font-medium">{item.name}</h3>
          {item.type === "pizza" && item.size && <p className="text-sm text-gray-400">Tamanho: {item.size}</p>}
          {item.type === "pizza-meio-meio" && (
            <>
              <p className="text-sm text-gray-400">Tamanho: {item.size}</p>
              <div className="text-sm text-gray-400 mt-1">
                <p>Metade 1: {item.firstHalf?.name}</p>
                <p>Metade 2: {item.secondHalf?.name}</p>
              </div>
            </>
          )}
          <p className="text-sm text-gray-400">
            {item.type === "pizza" || item.type === "pizza-meio-meio"
              ? "Pizza"
              : item.type === "zona"
                ? "Entrega"
                : item.type === "extra"
                  ? "Extra"
                  : "Bebida"}
          </p>
        </div>

        <div className="flex flex-col items-end">
          <p className="font-bold">{item.price}</p>

          <div className="flex items-center mt-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span className="mx-2 min-w-[20px] text-center">{item.quantity}</span>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-2 text-red-500"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Extras list */}
      {extras.length > 0 && (
        <div className="mt-2 pl-3 border-l-2 border-gray-700">
          <p className="text-xs text-gray-400 mb-1">Extras:</p>
          {extras.map((extra) => (
            <div key={extra.id} className="flex justify-between items-center text-sm">
              <span>
                {extra.name} x{extra.quantity}
              </span>
              <span>{extra.price}</span>
            </div>
          ))}
        </div>
      )}

      {/* Opções para pizzas */}
      {(item.type === "pizza" || item.type === "pizza-meio-meio") && (
        <div className="flex flex-col mt-2">
          {/* Add extras button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-400 hover:text-white w-full flex items-center justify-center"
            onClick={onAddExtra}
          >
            <PlusCircle className="h-3 w-3 mr-1" /> Adicionar extras
          </Button>
          
          {/* Adicionar caixa de pizza */}
          {!hasPizzaBox ? (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 text-xs text-gray-400 hover:text-white w-full flex items-center justify-center"
              onClick={handleAddPizzaBox}
            >
              <Package className="h-3 w-3 mr-1" /> Adicionar caixa (100$00)
            </Button>
          ) : (
            <div className="mt-1 text-xs text-green-500 text-center">
              ✓ Caixa de pizza incluída
            </div>
          )}
        </div>
      )}
    </div>
  )
}
