"use client"

interface SizeButtonProps {
  active: boolean
  onClick: () => void
  label: string
  size: string
}

export function SizeButton({ active, onClick, label, size }: SizeButtonProps) {
  return (
    <button
      className={`
        relative overflow-hidden rounded-full px-6 py-3 font-bold
        transition-all duration-300 ease-out shadow-md
        ${
          active ? "bg-gradient-to-r from-orange-500 to-red-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-white"
        }
        transform hover:scale-105 active:scale-100
        flex items-center justify-center gap-2
      `}
      onClick={onClick}
    >
      {/* Indicador de tamanho */}
      <span
        className={`
        text-xs rounded-full h-5 w-5 flex items-center justify-center
        ${active ? "bg-white/30" : "bg-white/10"}
        transition-colors duration-300
      `}
      >
        {size}
      </span>

      {/* Label do botão */}
      <span className="relative">
        {label}
        {active && (
          <span
            className="absolute bottom-0 left-0 w-full h-0.5 bg-white/50 
            animate-pulse"
          ></span>
        )}
      </span>

      {/* Efeito de brilho */}
      <span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
        transform -translate-x-full hover:translate-x-full transition-transform duration-1000"
      ></span>
    </button>
  )
}
