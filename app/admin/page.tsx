"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, PlusCircle, Edit, Trash2, BarChart, Settings, Pizza, Truck, Coffee, Plus } from "lucide-react"
import { useMenu } from "@/context/menu-context"
import { EditPizzaDialog } from "@/components/edit-pizza-dialog"
import { EditZonaDialog } from "@/components/edit-zona-dialog"
import { EditBebidaDialog } from "@/components/edit-bebida-dialog"
import { EditExtraDialog } from "@/components/edit-extra-dialog"
import { AuthGuard } from "@/components/auth-guard"
import type { PizzaItem, ZonaItem, BebidaItem, ExtraItem } from "@/context/menu-context"

export default function AdminPage() {
  const { pizzas, zonas, bebidas, extras, deletePizza, deleteZona, deleteBebida, deleteExtra } = useMenu()

  const [editingPizza, setEditingPizza] = useState<PizzaItem | undefined>(undefined)
  const [isAddPizzaOpen, setIsAddPizzaOpen] = useState(false)

  const [editingZona, setEditingZona] = useState<ZonaItem | undefined>(undefined)
  const [isAddZonaOpen, setIsAddZonaOpen] = useState(false)

  const [editingBebida, setEditingBebida] = useState<BebidaItem | undefined>(undefined)
  const [isAddBebidaOpen, setIsAddBebidaOpen] = useState(false)

  const [editingExtra, setEditingExtra] = useState<ExtraItem | undefined>(undefined)
  const [isAddExtraOpen, setIsAddExtraOpen] = useState(false)

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <Button variant="outline" className="text-white">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Menu
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">ADM</h1>
            <div className="flex gap-2">
              <Link href="/admin/settings" title="Configurações">
                <Button size="icon" className="bg-gray-700 hover:bg-gray-600 h-10 w-10">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/admin/dashboard" title="Dashboard">
                <Button size="icon" className="bg-blue-600 hover:bg-blue-700 h-10 w-10">
                  <BarChart className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <Tabs defaultValue="pizzas" className="mb-8">
            <TabsList className="bg-gray-800 border-gray-700 mb-4">
              <TabsTrigger value="pizzas" className="data-[state=active]:bg-red-600">
                <Pizza className="h-5 w-5" />
              </TabsTrigger>
              <TabsTrigger value="zonas" className="data-[state=active]:bg-red-600">
                <Truck className="h-5 w-5" />
              </TabsTrigger>
              <TabsTrigger value="bebidas" className="data-[state=active]:bg-red-600">
                <Coffee className="h-5 w-5" />
              </TabsTrigger>
              <TabsTrigger value="extras" className="data-[state=active]:bg-red-600">
                <Plus className="h-5 w-5" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pizzas">
              <div className="mb-6">
                <Button
                  className="w-full md:w-auto bg-red-600 hover:bg-red-700"
                  onClick={() => setIsAddPizzaOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Pizza
                </Button>
              </div>

              <div className="space-y-4">
                {pizzas.map((pizza) => (
                  <div key={pizza.id} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{pizza.name}</h3>
                      <p className="text-sm text-gray-400">{pizza.description}</p>
                      <div className="flex gap-4 mt-1 text-sm">
                        <span>Familiar: {pizza.prices.familiar}</span>
                        <span>Médio: {pizza.prices.medio}</span>
                        <span>Pequeno: {pizza.prices.peq}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-white" onClick={() => setEditingPizza(pizza)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm(`Tem certeza que deseja excluir a pizza ${pizza.name}?`)) {
                            deletePizza(pizza.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {pizzas.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    Nenhuma pizza cadastrada. Adicione uma nova pizza.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="zonas">
              <div className="mb-6">
                <Button className="w-full md:w-auto bg-red-600 hover:bg-red-700" onClick={() => setIsAddZonaOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Zona
                </Button>
              </div>

              <div className="space-y-4">
                {zonas.map((zona) => (
                  <div key={zona.id} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{zona.name}</h3>
                      <p className="text-sm text-gray-400">Preço de entrega: {zona.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-white" onClick={() => setEditingZona(zona)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm(`Tem certeza que deseja excluir a zona ${zona.name}?`)) {
                            deleteZona(zona.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {zonas.length === 0 && (
                  <div className="text-center py-8 text-gray-400">Nenhuma zona cadastrada. Adicione uma nova zona.</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="bebidas">
              <div className="mb-6">
                <Button
                  className="w-full md:w-auto bg-red-600 hover:bg-red-700"
                  onClick={() => setIsAddBebidaOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Bebida
                </Button>
              </div>

              <div className="space-y-4">
                {bebidas.map((bebida) => (
                  <div key={bebida.id} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{bebida.name}</h3>
                      <p className="text-sm text-gray-400">Preço: {bebida.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-white"
                        onClick={() => setEditingBebida(bebida)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm(`Tem certeza que deseja excluir a bebida ${bebida.name}?`)) {
                            deleteBebida(bebida.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {bebidas.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    Nenhuma bebida cadastrada. Adicione uma nova bebida.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="extras">
              <div className="mb-6">
                <Button
                  className="w-full md:w-auto bg-red-600 hover:bg-red-700"
                  onClick={() => setIsAddExtraOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Extra
                </Button>
              </div>

              <div className="space-y-4">
                {extras.map((extra) => (
                  <div key={extra.id} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{extra.name}</h3>
                      <p className="text-sm text-gray-400">Preço: {extra.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-white" onClick={() => setEditingExtra(extra)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm(`Tem certeza que deseja excluir o extra ${extra.name}?`)) {
                            deleteExtra(extra.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {extras.length === 0 && (
                  <div className="text-center py-8 text-gray-400">Nenhum extra cadastrado. Adicione um novo extra.</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Pizza Edit Dialog */}
        <EditPizzaDialog pizza={editingPizza} isOpen={!!editingPizza} onClose={() => setEditingPizza(undefined)} />

        {/* Add Pizza Dialog */}
        <EditPizzaDialog isOpen={isAddPizzaOpen} onClose={() => setIsAddPizzaOpen(false)} />

        {/* Zona Edit Dialog */}
        <EditZonaDialog zona={editingZona} isOpen={!!editingZona} onClose={() => setEditingZona(undefined)} />

        {/* Add Zona Dialog */}
        <EditZonaDialog isOpen={isAddZonaOpen} onClose={() => setIsAddZonaOpen(false)} />

        {/* Bebida Edit Dialog */}
        <EditBebidaDialog bebida={editingBebida} isOpen={!!editingBebida} onClose={() => setEditingBebida(undefined)} />

        {/* Add Bebida Dialog */}
        <EditBebidaDialog isOpen={isAddBebidaOpen} onClose={() => setIsAddBebidaOpen(false)} />

        {/* Extra Edit Dialog */}
        <EditExtraDialog extra={editingExtra} isOpen={!!editingExtra} onClose={() => setEditingExtra(undefined)} />

        {/* Add Extra Dialog */}
        <EditExtraDialog isOpen={isAddExtraOpen} onClose={() => setIsAddExtraOpen(false)} />
      </div>
    </AuthGuard>
  )
}
