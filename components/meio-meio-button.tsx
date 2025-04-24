"use client"
import { useState, useEffect } from "react"
import { SplitSquareVertical } from "lucide-react"

interface MeioMeioButtonProps {
  onClick: () => void
}

export function MeioMeioButton({ onClick }: MeioMeioButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Efeito de movimento do gradiente
  useEffect(() => {
    if (!isHovered) return

    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * 100,
        y: Math.random() * 100,
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isHovered])

  return (
    <button
      className="
        relative overflow-hidden rounded-xl px-8 py-4 font-bold text-white
        bg-gradient-to-r from-yellow-500 to-amber-600
        transition-all duration-500 ease-out shadow-lg
        transform hover:scale-105 hover:shadow-xl active:scale-100
        group
      "
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundPosition: isHovered ? `${position.x}% ${position.y}%` : "center",
      }}
    >
      {/* Efeito de divisão */}
      <div className="absolute inset-0 flex opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-1/2 bg-gradient-to-br from-yellow-300/30 to-yellow-500/10"></div>
        <div className="w-1/2 bg-gradient-to-bl from-amber-500/30 to-amber-600/10"></div>
      </div>

      {/* Linha divisória animada */}
      <div
        className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/30 
        transform -translate-x-1/2 scale-y-0 group-hover:scale-y-100 transition-transform duration-500"
      ></div>

      {/* Conteúdo do botão */}
      <div className="flex items-center gap-3 relative z-10">
        <SplitSquareVertical className="h-5 w-5 group-hover:animate-pulse" />
        <span className="tracking-wider group-hover:tracking-widest transition-all duration-300">
          Pizza Meio a Meio
        </span>
      </div>

      {/* Brilho inferior */}
      <div
        className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-yellow-300 to-amber-400 
        transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
      ></div>

      {/* Efeito de brilho que passa pelo botão */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
        transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
      ></div>
    </button>
  )
}
