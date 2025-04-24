import { Button } from "@/components/ui/button"

interface CategoryButtonProps {
  icon: string
  label: string
  active: boolean
  onClick: () => void
}

export function CategoryButton({ icon, label, active, onClick }: CategoryButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`
        rounded-xl py-6 px-8 font-bold transition-all duration-300 shadow-lg
        ${
          active
            ? "bg-gradient-to-r from-red-600 to-red-700 text-white border-b-4 border-red-800 hover:from-red-700 hover:to-red-800 transform hover:-translate-y-1"
            : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 hover:text-white"
        }
      `}
    >
      <span className="text-2xl mr-3">{icon}</span>
      <span>{label}</span>
    </Button>
  )
} 