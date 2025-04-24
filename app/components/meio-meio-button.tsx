import { Button } from "@/components/ui/button"

interface MeioMeioButtonProps {
  onClick: () => void
}

export function MeioMeioButton({ onClick }: MeioMeioButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="
        bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600
        text-white font-bold py-4 px-6 rounded-xl shadow-lg 
        transition-all duration-300 hover:scale-105 border-b-4 border-yellow-700
      "
    >
      <div className="flex items-center">
        <span className="text-2xl mr-3">🍕</span>
        <div className="flex flex-col">
          <span>PIZZA MEIO A MEIO</span>
          <span className="text-xs opacity-80">Dois sabores em uma pizza</span>
        </div>
      </div>
    </Button>
  )
} 