"use client"
import { useState } from "react"
import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useMenu, type PizzaItem } from "@/context/menu-context"

interface EditPizzaDialogProps {
  pizza?: PizzaItem
  isOpen: boolean
  onClose: () => void
}

export function EditPizzaDialog({ pizza, isOpen, onClose }: EditPizzaDialogProps) {
  const { addPizza, updatePizza } = useMenu()
  const isEditing = !!pizza

  const [formData, setFormData] = useState<{
    name: string
    description: string
    priceFamiliar: string
    priceMedio: string
    pricePeq: string
  }>({
    name: pizza?.name || "",
    description: pizza?.description || "",
    priceFamiliar: pizza?.prices.familiar.replace("$00", "") || "",
    priceMedio: pizza?.prices.medio.replace("$00", "") || "",
    pricePeq: pizza?.prices.peq.replace("$00", "") || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const pizzaData = {
      name: formData.name,
      description: formData.description,
      prices: {
        familiar: `${formData.priceFamiliar}$00`,
        medio: `${formData.priceMedio}$00`,
        peq: `${formData.pricePeq}$00`,
      },
      active: true,
    }

    if (isEditing && pizza) {
      updatePizza(pizza.id, pizzaData)
    } else {
      addPizza(pizzaData)
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Pizza" : "Adicionar Nova Pizza"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-gray-700 border-gray-600"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="bg-gray-700 border-gray-600"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priceFamiliar">Preço Familiar</Label>
                <div className="relative">
                  <Input
                    id="priceFamiliar"
                    name="priceFamiliar"
                    value={formData.priceFamiliar}
                    onChange={handleChange}
                    className="bg-gray-700 border-gray-600 pr-12"
                    required
                    type="number"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">$00</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priceMedio">Preço Médio</Label>
                <div className="relative">
                  <Input
                    id="priceMedio"
                    name="priceMedio"
                    value={formData.priceMedio}
                    onChange={handleChange}
                    className="bg-gray-700 border-gray-600 pr-12"
                    required
                    type="number"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">$00</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pricePeq">Preço Pequeno</Label>
                <div className="relative">
                  <Input
                    id="pricePeq"
                    name="pricePeq"
                    value={formData.pricePeq}
                    onChange={handleChange}
                    className="bg-gray-700 border-gray-600 pr-12"
                    required
                    type="number"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">$00</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="text-white">
              Cancelar
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              {isEditing ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
