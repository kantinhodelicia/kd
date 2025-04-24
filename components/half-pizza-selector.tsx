"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMenu, type PizzaItem, type PizzaSize } from "@/context/menu-context"
import { useCart } from "@/context/cart-context"
import { Check } from "lucide-react"

interface HalfPizzaSelectorProps {
  isOpen: boolean
  onClose: () => void
  size: PizzaSize
}

export function HalfPizzaSelector({ isOpen, onClose, size }: HalfPizzaSelectorProps) {
  const { pizzas } = useMenu()
  const { addItem } = useCart()
  const [firstHalf, setFirstHalf] = useState<PizzaItem | null>(null)
  const [secondHalf, setSecondHalf] = useState<PizzaItem | null>(null)
  const [step, setStep] = useState<1 | 2>(1)

  const activePizzas = pizzas.filter((pizza) => pizza.active)

  const handleSelectFirstHalf = (pizza: PizzaItem) => {
    setFirstHalf(pizza)
    setStep(2)
  }

  const handleSelectSecondHalf = (pizza: PizzaItem) => {
    setSecondHalf(pizza)
  }

  const handleAddToCart = () => {
    if (!firstHalf || !secondHalf) return

    // Calcular o preço (média dos dois preços)
    const firstPrice = Number.parseInt(firstHalf.prices[size].replace("$00", ""))
    const secondPrice = Number.parseInt(secondHalf.prices[size].replace("$00", ""))
    const averagePrice = Math.ceil((firstPrice + secondPrice) / 2)

    addItem({
      name: `Meio a Meio: ${firstHalf.name} / ${secondHalf.name}`,
      price: `${averagePrice}$00`,
      type: "pizza-meio-meio",
      size,
      firstHalf: {
        name: firstHalf.name,
        price: firstHalf.prices[size],
      },
      secondHalf: {
        name: secondHalf.name,
        price: secondHalf.prices[size],
      },
    })

    // Reset and close
    setFirstHalf(null)
    setSecondHalf(null)
    setStep(1)
    onClose()
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
      setSecondHalf(null)
    } else {
      onClose()
    }
  }

  const handleClose = () => {
    setFirstHalf(null)
    setSecondHalf(null)
    setStep(1)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Escolha o primeiro sabor" : "Escolha o segundo sabor"} - {size.toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-2">
            {activePizzas.map((pizza) => (
              <div
                key={pizza.id}
                className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                  (step === 1 && firstHalf?.id === pizza.id) || (step === 2 && secondHalf?.id === pizza.id)
                    ? "bg-red-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => (step === 1 ? handleSelectFirstHalf(pizza) : handleSelectSecondHalf(pizza))}
              >
                <div>
                  <h3 className="font-medium">{pizza.name}</h3>
                  <p className="text-sm text-gray-300">{pizza.description}</p>
                  <p className="text-sm font-bold mt-1">{pizza.prices[size]}</p>
                </div>
                {((step === 1 && firstHalf?.id === pizza.id) || (step === 2 && secondHalf?.id === pizza.id)) && (
                  <Check className="h-5 w-5 text-white" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleBack} className="text-white">
            {step === 1 ? "Cancelar" : "Voltar"}
          </Button>
          {step === 2 && (
            <Button
              onClick={handleAddToCart}
              disabled={!secondHalf}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
            >
              Adicionar ao Carrinho
            </Button>
          )}
        </DialogFooter>

        {step === 2 && firstHalf && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-300">Primeiro sabor selecionado:</p>
            <p className="font-medium">{firstHalf.name}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
