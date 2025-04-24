import { Button } from "@/components/ui/button"

interface SizeButtonProps {
  label: string
  size: string
  active: boolean
  onClick: () => void
}

export function SizeButton({ label, size, active, onClick }: SizeButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`
        rounded-xl py-4 px-6 font-bold transition-all duration-300 shadow-lg relative overflow-hidden
        ${
          active
            ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 border-b-4 border-yellow-700 hover:from-yellow-600 hover:to-yellow-700"
            : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 hover:text-white"
        }
      `}
    >
      <div className="flex flex-col items-center">
        <span className="mb-1">{label}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${active ? "bg-yellow-700 text-white" : "bg-gray-600 text-gray-300"}`}>
          {size}
        </span>
      </div>
    </Button>
  )
} 