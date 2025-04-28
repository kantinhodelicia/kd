"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { parseCookies, setCookie, destroyCookie } from "nookies"

export type PizzaSize = "familiar" | "medio" | "peq"

export type PizzaItem = {
  id: string
  name: string
  description: string
  prices: {
    familiar: string
    medio: string
    peq: string
  }
  active: boolean
}

export type ZonaItem = {
  id: string
  name: string
  price: string
  active: boolean
}

export type BebidaItem = {
  id: string
  name: string
  price: string
  active: boolean
}

export type ExtraItem = {
  id: string
  name: string
  price: string
  active: boolean
}

type MenuContextType = {
  pizzas: PizzaItem[]
  zonas: ZonaItem[]
  bebidas: BebidaItem[]
  extras: ExtraItem[]
  addPizza: (pizza: Omit<PizzaItem, "id">) => void
  updatePizza: (id: string, pizza: Partial<Omit<PizzaItem, "id">>) => void
  deletePizza: (id: string) => void
  addZona: (zona: Omit<ZonaItem, "id">) => void
  updateZona: (id: string, zona: Partial<Omit<ZonaItem, "id">>) => void
  deleteZona: (id: string) => void
  addBebida: (bebida: Omit<BebidaItem, "id">) => void
  updateBebida: (id: string, bebida: Partial<Omit<BebidaItem, "id">>) => void
  deleteBebida: (id: string) => void
  addExtra: (extra: Omit<ExtraItem, "id">) => void
  updateExtra: (id: string, extra: Partial<Omit<ExtraItem, "id">>) => void
  deleteExtra: (id: string) => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

// Initial data for pizzas
const initialPizzas: PizzaItem[] = [
  {
    id: "pizza-1",
    name: "MARGUERITA",
    description: "Queijo mussarela, gouda, oregano e molho tomate",
    prices: {
      familiar: "800$00",
      medio: "750$00",
      peq: "500$00",
    },
    active: true,
  },
  {
    id: "pizza-2",
    name: "4 QUEIJOS",
    description: "Queijo mussarela, queijo azul, edem e fogo e molho tomate",
    prices: {
      familiar: "950$00",
      medio: "850$00",
      peq: "650$00",
    },
    active: true,
  },
  {
    id: "pizza-3",
    name: "FIAMBRE",
    description: "Fiambre, Queijo e molho tomate",
    prices: {
      familiar: "850$00",
      medio: "800$00",
      peq: "600$00",
    },
    active: true,
  },
  {
    id: "pizza-4",
    name: "FRANGO",
    description: "Frango, queijo, molho tomate",
    prices: {
      familiar: "850$00",
      medio: "850$00",
      peq: "600$00",
    },
    active: true,
  },
  {
    id: "pizza-5",
    name: "CHOURIÇO",
    description: "Chouriço Queijo e molho tomate",
    prices: {
      familiar: "850$00",
      medio: "800$00",
      peq: "550$00",
    },
    active: true,
  },
  {
    id: "pizza-6",
    name: "BACON",
    description: "Bacon, queijo, molho tomate",
    prices: {
      familiar: "850$00",
      medio: "800$00",
      peq: "550$00",
    },
    active: true,
  },
  {
    id: "pizza-7",
    name: "PRESUNTO",
    description: "Presunto, queijo, molho tomate",
    prices: {
      familiar: "850$00",
      medio: "800$00",
      peq: "550$00",
    },
    active: true,
  },
  {
    id: "pizza-8",
    name: "LINGUIÇA E QUEIJO DE TERRA",
    description: "Linguiça, molho, tomate",
    prices: {
      familiar: "900$00",
      medio: "850$00",
      peq: "600$00",
    },
    active: true,
  },
  {
    id: "pizza-9",
    name: "CARNE MOÍDA",
    description: "Chouriço Queijo e molho tomate",
    prices: {
      familiar: "900$00",
      medio: "850$00",
      peq: "600$00",
    },
    active: true,
  },
  {
    id: "pizza-10",
    name: "ATUM",
    description: "Atum, cebola, queijo, molho tomate",
    prices: {
      familiar: "900$00",
      medio: "850$00",
      peq: "650$00",
    },
    active: true,
  },
  {
    id: "pizza-11",
    name: "VEGETARIANO",
    description: "Cebola, tomate, pimentão, cogumelo, queijo, molho tomate",
    prices: {
      familiar: "900$00",
      medio: "850$00",
      peq: "600$00",
    },
    active: true,
  },
  {
    id: "pizza-12",
    name: "ESPECIAL DA CASA",
    description: "Bacon, cogumelo, nata, queijo, molho tomate",
    prices: {
      familiar: "900$00",
      medio: "850$00",
      peq: "650$00",
    },
    active: true,
  },
  {
    id: "pizza-13",
    name: "QUATRO ESTAÇÕES",
    description: "Queijo e molho tomate cogumelo Fiambre Chouriço atum",
    prices: {
      familiar: "1000$00",
      medio: "850$00",
      peq: "650$00",
    },
    active: true,
  },
  {
    id: "pizza-14",
    name: "TROPICAL",
    description: "Frutas da época, queijo, molho tomate",
    prices: {
      familiar: "900$00",
      medio: "850$00",
      peq: "600$00",
    },
    active: true,
  },
  {
    id: "pizza-15",
    name: "MARISCO",
    description: "Marisco, queijo, molho tomate",
    prices: {
      familiar: "1200$00",
      medio: "1000$00",
      peq: "650$00",
    },
    active: true,
  },
  {
    id: "pizza-16",
    name: "CAMARÃO",
    description: "Camarão, queijo, molho tomate",
    prices: {
      familiar: "1200$00",
      medio: "1000$00",
      peq: "650$00",
    },
    active: true,
  },
  {
    id: "pizza-17",
    name: "MADÁ",
    description: "Queijo, molho tomate, Chouriço, Bacon, Camarão e Ananás",
    prices: {
      familiar: "1500$00",
      medio: "1200$00",
      peq: "800$00",
    },
    active: true,
  },
  {
    id: "pizza-18",
    name: "CALZONE",
    description: "Frango ou, Chouriço, Presunto, Cogumelo, Atum e Cebola (queijo e molho tomate)",
    prices: {
      familiar: "850$00",
      medio: "800$00",
      peq: "550$00",
    },
    active: true,
  },
]

// Initial data for zonas
const initialZonas: ZonaItem[] = [
  { id: "zona-1", name: "Alto Glória", price: "200$00", active: true },
  { id: "zona-2", name: "Achada Santo António", price: "200$00", active: true },
  { id: "zona-3", name: "Achada São Filipe", price: "300$00", active: true },
  { id: "zona-4", name: "Achada Grande Frente", price: "300$00", active: true },
  { id: "zona-5", name: "Achada Grande Trás", price: "300$00", active: true },
  { id: "zona-6", name: "Achada Eugênio Lima", price: "300$00", active: true },
  { id: "zona-7", name: "Achada Limpo/Achada Mato", price: "300$00", active: true },
  { id: "zona-8", name: "Achadinha", price: "200$00", active: true },
  { id: "zona-9", name: "Achadinha Pires", price: "250$00", active: true },
  { id: "zona-10", name: "Bairro Craveiro Lopes", price: "200$00", active: true },
  { id: "zona-11", name: "Bela Vista", price: "150$00", active: true },
  { id: "zona-12", name: "Campus Unicv", price: "250$00", active: true },
  { id: "zona-13", name: "Cidadela", price: "200$00", active: true },
  { id: "zona-14", name: "Cova Minhoto", price: "250$00", active: true },
  { id: "zona-15", name: "Calabaceira", price: "250$00", active: true },
  { id: "zona-16", name: "Coqueiro", price: "250$00", active: true },
  { id: "zona-17", name: "Castelão", price: "250$00", active: true },
  { id: "zona-18", name: "Fazenda", price: "200$00", active: true },
  { id: "zona-19", name: "Zona Quelém", price: "150$00", active: true },
  { id: "zona-20", name: "Quebra Canela", price: "200$00", active: true },
  { id: "zona-21", name: "Fundo Cobom", price: "150$00", active: true },
  { id: "zona-22", name: "Terra Branca", price: "50$00", active: true },
  { id: "zona-23", name: "Tira Chapéu", price: "100$00", active: true },
  { id: "zona-24", name: "Lém Ferreira", price: "200$00", active: true },
  { id: "zona-25", name: "Monte Vermelho", price: "200$00", active: true },
  { id: "zona-26", name: "Ponta Água", price: "250$00", active: true },
  { id: "zona-27", name: "Pensamento", price: "250$00", active: true },
  { id: "zona-28", name: "Palmarejo", price: "250$00", active: true },
  { id: "zona-29", name: "Palmarejo Grande", price: "200$00", active: true },
  { id: "zona-30", name: "Praia Negra", price: "200$00", active: true },
  { id: "zona-31", name: "Plateau", price: "200$00", active: true },
  { id: "zona-32", name: "Prainha", price: "200$00", active: true },
  { id: "zona-33", name: "São Pedro Latada", price: "300$00", active: true },
  { id: "zona-34", name: "Safende", price: "250$00", active: true },
  { id: "zona-35", name: "Várzea", price: "150$00", active: true },
  { id: "zona-36", name: "Vila Nova", price: "250$00", active: true },
]

// Initial data for bebidas
const initialBebidas: BebidaItem[] = [
  { id: "bebida-1", name: "Água Mineral 500ml", price: "100$00", active: true },
  { id: "bebida-2", name: "Coca-Cola 330ml", price: "150$00", active: true },
  { id: "bebida-3", name: "Fanta Laranja 330ml", price: "150$00", active: true },
  { id: "bebida-4", name: "Sprite 330ml", price: "150$00", active: true },
  { id: "bebida-5", name: "Sumol Ananás 330ml", price: "180$00", active: true },
  { id: "bebida-6", name: "Cerveja Strela 330ml", price: "200$00", active: true },
]

// Initial data for extras
const initialExtras: ExtraItem[] = [
  { id: "extra-1", name: "Ananás", price: "100$00", active: true },
  { id: "extra-2", name: "Cogumelo", price: "120$00", active: true },
  { id: "extra-3", name: "Queijo", price: "120$00", active: true },
  { id: "extra-4", name: "Queijo Azul", price: "150$00", active: true },
  { id: "extra-5", name: "Fiambre", price: "100$00", active: true },
  { id: "extra-6", name: "Chouriço", price: "100$00", active: true },
  { id: "extra-7", name: "Bacon", price: "120$00", active: true },
  { id: "extra-8", name: "Linguiça", price: "150$00", active: true },
  { id: "extra-9", name: "Atum", price: "130$00", active: true },
  { id: "extra-10", name: "Nata", price: "70$00", active: true },
  { id: "extra-11", name: "Marisco", price: "250$00", active: true },
  { id: "extra-12", name: "Camarão", price: "300$00", active: true },
]

export function MenuProvider({ children }: { children: ReactNode }) {
  const [pizzas, setPizzas] = useState<PizzaItem[]>(initialPizzas)
  const [zonas, setZonas] = useState<ZonaItem[]>(initialZonas)
  const [bebidas, setBebidas] = useState<BebidaItem[]>(initialBebidas)
  const [extras, setExtras] = useState<ExtraItem[]>(initialExtras)

  // Load data from cookies on component mount
  useEffect(() => {
<<<<<<< HEAD
    // Verifica se está no ambiente do navegador antes de acessar localStorage
    if (typeof window !== 'undefined') {
      const storedPizzas = localStorage.getItem("kantinho-pizzas")
      const storedZonas = localStorage.getItem("kantinho-zonas") 
      const storedBebidas = localStorage.getItem("kantinho-bebidas")
      const storedExtras = localStorage.getItem("kantinho-extras")
=======
    const cookies = parseCookies()
    const storedPizzas = cookies["kantinho-pizzas"]
    const storedZonas = cookies["kantinho-zonas"]
    const storedBebidas = cookies["kantinho-bebidas"]
    const storedExtras = cookies["kantinho-extras"]
>>>>>>> f5ca1c6 (Atualização do projeto com melhorias e correções)

      if (storedPizzas) setPizzas(JSON.parse(storedPizzas))
      if (storedZonas) setZonas(JSON.parse(storedZonas))
      if (storedBebidas) setBebidas(JSON.parse(storedBebidas))
      if (storedExtras) setExtras(JSON.parse(storedExtras))

      // Remover zona específica (movido para dentro do useEffect)
      localStorage.removeItem('kantinho-zonas');
    }
  }, [])

  // Save data to cookies whenever it changes
  useEffect(() => {
<<<<<<< HEAD
    // Verifica se está no ambiente do navegador antes de acessar localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("kantinho-pizzas", JSON.stringify(pizzas))
      localStorage.setItem("kantinho-zonas", JSON.stringify(zonas))
      localStorage.setItem("kantinho-bebidas", JSON.stringify(bebidas))
      localStorage.setItem("kantinho-extras", JSON.stringify(extras))
=======
    // Usamos um try/catch para evitar erros durante a renderização no servidor
    try {
      setCookie(null, "kantinho-pizzas", JSON.stringify(pizzas), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/",
      })
      setCookie(null, "kantinho-zonas", JSON.stringify(zonas), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/",
      })
      setCookie(null, "kantinho-bebidas", JSON.stringify(bebidas), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/",
      })
      setCookie(null, "kantinho-extras", JSON.stringify(extras), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/",
      })
    } catch (error) {
      console.error("Erro ao salvar cookies:", error)
>>>>>>> f5ca1c6 (Atualização do projeto com melhorias e correções)
    }
  }, [pizzas, zonas, bebidas, extras])

  // Pizza CRUD operations
  const addPizza = (pizza: Omit<PizzaItem, "id">) => {
    const newPizza = {
      ...pizza,
      id: `pizza-${Date.now()}`,
    }
    setPizzas((prev) => [...prev, newPizza])
  }

  const updatePizza = (id: string, pizza: Partial<Omit<PizzaItem, "id">>) => {
    setPizzas((prev) => prev.map((item) => (item.id === id ? { ...item, ...pizza } : item)))
  }

  const deletePizza = (id: string) => {
    setPizzas((prev) => prev.filter((item) => item.id !== id))
  }

  // Zona CRUD operations
  const addZona = (zona: Omit<ZonaItem, "id">) => {
    const newZona = {
      ...zona,
      id: `zona-${Date.now()}`,
    }
    setZonas((prev) => [...prev, newZona])
  }

  const updateZona = (id: string, zona: Partial<Omit<ZonaItem, "id">>) => {
    setZonas((prev) => prev.map((item) => (item.id === id ? { ...item, ...zona } : item)))
  }

  const deleteZona = (id: string) => {
    setZonas((prev) => prev.filter((item) => item.id !== id))
  }

  // Bebida CRUD operations
  const addBebida = (bebida: Omit<BebidaItem, "id">) => {
    const newBebida = {
      ...bebida,
      id: `bebida-${Date.now()}`,
    }
    setBebidas((prev) => [...prev, newBebida])
  }

  const updateBebida = (id: string, bebida: Partial<Omit<BebidaItem, "id">>) => {
    setBebidas((prev) => prev.map((item) => (item.id === id ? { ...item, ...bebida } : item)))
  }

  const deleteBebida = (id: string) => {
    setBebidas((prev) => prev.filter((item) => item.id !== id))
  }

  // Extra CRUD operations
  const addExtra = (extra: Omit<ExtraItem, "id">) => {
    const newExtra = {
      ...extra,
      id: `extra-${Date.now()}`,
    }
    setExtras((prev) => [...prev, newExtra])
  }

  const updateExtra = (id: string, extra: Partial<Omit<ExtraItem, "id">>) => {
    setExtras((prev) => prev.map((item) => (item.id === id ? { ...item, ...extra } : item)))
  }

  const deleteExtra = (id: string) => {
    setExtras((prev) => prev.filter((item) => item.id !== id))
  }

<<<<<<< HEAD
=======
  // Remova a linha que usa localStorage diretamente
  // O localStorage não está disponível no lado do servidor

>>>>>>> f5ca1c6 (Atualização do projeto com melhorias e correções)
  return (
    <MenuContext.Provider
      value={{
        pizzas,
        zonas,
        bebidas,
        extras,
        addPizza,
        updatePizza,
        deletePizza,
        addZona,
        updateZona,
        deleteZona,
        addBebida,
        updateBebida,
        deleteBebida,
        addExtra,
        updateExtra,
        deleteExtra,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider")
  }
  return context
}
