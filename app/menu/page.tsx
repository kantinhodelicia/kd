"use client"
import { useState } from "react"
import Link from "next/link"
import { Instagram, Facebook, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useMenu, type PizzaSize } from "@/context/menu-context"
import { useAuth } from "@/context/auth-context"
import { Cart } from "@/components/cart"
import { HalfPizzaSelector } from "@/components/half-pizza-selector"
import { AuthGuard } from "@/components/auth-guard"
import { MeioMeioButton } from "@/components/meio-meio-button"
import { CategoryButton } from "@/components/category-button"
import { SizeButton } from "@/components/size-button"
import { useRouter } from "next/navigation"

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<"pizzas" | "bebidas" | "zonas">("pizzas")
  const [activeSize, setActiveSize] = useState<PizzaSize>("familiar")
  const [isHalfPizzaOpen, setIsHalfPizzaOpen] = useState(false)
  const { addItem } = useCart()
  const { pizzas, zonas, bebidas } = useMenu()
  const { user } = useAuth()
  const router = useRouter()

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const password = prompt("Digite a senha de administrador:")
    if (password === "B91edfbf46@#") {
      router.push("/admin")
    } else if (password !== null) {
      alert("Senha incorreta!")
    }
  }

  return (
    <AuthGuard>
      <div
        className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-4 py-8"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('/pizza-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <header className="w-full max-w-4xl flex flex-col items-center relative">
          <div className="absolute right-0 top-0 flex gap-2">
            <Link href="/profile">
              <Button variant="secondary" size="sm" className="bg-gray-700 hover:bg-gray-600 text-white">
                <User className="h-4 w-4" />
              </Button>
            </Link>
            {user?.role === "admin" && (
              <Button
                variant="secondary"
                size="sm"
                className="bg-gray-700 hover:bg-gray-600 text-white"
                onClick={handleAdminClick}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-2 text-center">PIZZARIA KANTINHO DELÍCIA</h1>

          <div className="flex gap-4 mb-2">
            <Link href="https://instagram.com" className="text-white hover:text-gray-300">
              <Instagram size={24} />
            </Link>
            <Link href="https://facebook.com" className="text-white hover:text-gray-300">
              <Facebook size={24} />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm md:text-base">
            <div className="flex items-center">
              <span className="font-bold mr-2">FIXO:</span> 2616090
            </div>
            <div className="flex items-center">
              <span className="font-bold mr-2">SWAG:</span> 5999204
            </div>
            <div className="flex items-center">
              <span className="font-bold mr-2">PLAY:</span> 9352262
            </div>
          </div>

          <div className="text-center mb-4">
            <p className="text-gray-300">Bem-vindo, {user?.name}!</p>
          </div>
        </header>

        <nav className="w-full max-w-4xl mb-8">
          {/* Botões de categoria */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <CategoryButton
              active={activeCategory === "pizzas"}
              onClick={() => setActiveCategory("pizzas")}
              icon="🍕"
              label="PIZZAS"
            />
            <CategoryButton
              active={activeCategory === "bebidas"}
              onClick={() => setActiveCategory("bebidas")}
              icon="🥤"
              label="BEBIDAS"
            />
            <CategoryButton
              active={activeCategory === "zonas"}
              onClick={() => setActiveCategory("zonas")}
              icon="🚚"
              label="ZONAS"
            />
          </div>

          {activeCategory === "pizzas" && (
            <>
              {/* Botões de tamanho */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <SizeButton
                  active={activeSize === "familiar"}
                  onClick={() => setActiveSize("familiar")}
                  label="FAMILIAR"
                  size="XL"
                />
                <SizeButton
                  active={activeSize === "medio"}
                  onClick={() => setActiveSize("medio")}
                  label="MEDIO"
                  size="M"
                />
                <SizeButton active={activeSize === "peq"} onClick={() => setActiveSize("peq")} label="PEQ" size="S" />
              </div>

              {/* Botão Pizza Meio a Meio */}
              <div className="flex justify-center mb-8">
                <MeioMeioButton onClick={() => setIsHalfPizzaOpen(true)} />
              </div>
            </>
          )}
        </nav>

        <main className="w-full max-w-4xl">
          {activeCategory === "pizzas" && (
            <div className="space-y-4">
              {pizzas
                .filter((pizza) => pizza.active)
                .map((pizza) => (
                  <PizzaItem
                    key={pizza.id}
                    name={pizza.name}
                    description={pizza.description}
                    price={pizza.prices[activeSize]}
                    size={activeSize}
                    onAddToCart={() =>
                      addItem({
                        name: pizza.name,
                        price: pizza.prices[activeSize],
                        type: "pizza",
                        size: activeSize,
                      })
                    }
                  />
                ))}

              {pizzas.filter((pizza) => pizza.active).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  Nenhuma pizza disponível. Adicione pizzas no ADM.
                </div>
              )}
            </div>
          )}

          {activeCategory === "bebidas" && (
            <div className="space-y-4">
              {bebidas
                .filter((bebida) => bebida.active)
                .map((bebida) => (
                  <BebidaItem
                    key={bebida.id}
                    name={bebida.name}
                    price={bebida.price}
                    onAddToCart={() =>
                      addItem({
                        name: bebida.name,
                        price: bebida.price,
                        type: "bebida",
                      })
                    }
                  />
                ))}

              {bebidas.filter((bebida) => bebida.active).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  Nenhuma bebida disponível. Adicione bebidas no ADM.
                </div>
              )}
            </div>
          )}

          {activeCategory === "zonas" && (
            <div className="space-y-6">
              <div className="bg-gray-800 bg-opacity-80 rounded-lg p-4 mb-6">
                <h2 className="text-center text-xl font-bold mb-2 text-white">ZONAS DE ENTREGA</h2>
                <p className="text-center text-sm text-gray-300 mb-1">Selecione sua localização para entrega</p>
                <p className="text-center text-xs text-gray-400">* Os valores serão acrescentados ao total da sua compra</p>
              </div>
              
              {zonas
                .filter((zona) => zona.active)
                .map((zona) => (
                  <ZonaItem
                    key={zona.id}
                    name={zona.name}
                    price={zona.price}
                    onAddToCart={() =>
                      addItem({
                        name: `Entrega: ${zona.name}`,
                        price: zona.price,
                        type: "zona",
                      })
                    }
                  />
                ))}

              {zonas.filter((zona) => zona.active).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  Nenhuma zona de entrega disponível. Adicione zonas no ADM.
                </div>
              )}
              
              <div className="bg-yellow-600 bg-opacity-80 text-white p-4 rounded-lg mt-6 shadow-lg">
                <p className="text-center text-sm font-bold">⚠️ OS VALORES SERÃO ACRESCENTADOS AO TOTAL DA COMPRA, MAIS TAXA DE ENTREGA (DEPENDE DA ZONA) ⚠️</p>
              </div>
            </div>
          )}
        </main>

        <Cart />
        <HalfPizzaSelector isOpen={isHalfPizzaOpen} onClose={() => setIsHalfPizzaOpen(false)} size={activeSize} />
      </div>
    </AuthGuard>
  )
}

interface PizzaItemProps {
  name: string
  description: string
  price: string
  size: PizzaSize
  onAddToCart: () => void
}

function PizzaItem({ name, description, price, onAddToCart }: PizzaItemProps) {
  return (
    <div
      className="bg-gray-800 bg-opacity-80 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-700 transition-colors"
      onClick={onAddToCart}
    >
      <div>
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <div className="text-xl font-bold">{price}</div>
    </div>
  )
}

interface BebidaItemProps {
  name: string
  price: string
  onAddToCart: () => void
}

function BebidaItem({ name, price, onAddToCart }: BebidaItemProps) {
  return (
    <div
      className="bg-gray-800 bg-opacity-80 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-700 transition-colors"
      onClick={onAddToCart}
    >
      <div>
        <h3 className="text-xl font-bold">{name}</h3>
      </div>
      <div className="text-xl font-bold">{price}</div>
    </div>
  )
}

interface ZonaItemProps {
  name: string
  price: string
  onAddToCart: () => void
}

function ZonaItem({ name, price, onAddToCart }: ZonaItemProps) {
  return (
    <div
      className="bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-90 rounded-lg p-5 flex justify-between items-center cursor-pointer hover:from-gray-700 hover:to-gray-600 transition-all duration-300 border-l-4 border-red-600 shadow-lg"
      onClick={onAddToCart}
    >
      <div className="flex items-center">
        <div className="bg-red-600 rounded-full p-2 mr-4 hidden md:flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <p className="text-xs text-gray-300 mt-1">Taxa de entrega</p>
        </div>
      </div>
      <div className="text-xl font-bold bg-red-600 py-2 px-4 rounded-lg">{price}</div>
    </div>
  )
}
