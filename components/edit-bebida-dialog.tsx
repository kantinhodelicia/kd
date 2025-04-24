"use client"
import { useState } from "react"
import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMenu, type BebidaItem } from "@/context/menu-context"

interface EditBebidaDialogProps {
  bebida?: BebidaItem
  isOpen: boolean
  onClose: () => void
}

export function EditBebidaDialog({ bebida, isOpen, onClose }: EditBebidaDialogProps) {
  const { addBebida, updateBebida } = useMenu()
  const isEditing = !!bebida

  const [formData, setFormData] = useState<{
    name: string
    price: string
  }>({
    name: bebida?.name || "",
    price: bebida?.price.replace("$00", "") || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const bebidaData = {
      name: formData.name,
      price: `${formData.price}$00`,
      active: true,
    }

    if (isEditing && bebida) {
      updateBebida(bebida.id, bebidaData)
    } else {
      addBebida(bebidaData)
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Bebida" : "Adicionar Nova Bebida"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Bebida</Label>
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
              <Label htmlFor="price">Preço</Label>
              <div className="relative">
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="bg-gray-700 border-gray-600 pr-12"
                  required
                  type="number"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">$00</span>
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
