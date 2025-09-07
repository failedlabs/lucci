import { Button } from "@lucci/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lucci/ui/components/popover"
import { useState } from "react"

interface Props {
  icon: string
  setIcon: (icon: string) => void
}

export const ICONS = ["🍕", "🚀", "💩", "🐱", "🏠", "👽", "👾", "🎒", "🩲"]

export function IconSelector({ icon, setIcon }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          type="button"
          className="bg-muted h-12 w-12 text-xl"
        >
          {icon}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-wrap gap-2">
          {ICONS.map((cl, i) => (
            <Button
              variant={"ghost"}
              type="button"
              className="bg-muted h-9 w-9 text-xl"
              key={`icon_select_${i}`}
              onClick={() => {
                setIcon(cl)
                setOpen(false)
              }}
            >
              {cl}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
