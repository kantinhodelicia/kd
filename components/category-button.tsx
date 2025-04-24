"use client"
import type { ReactNode } from "react"

interface CategoryButtonProps {
  active: boolean
  onClick: () => void
  icon: ReactNode
  label: string
}

export function CategoryButton({ active, onClick, icon, label }: CategoryButtonProps) {
  return (
    <button
      className={`
        relative overflow-hidden rounded-xl px-6 py-3 font-bold tracking-wider
        transition-all duration-300 ease-out shadow-lg
        ${
          active
            ? "bg-gradient-to-br from-red-500 to-red-700 text-white scale-105"
            : "bg-gray-800 hover:bg-gray-700 text-white hover:scale-105"
        }
        transform hover:-translate-y-1 active:translate-y-0
      `}
      onClick={onClick}
    >
      {/* Efeito de brilho no hover */}
      <span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
        transform -translate-x-full hover:translate-x-full transition-transform duration-1000"
      ></span>

      {/* Conteúdo do botão */}
      <span className="flex items-center justify-center">
        <span className="text-2xl">{icon}</span>
      </span>

      {/* Borda animada */}
      <span
        className="absolute inset-0 rounded-xl border-2 border-transparent 
        transition-all duration-300 ease-out
        hover:border-white/20"
      ></span>
    </button>
  )
}
