"use client"
import { useState } from "react"
import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMenu, type ExtraItem } from "@/context/menu-context"

interface EditExtraDialogProps {
  extra?: ExtraItem
  isOpen: boolean
  onClose: () => void
}

export function EditExtraDialog({ extra, isOpen, onClose }: EditExtraDialogProps) {
  const { addExtra, updateExtra } = useMenu()
  const isEditing = !!extra

  const [formData, setFormData] = useState<{
    name: string
    price: string
  }>({
    name: extra?.name || "",
    price: extra?.price.replace("$00", "") || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const extraData = {
      name: formData.name,
      price: `${formData.price}$00`,
      active: true,
    }

    if (isEditing && extra) {
      updateExtra(extra.id, extraData)
    } else {
      addExtra(extraData)
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Extra" : "Adicionar Novo Extra"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Extra</Label>
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
